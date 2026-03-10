"use client";

import { experimental_useFormStatus as useFormStatus } from "react-dom";

import classNames from "classnames";
import { ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./style.module.css";

type ButtonProps = {
  variant?: "primary" | "secondary" | "clear" | "danger";
  size?: "default" | "medium" | "large";
  full?: boolean;
  loadingOnFormSubmit?: boolean;
  loadingText?: ReactNode;
};

export function Button({
  variant = "secondary",
  size = "default",
  full = false,
  loadingOnFormSubmit = false,
  loadingText,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps) {
  const { pending } = useFormStatus();

  const isLoading = loadingOnFormSubmit && pending;

  return (
    <button
      {...props}
      type={type}
      className={classNames(styles.button, props.className, {
        [styles.primary]: variant === "primary",
        [styles.secondary]: variant === "secondary",
        [styles.clear]: variant === "clear",
        [styles.danger]: variant === "danger",
        [styles.default]: size === "default",
        [styles.medium]: size === "medium",
        [styles.large]: size === "large",
        [styles.full]: full,
      })}
      disabled={props.disabled ?? isLoading}
    >
      {isLoading && loadingText ? loadingText : props.children}
    </button>
  );
}
