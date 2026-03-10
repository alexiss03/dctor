"use client";

import { BaseLayout } from "@/components/BaseLayout";
import { NavLinkItem } from "@/components/BaseLayout/Sidebar";
import { AddIcon } from "@/icons/add";
import { DoctorSearchIcon } from "@/icons/doctorSearch";
import { UserSearchIcon } from "@/icons/userSearch";
import { PropsWithChildren } from "react";

const navItems: NavLinkItem[] = [
  {
    href: "/search/user",
    name: "User Search",
    icon: <UserSearchIcon />,
  },
  {
    href: "/search/doctor",
    name: "Doctor/Clinic",
    icon: <DoctorSearchIcon />,
  },
  {
    href: "/users/add",
    name: "Add New Account",
    icon: <AddIcon />,
  },
];

export function AdminDashboardLayout({ children }: PropsWithChildren) {
  return <BaseLayout navItems={navItems}>{children}</BaseLayout>;
}
