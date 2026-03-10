import { ReactNode } from "react";

import styles from "./style.module.css";

type ActionButtonsProps = {
  actions: ReactNode[];
};

export function ActionButtons({ actions }: ActionButtonsProps) {
  return <div className={styles["actions-container"]}>{actions}</div>;
}
