import { PropsWithChildren } from "react";
import { DashboardLayout } from "./DashboardLayout";

export default async function Layout({ children }: PropsWithChildren) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
