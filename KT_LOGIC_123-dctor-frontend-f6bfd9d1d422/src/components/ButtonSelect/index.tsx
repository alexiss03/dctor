"use client";

import { useState } from "react";
import { Button } from "../Button";

import styles from "./style.module.css";

type Option = {
  value: string;
  text: string;
};

type SelectProps = {
  label?: string;
  name?: string;
  options: Option[];
  loadingOnFormSubmit?: boolean;
  defaultValue?: string;
  onSelect?(value: string): void;
};

export function ButtonSelect({
  name,
  label,
  options,
  loadingOnFormSubmit = false,
  defaultValue,
  onSelect,
}: SelectProps) {
  const [value, setValue] = useState<string>(defaultValue ?? options[0].value);

  function handleOptionClick(value: string) {
    setValue(value);
    onSelect && onSelect(value);
  }

  return (
    <div className={styles.wrapper}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles["options-container"]}>
        {options.map((option) => (
          <Button
            key={option.value}
            type="button"
            size="large"
            variant={option.value === value ? "primary" : "secondary"}
            loadingOnFormSubmit={loadingOnFormSubmit}
            onClick={() => handleOptionClick(option.value)}
          >
            {option.text}
          </Button>
        ))}
      </div>
      <input name={name} type="hidden" value={value} />
    </div>
  );
}
