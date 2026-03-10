import { PropsWithChildren, ReactNode } from "react";

import { BackButton } from "@/components/BackButton";
import styles from "./style.module.css";

type SectionHeaderProps = {
  action?: ReactNode;
  backUrl?: string;
};

export function SectionHeader({
  action,
  backUrl,
  children,
}: PropsWithChildren<SectionHeaderProps>) {
  return (
    <div className={styles["section-header-container"]}>
      {backUrl && <BackButton href={backUrl} />}
      <h1>{children}</h1>
      {action}
    </div>
  );
}
