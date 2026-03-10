import { PropsWithChildren } from "react";

import styles from "./style.module.css";

type InputFieldProps = {
  label: string;
};

export function InputField({
  label,
  children,
}: PropsWithChildren<InputFieldProps>) {
  return (
    <div className={styles.container}>
      <div className={styles["label-container"]}>
        <p>{label}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}
