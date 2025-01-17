import React, { FC, useCallback, useState } from "react";
import { triggerPrefabSelectors } from "store/features/entities/entitiesState";
import { DropdownButton } from "ui/buttons/DropdownButton";
import { EditableText } from "ui/form/EditableText";
import { FormContainer, FormHeader, FormRow } from "ui/form/FormLayout";
import { MenuDivider, MenuItem, MenuItemIcon } from "ui/menu/Menu";
import entitiesActions from "store/features/entities/entitiesActions";
import editorActions from "store/features/editor/editorActions";
import clipboardActions from "store/features/clipboard/clipboardActions";
import { TriggerPrefabNormalized } from "shared/lib/entities/entitiesTypes";
import { Sidebar, SidebarColumn, SidebarColumns } from "ui/sidebars/Sidebar";
import { WorldEditor } from "./WorldEditor";
import { NoteField } from "ui/form/NoteField";
import { triggerName } from "shared/lib/entities/entitiesHelpers";
import l10n from "shared/lib/lang/l10n";
import { useAppDispatch, useAppSelector } from "store/hooks";
import CachedScroll from "ui/util/CachedScroll";
import { FlexGrow } from "ui/spacing/Spacing";
import {
  SplitPaneHeader,
  Wrapper as SplitPaneHeaderWrapper,
} from "ui/splitpane/SplitPaneHeader";
import styled from "styled-components";
import { TriggerPrefabUsesList } from "./prefab/TriggerPrefabUsesList";
import { TriggerPrefabEditorScripts } from "./prefab/TriggerPrefabEditorScripts";
import { CheckIcon, BlankIcon } from "ui/icons/Icons";

interface TriggerPrefabEditorProps {
  id: string;
}

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  ${FormHeader} {
    background: ${(props) => props.theme.colors.prefab.background};
    color: ${(props) => props.theme.colors.prefab.text};
    input {
      color: ${(props) => props.theme.colors.prefab.text};

      ::placeholder {
        color: ${(props) => props.theme.colors.prefab.text};
        opacity: 0.5;
      }
      :focus {
        background: ${(props) => props.theme.colors.input.background};
        color: ${(props) => props.theme.colors.input.text};
        border: 1px solid ${(props) => props.theme.colors.highlight};
      }
    }
    svg {
      fill: ${(props) => props.theme.colors.prefab.text};
    }
  }
`;

const UsesCollapsedWrapper = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 17px;
  border-top: 1px solid ${(props) => props.theme.colors.input.border};

  ${SplitPaneHeaderWrapper} {
    border-bottom: 0;
  }
`;

