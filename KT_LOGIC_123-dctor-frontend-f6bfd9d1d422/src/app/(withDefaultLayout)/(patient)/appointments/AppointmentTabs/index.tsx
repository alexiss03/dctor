"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import classNames from "classnames";
import styles from "./style.module.css";

type TabProps = {
  href: string;
  text: string;
};

function Tab({ href, text }: TabProps) {
  const pathname = usePathname();

  const active = pathname == href;

  return (
    <Link
      href={href}
      className={classNames(styles["tab-link"], { [styles.active]: active })}
    >
      {text}
    </Link>
  );
}

export function AppointmentTabs() {
  return (
    <div className={styles["tabs-container"]}>
      <Tab href="/appointments" text="Incoming"></Tab>
      <Tab href="/appointments/history" text="Past"></Tab>
      {/* <Tab href="/appointments/saved" text="Saved"></Tab> */}
    </div>
  );
}
