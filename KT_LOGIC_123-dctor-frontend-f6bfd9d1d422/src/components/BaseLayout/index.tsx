import { ReactNode } from "react";
import { NavLinkItem, Sidebar } from "./Sidebar";

import styles from "./style.module.css";

type BaseLayoutProps = {
  children: ReactNode;
  navItems: NavLinkItem[];
};

export function BaseLayout({ children, navItems }: BaseLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <Sidebar navItems={navItems} />
      <div className={styles["background-wrapper"]}>{children}</div>
    </div>
  );
}
