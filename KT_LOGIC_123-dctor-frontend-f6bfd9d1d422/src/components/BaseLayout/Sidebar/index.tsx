"use client";

import { usePrompt } from "@/hooks/usePrompt";
import { LogoutIcon } from "@/icons/logout";
import classNames from "classnames";
import Image from "next/image";
import { ReactNode, SyntheticEvent } from "react";
import { NavLink } from "./NavLink";
import { logout } from "./actions";
import styles from "./style.module.css";

export type NavLinkItem = {
  href: string;
  name: string;
  icon: ReactNode;
};

type SidebarProps = {
  navItems: NavLinkItem[];
};

export function Sidebar({ navItems }: SidebarProps) {
  const { errorPrompt } = usePrompt();

  async function handleLogout(e: SyntheticEvent) {
    e.preventDefault();

    const response = await logout();

    if ("error" in response) {
      errorPrompt(response.error.message);

      return;
    }

    window.location.href = "/";
  }

  return (
    <nav className={classNames(styles.container, "white-box")}>
      <div>
        <div className={styles["logo-container"]}>
          <Image
            src="/logo.svg"
            alt="Dctor Logo"
            width={219}
            height={87}
            priority
          />
        </div>
        <div>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              name={item.name}
              icon={item.icon}
            />
          ))}
        </div>
      </div>

      <div>
        <NavLink name="Logout" icon={<LogoutIcon />} onClick={handleLogout} />
      </div>
    </nav>
  );
}
