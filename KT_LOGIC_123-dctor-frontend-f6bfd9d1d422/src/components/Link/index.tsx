"use client";

import { ComponentProps, forwardRef } from "react";

import classNames from "classnames";
import RawLink from "next/link";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

import styles from "./style.module.css";

type LinkProps = ComponentProps<typeof RawLink> & {
  loadingOnFormSubmit?: boolean;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Input(
  { loadingOnFormSubmit = false, ...props },
  ref
) {
  const { pending } = useFormStatus();

  const isLoading = loadingOnFormSubmit && pending;

  return (
    <RawLink
      ref={ref}
      {...props}
      className={classNames(props.className, {
        [styles.disabled]: isLoading,
      })}
    />
  );
});
