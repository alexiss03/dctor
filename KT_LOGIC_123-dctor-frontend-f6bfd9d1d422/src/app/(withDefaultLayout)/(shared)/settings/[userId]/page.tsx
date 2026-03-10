import { Settings } from "./Settings";

export default async function SettingsPage({
  params,
}: {
  params: { userId: string };
}) {
  return <Settings id={params.userId} />;
}
