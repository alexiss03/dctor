import { PropsWithChildren } from "react";

import styles from "./style.module.css";

export function InputLabel({ children }: PropsWithChildren) {
  return <p className={styles.text}>{children}</p>;
}
