"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import classNames from "classnames";
import { MouseEventHandler, ReactNode } from "react";
import styles from "./style.module.css";

type NavLinkProps = {
  href?: string;
  name: string;
  icon: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export function NavLink({ href, name, icon, onClick }: NavLinkProps) {
  const pathname = usePathname();

  const active = href && pathname.startsWith(href);

  return (
    <Link
      className={classNames(styles.link, { [styles.active]: active })}
      href={href ?? "#"}
      onClick={onClick}
    >
      <div className={styles["icon-container"]}>{icon}</div>
      <div>{name}</div>
    </Link>
  );
}
