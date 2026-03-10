import { PropsWithChildren, ReactNode } from "react";
import { PageTopBar } from "./PageTopBar";

import styles from "./style.module.css";

type PageProps = {
  title?: string;
  render?: ReactNode;
  backUrl?: string | -1;
};

export function Page({
  title,
  render,
  children,
  backUrl,
}: PropsWithChildren<PageProps>) {
  const renderTopBar = title || render;

  return (
    <div className={styles.wrapper}>
      {renderTopBar && (
        <PageTopBar title={title} render={render} backUrl={backUrl} />
      )}
      <div className={styles["background-wrapper"]}>
        <main className={styles["main-container"]}>{children}</main>
      </div>
    </div>
  );
}
