"use client";

import { BaseLayout } from "@/components/BaseLayout";
import { NavLinkItem } from "@/components/BaseLayout/Sidebar";
import { AppointmentIcon } from "@/icons/appointment";
import { DashboardIcon } from "@/icons/dashboard";
import { NotificationsIcon } from "@/icons/notifications";
import { SearchIcon } from "@/icons/search";
import { SettingsIcon } from "@/icons/settings";
import { PropsWithChildren } from "react";

const navItems: NavLinkItem[] = [
  {
    href: "/dashboard",
    name: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    href: "/appointments",
    name: "Appointments",
    icon: <AppointmentIcon />,
  },
  {
    href: "/search",
    name: "Search",
    icon: <SearchIcon />,
  },
  {
    href: "/notifications",
    name: "Notifications",
    icon: <NotificationsIcon />,
  },
  {
    href: "/settings/self",
    name: "Settings",
    icon: <SettingsIcon />,
  },
];

export function PatientDashboardLayout({ children }: PropsWithChildren) {
  return <BaseLayout navItems={navItems}>{children}</BaseLayout>;
}
