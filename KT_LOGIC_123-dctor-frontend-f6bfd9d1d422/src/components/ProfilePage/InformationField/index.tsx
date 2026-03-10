import { ReactNode } from "react";

import styles from "./style.module.css";

type InformationFieldProps = {
  icon?: ReactNode;
  label?: string;
  children: ReactNode;
};

export function InformationField({
  icon,
  label,
  children,
}: InformationFieldProps) {
  return (
    <div className={styles.wrapper}>
      {icon && <div className={styles["icon-container"]}>{icon}</div>}
      <div className={styles["label-content-container"]}>
        {label && <h4 className={styles.label}>{label}</h4>}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
