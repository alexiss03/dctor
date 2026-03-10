"use client";

import { ComponentProps, ReactNode, useId } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import RawSelect, { StylesConfig } from "react-select";

const styles: StylesConfig = {
  container: (styles) => ({
    ...styles,
    marginBottom: "1rem",
    ":last-child": {
      marginBottom: "0",
    },
    textAlign: "left",
  }),
  control: (styles, { isDisabled }) => {
    return {
      ...styles,
      backgroundColor: !isDisabled ? "white" : "#FAFAFA",
      border: "none",
      boxShadow: "0 0 8px 0 rgba(0,0,0,0.05);",
      fontSize: "0.8rem",
      lineHeight: "1rem",
    };
  },
  valueContainer: (styles, data) => {
    let padding = "1rem";

    if (data.isMulti && data.hasValue) {
      padding = "calc(1rem - 5px) 1rem";
    }

    return {
      ...styles,
      padding,
    };
  },
  placeholder: (styles) => ({
    ...styles,
    color: "#9F9F9F",
  }),
  input: (styles) => ({
    ...styles,
    margin: "0",
    padding: "0",
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    backgroundColor: "hsl(0, 0%, 95%)",
  }),
  multiValue: (styles) => ({
    ...styles,
    marginRight: "0.5rem",
  }),
  menu: (styles) => ({
    ...styles,
    fontSize: "0.8rem",
  }),
};

export type Option = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

type SelectProps = ComponentProps<typeof RawSelect> & {
  name?: string;
  placeholder?: string;
  options: Option[];
  loadingOnFormSubmit?: boolean;
};

export function Select({
  name,
  placeholder,
  loadingOnFormSubmit = true,
  ...props
}: SelectProps) {
  const { pending } = useFormStatus();

  const isLoading = loadingOnFormSubmit && pending;

  return (
    <RawSelect
      {...props}
      name={name}
      styles={styles}
      placeholder={placeholder}
      instanceId={useId()}
      isDisabled={isLoading}
      isOptionDisabled={(option) => !!(option as Option).disabled}
    />
  );
}
