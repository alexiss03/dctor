import { BaseLayout } from "@/components/BaseLayout";
import { DashboardIcon } from "@/icons/dashboard";
import { SchedulerIcon } from "@/icons/scheduler";
import { SettingsIcon } from "@/icons/settings";
import { PropsWithChildren } from "react";

export function DoctorDashboardLayout({ children }: PropsWithChildren) {
  return (
    <BaseLayout
      navItems={[
        {
          href: "/dashboard",
          name: "Dashboard",
          icon: <DashboardIcon />,
        },
        {
          href: "/scheduler",
          name: "Scheduler",
          icon: <SchedulerIcon />,
        },
        {
          href: "/settings/self",
          name: "Settings",
          icon: <SettingsIcon />,
        },
      ]}
    >
      {children}
    </BaseLayout>
  );
}
