import classNames from "classnames";
import { HTMLProps, forwardRef } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

import styles from "./style.module.css";

export type TextAreaProps = HTMLProps<HTMLTextAreaElement> & {
  loadingOnFormSubmit?: boolean;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ loadingOnFormSubmit = true, ...props }, ref) {
    const { pending } = useFormStatus();

    const isLoading = loadingOnFormSubmit && pending;

    return (
      <textarea
        ref={ref}
        {...props}
        className={classNames(props.className, styles.input)}
        disabled={props.disabled || isLoading}
      />
    );
  }
);