export const TriggerPrefabEditor: FC<TriggerPrefabEditorProps> = ({ id }) => {
  const triggerPrefabIds = useAppSelector(triggerPrefabSelectors.selectIds);
  const prefab = useAppSelector((state) =>
    triggerPrefabSelectors.selectById(state, id)
  );

  const index = React.useMemo(
    () => triggerPrefabIds.indexOf(id),
    [triggerPrefabIds, id]
  );

  const [notesOpen, setNotesOpen] = useState<boolean>(!!prefab?.notes);

  const lockScriptEditor = useAppSelector(
    (state) => state.editor.lockScriptEditor
  );

  const lastScriptTab = useAppSelector((state) => state.editor.lastScriptTab);

  const showUses = useAppSelector((state) => state.editor.showScriptUses);

  const dispatch = useAppDispatch();

  const onChangeTriggerPrefabProp = useCallback(
    <K extends keyof TriggerPrefabNormalized>(
      key: K,
      value: TriggerPrefabNormalized[K]
    ) => {
      dispatch(
        entitiesActions.editTriggerPrefab({
          triggerPrefabId: id,
          changes: {
            [key]: value,
          },
        })
      );
    },
    [dispatch, id]
  );

  const onChangeName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChangeTriggerPrefabProp("name", e.currentTarget.value),
    [onChangeTriggerPrefabProp]
  );

  const onChangeNotes = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChangeTriggerPrefabProp("notes", e.currentTarget.value),
    [onChangeTriggerPrefabProp]
  );

  const selectSidebar = () => {
    dispatch(editorActions.selectSidebar());
  };

  const onRemove = () => {
    if (prefab) {
      dispatch(
        entitiesActions.removeTriggerPrefab({ triggerPrefabId: prefab.id })
      );
    }
  };

  const onFetchClipboard = useCallback(() => {
    dispatch(clipboardActions.fetchClipboard());
  }, [dispatch]);

  const onAddNotes = () => {
    setNotesOpen(true);
  };

  const setShowUses = useCallback(
    (value: boolean) => {
      dispatch(editorActions.setShowScriptUses(value));
    },
    [dispatch]
  );

  if (!prefab) {
    return <WorldEditor />;
  }

  const showNotes = prefab.notes || notesOpen;

  const scrollKey = `${prefab.id}_${lastScriptTab}`;

  return (
    <Sidebar onClick={selectSidebar}>
      <CachedScroll key={scrollKey} cacheKey={scrollKey}>
        <FlexWrapper>
          {!lockScriptEditor && (
            <FormContainer>
              <FormHeader>
                <EditableText
                  name="name"
                  placeholder={triggerName(prefab, index)}
                  value={prefab.name || ""}
                  onChange={onChangeName}
                />
                <DropdownButton
                  size="small"
                  variant="transparent"
                  menuDirection="right"
                  onMouseDown={onFetchClipboard}
                >
                  {!showNotes && !showUses && (
                    <MenuItem onClick={onAddNotes}>
                      <MenuItemIcon>
                        <BlankIcon />
                      </MenuItemIcon>
                      {l10n("FIELD_ADD_NOTES")}
                    </MenuItem>
                  )}
                  {!showUses && <MenuDivider key="div-view-mode" />}
                  <MenuItem
                    key="view-editor"
                    onClick={() => setShowUses(false)}
                  >
                    <MenuItemIcon>
                      {!showUses ? <CheckIcon /> : <BlankIcon />}
                    </MenuItemIcon>
                    {l10n("MENU_EDIT_PREFAB")}
                  </MenuItem>
                  <MenuItem key="view-uses" onClick={() => setShowUses(true)}>
                    <MenuItemIcon>
                      {showUses ? <CheckIcon /> : <BlankIcon />}
                    </MenuItemIcon>
                    {l10n("FIELD_VIEW_PREFAB_USES")}
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={onRemove}>
                    <MenuItemIcon>
                      <BlankIcon />
                    </MenuItemIcon>
                    {l10n("MENU_DELETE_PREFAB")}
                  </MenuItem>
                </DropdownButton>
              </FormHeader>
            </FormContainer>
          )}

          {showUses ? (
            <TriggerPrefabUsesList id={id} onClose={() => setShowUses(false)} />
          ) : (
            <>
              {!lockScriptEditor && (
                <SidebarColumns>
                  {showNotes && (
                    <SidebarColumn>
                      {showNotes && (
                        <FormContainer>
                          <FormRow>
                            <NoteField
                              value={prefab.notes || ""}
                              onChange={onChangeNotes}
                            />
                          </FormRow>
                        </FormContainer>
                      )}
                    </SidebarColumn>
                  )}
                </SidebarColumns>
              )}
              <TriggerPrefabEditorScripts prefab={prefab} />
            </>
          )}

          {!showUses && (
            <>
              <FlexGrow />
              <UsesCollapsedWrapper>
                <SplitPaneHeader
                  collapsed={true}
                  onToggle={() => setShowUses(true)}
                >
                  {l10n("SIDEBAR_PREFAB_USES")}
                </SplitPaneHeader>
              </UsesCollapsedWrapper>
            </>
          )}
        </FlexWrapper>
      </CachedScroll>
    </Sidebar>
  );
};
