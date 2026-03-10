"use client";

import classNames from "classnames";
import { ReactNode } from "react";

import styles from "./style.module.css";

type InfoBoxProps = {
  label: string;
  children: ReactNode;
  actions?: ReactNode[];
};

export function InfoBox({ label, children, actions }: InfoBoxProps) {
  return (
    <div className={classNames(styles.container, "white-box")}>
      <div className={styles["label-actions-container"]}>
        <h3 className={styles.label}>{label}</h3>
        {actions && <div>{actions}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
