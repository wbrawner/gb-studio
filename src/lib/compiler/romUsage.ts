import fs from "fs-extra";
import ensureBuildTools from "lib/compiler/ensureBuildTools";
import spawn from "lib/helpers/cli/spawn";
import l10n from "shared/lib/lang/l10n";

type RomUsageOptions = {
  buildRoot: string;
  tmpPath: string;
  progress: (msg: string) => void;
  warnings: (msg: string) => void;
};

export type UsageData = {
  banks: Array<{
    name: string;
    type: string;
    baseBankNum: string;
    isBanked: string;
    isMergedBank: string;
    rangeStart: string;
    rangeEnd: string;
    size: string;
    used: string;
    free: string;
    usedPercent: string;
    freePercent: string;
    miniGraph: string;
  }>;
};

const romUsage = async ({
  buildRoot = "/tmp",
  tmpPath = "/tmp",
  warnings = (_msg) => {},
  progress = (_msg) => {},
}: RomUsageOptions) => {
  const env = Object.create(process.env);

  const buildToolsPath = await ensureBuildTools(tmpPath);
  const buildToolsVersion = await fs.readFile(
    `${buildToolsPath}/tools_version`,
    "utf8"
  );

  env.PATH = [`${buildToolsPath}/gbdk/bin`, env.PATH].join(":");
  env.GBDKDIR = `${buildToolsPath}/gbdk/`;
  env.GBS_TOOLS_VERSION = buildToolsVersion;

  const options = {
    cwd: buildRoot,
    env,
    shell: true,
  };

  const romusageCommand =
    process.platform === "win32"
      ? `..\\_gbstools\\gbdk\\bin\\romusage.exe`
      : `../_gbstools/gbdk/bin/romusage`;
  const romusageArgs = [`${buildRoot}/build/rom/game.map`, `-g`, `-sH`, `-sJ`];

  let output = "";
  progress(`${l10n("COMPILER_ROMUSAGE")}...`);
  const { completed: romusageCompleted } = spawn(
    romusageCommand,
    romusageArgs,
    options,
    {
      onLog: (msg) => {
        output += msg;
      },
      onError: (msg) => {
        if (msg.indexOf("Romusage") > -1) {
          return;
        }
        warnings(msg);
      },
    }
  );

  await romusageCompleted;

  return JSON.parse(output) as UsageData;
};

export default romUsage;
