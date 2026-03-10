import { Page } from "@/components/Page";
import { PropsWithChildren } from "react";
import { AppointmentTabs } from "./AppointmentTabs";

export default async function AppointmentLayout({
  children,
}: PropsWithChildren) {
  return <Page render={<AppointmentTabs />}>{children}</Page>;
}
