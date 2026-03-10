"use client";

import { HTMLProps, ReactNode, forwardRef, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { useFilePicker } from "use-file-picker";

import { PasswordRevealIcon } from "@/icons/passwordReveal";
import classNames from "classnames";
import {
  FileAmountLimitValidator,
  FileSizeValidator,
  ImageDimensionsValidator,
} from "use-file-picker/validators";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import styles from "./style.module.css";

export type InputProps = HTMLProps<HTMLInputElement> & {
  prefixElement?: ReactNode;
  suffixElement?: ReactNode;
  full?: boolean;
  loadingOnFormSubmit?: boolean;
  type: HTMLProps<HTMLInputElement>["type"] | "currency";
  text?: string;
  wrapperClassName?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    prefixElement,
    suffixElement,
    full = false,
    loadingOnFormSubmit = true,
    text,
    wrapperClassName,
    ...props
  },
  ref
) {
  const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);

  const { openFilePicker, filesContent, errors } = useFilePicker({
    readAs: "DataURL",
    accept: [".jpg", ".jpeg", ".png", ".gif"],
    validators: [
      new FileAmountLimitValidator({ max: 1 }),
      new FileSizeValidator({ maxFileSize: 10000000 }),
      new ImageDimensionsValidator({
        minHeight: 128,
        minWidth: 128,
      }),
    ],
  });

  if (props.type === "password") {
    suffixElement = (
      <IconButton onClick={() => setIsPasswordRevealed(!isPasswordRevealed)}>
        <PasswordRevealIcon />
      </IconButton>
    );
  }

  const renderOverlay = prefixElement || suffixElement;

  const { pending } = useFormStatus();

  const isLoading = loadingOnFormSubmit && pending;

  if (props.type === "image") {
    const fileContent = filesContent[0]?.content;

    const errorMessagesMap: Record<string, string> = {
      FileSizeError: "File size is too large.",
      FileAmountLimitError: "You can only select 1 image.",
      ImageDimensionError: "Image must be at least 128x128.",
    };

    return (
      <div
        className={classNames(
          styles.wrapper,
          styles["image-selector-container"]
        )}
      >
        <div
          className={styles["image-preview"]}
          style={{
            backgroundImage: fileContent
              ? `url("${fileContent}")`
              : props.defaultValue
              ? `url("${props.defaultValue as string}")`
              : "",
          }}
        />
        <div>
          <Button
            variant="primary"
            onClick={() => openFilePicker()}
            size="large"
          >
            {text}
          </Button>
          <p className={styles["image-selector-notes"]}>
            Must be JPEG, PNG, or GIF, at least 128x128, and cannot exceed 10MB.
          </p>
          {errors.map((error) => (
            <p key={error.name} className={styles["image-error-text"]}>
              {errorMessagesMap[error.name] ?? "Error selecting file."}
            </p>
          ))}
        </div>
        <input
          {...props}
          type="hidden"
          value={fileContent ?? ""}
          defaultValue={undefined}
        />
      </div>
    );
  }

  return (
    <div
      className={classNames(
        styles.wrapper,
        { [styles.full]: full },
        wrapperClassName
      )}
    >
      {props.type === "currency" ? (
        <CurrencyInput
          prefix="$USD "
          // @ts-ignore
          ref={ref}
          {...props}
          className={classNames(
            styles.input,
            props.className,
            styles["currency-prefix"],
            {
              [styles.full]: full,
              [styles["has-suffix"]]: !!suffixElement,
            }
          )}
          disabled={props.disabled || isLoading}
          defaultValue={(props.defaultValue ?? "0") as string | number}
        />
      ) : (
        <input
          ref={ref}
          {...props}
          className={classNames(
            styles.input,
            {
              [styles.full]: full,
              [styles["has-prefix"]]: !!prefixElement,
              [styles["has-suffix"]]: !!suffixElement,
            },
            props.className
          )}
          disabled={props.disabled || isLoading}
          type={isPasswordRevealed ? "text" : props.type}
        />
      )}

      {renderOverlay && (
        <div className={styles.overlay}>
          <div className={styles["overlay-item"]}>{prefixElement}</div>
          <div className={styles["overlay-item"]}>{suffixElement}</div>
        </div>
      )}
    </div>
  );
});
