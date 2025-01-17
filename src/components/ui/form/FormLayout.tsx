import React, { FC, useState } from "react";
import styled, { css } from "styled-components";
import { Label } from "./Label";

export const FormContainer = styled.div``;

export const FormHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 10px 4px 4px;
  border-bottom: 1px solid ${(props) => props.theme.colors.input.border};
  height: 38px;
  box-sizing: border-box;

  & > * {
    margin-right: 10px;
  }

  & > *:last-child {
    margin-right: 0px;
  }
`;

export interface FormRowProps {
  readonly size?: "medium" | "large";
}

export const FormRow = styled.div<FormRowProps>`
  display: flex;
  padding: 0 10px;
  width: 100%;
  box-sizing: border-box;

  & > * {
    ${(props) =>
      props.size === "large"
        ? css`
            margin-right: 20px;
            margin-bottom: 20px;
          `
        : css`
            margin-right: 10px;
            margin-bottom: 10px;
          `}
  }

  & > *:last-child {
    margin-right: 0px;
  }
`;

interface FormFieldInputProps {
  hasOverride?: boolean;
}

export const FormFieldInput = styled.div<FormFieldInputProps>`
  ${(props) =>
    props.hasOverride
      ? css`
          border-radius: 3px;
          outline: 3px solid ${(props) => props.theme.colors.prefab.background};
        `
      : ""}
`;

export const FormDivider = styled.div`
  margin-bottom: 10px;
  border-bottom: 1px solid ${(props) => props.theme.colors.sidebar.border};
`;

export const FormSpacer = styled.div`
  width: 100%;
`;

interface FormFieldWrapperProps {
  readonly variant?: "normal" | "error" | "warning";
  readonly alignCheckbox?: boolean;
  readonly hasOverride?: boolean;
}

const FormFieldWrapper = styled.div<FormFieldWrapperProps>`
  width: 100%;
  min-width: 0;
  ${(props) =>
    props.variant === "error"
      ? css`
          color: ${props.theme.colors.highlight};
        `
      : ""}
  ${(props) =>
    props.variant === "warning"
      ? css`
          label {
            background-color: #ffc107;
            color: #000;
            border-radius: 3px;
            padding: 5px;
          }
        `
      : ""}      
  ${(props) =>
    props.alignCheckbox
      ? css`
          padding-bottom: 5px;
        `
      : ""}
      ${(props) =>
    props.hasOverride
      ? css`
          font-weight: bold;
        `
      : ""}
`;

export const FormFieldInfo = styled.div`
  opacity: 0.5;
  display: block;
  font-size: 11px;
  margin-top: 5px;
`;

export interface FormFieldProps {
  readonly name: string;
  readonly label?: string | React.ReactNode;
  readonly title?: string;
  readonly info?: string;
  readonly alignCheckbox?: boolean;
  readonly variant?: "normal" | "error" | "warning";
  readonly hasOverride?: boolean;
}

export const FormField: FC<FormFieldProps> = ({
  name,
  label,
  title,
  info,
  variant,
  alignCheckbox,
  hasOverride,
  children,
}) => (
  <FormFieldWrapper
    variant={variant}
    alignCheckbox={alignCheckbox}
    hasOverride={hasOverride}
  >
    {label && (
      <Label htmlFor={name} title={title}>
        {label}
      </Label>
    )}
    <FormFieldInput hasOverride={hasOverride}>{children}</FormFieldInput>
    {info && <FormFieldInfo>{info}</FormFieldInfo>}
  </FormFieldWrapper>
);

export interface FormSectionTitleProps {
  readonly noTopBorder?: boolean;
}

export const FormSectionTitle = styled.div<FormSectionTitleProps>`
  display: flex;
  align-items: center;
  text-transform: uppercase;
  font-size: 11px;
  font-weight: bold;
  padding: 0px 10px;
  height: 30px;
  margin-bottom: 10px;
  background-color: ${(props) => props.theme.colors.input.background};
  color: ${(props) => props.theme.colors.input.text};
  border-top: 1px solid ${(props) => props.theme.colors.input.border};
  border-bottom: 1px solid ${(props) => props.theme.colors.input.border};

  > span {
    flex-grow: 1;
  }

  ${(props) =>
    props.noTopBorder
      ? css`
          border-top: 0;
        `
      : ""}
`;

export const FormLink = styled.div`
  font-size: 11px;
  text-decoration: underline;
  border-radius: 4px;
  padding: 5px;
  margin-left: -5px;
  margin-right: -5px;
  margin-top: -5px;
  margin-bottom: -5px;

  :hover {
    background: rgba(128, 128, 128, 0.1);
  }
  :active {
    background: rgba(128, 128, 128, 0.2);
  }
`;

export interface ToggleableFormFieldProps {
  readonly enabled: boolean;
  readonly disabledLabel: string | React.ReactNode;
}

export const ToggleableFormField: FC<
  ToggleableFormFieldProps & FormFieldProps
> = ({
  enabled,
  disabledLabel,
  name,
  label,
  info,
  variant,
  hasOverride,
  children,
}) => {
  const [isEnabled, setIsEnabled] = useState(enabled);

  if (!isEnabled) {
    return (
      <div>
        <FormLink onClick={() => setIsEnabled(true)}>{disabledLabel}</FormLink>
      </div>
    );
  }

  return (
    <FormField
      name={name}
      label={label}
      info={info}
      variant={variant}
      hasOverride={hasOverride}
    >
      {children}
    </FormField>
  );
};
