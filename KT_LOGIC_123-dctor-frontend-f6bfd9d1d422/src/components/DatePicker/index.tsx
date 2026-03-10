"use client";

import classNames from "classnames";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";

import inputStyles from "@/components/Input/style.module.css";
import dayjs from "dayjs";
import { Inter } from "next/font/google";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import styles from "./style.module.css";

const inter = Inter({ subsets: ["latin"] });

type DatePickerProps = {
  name?: string;
  full?: boolean;
  initialValue?: Date;
  required?: boolean;
  placeholder?: string;
  loadingOnFormSubmit?: boolean;
  inline?: boolean;
  onChange?(date: Date | null): void;
  minDate?: Date | null;
  format?: string;
  onMonthChange?(date: Date): void;
  includeDates?: Date[] | undefined;
};

export function DatePicker({
  name,
  full = false,
  initialValue,
  required,
  placeholder,
  loadingOnFormSubmit = false,
  inline = false,
  onChange,
  minDate,
  format,
  onMonthChange,
  includeDates,
}: DatePickerProps) {
  const { pending } = useFormStatus();
  const [value, setValue] = useState<Date | null>(initialValue ?? null);

  const isLoading = loadingOnFormSubmit && pending;

  function onChangeFn(date: Date | null) {
    setValue(date);
    onChange && onChange(date);
  }

  return (
    <div className={classNames(styles.wrapper, { [styles.full]: full })}>
      <ReactDatePicker
        selected={value}
        onChange={(date) => onChangeFn(date)}
        placeholderText={placeholder}
        className={classNames(inputStyles.input, { [styles.full]: full })}
        disabled={isLoading}
        required={required}
        inline={inline}
        calendarClassName={classNames(
          "white-box",
          styles.calendar,
          inter.className
        )}
        showPopperArrow={false}
        minDate={minDate}
        onMonthChange={onMonthChange}
        includeDates={includeDates}
        forceShowMonthNavigation
      />
      <input
        name={name}
        type="hidden"
        value={
          value
            ? format
              ? dayjs(value).format(format)
              : dayjs(value).toISOString()
            : ""
        }
      />
    </div>
  );
}
