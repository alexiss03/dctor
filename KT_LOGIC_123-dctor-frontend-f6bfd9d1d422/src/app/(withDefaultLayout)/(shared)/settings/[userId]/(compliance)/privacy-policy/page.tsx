import { getPrivacyPolicy } from "@/backendServer/compliance";
import { CompliancePage } from "@/components/CompliancePage";
import { Page } from "@/components/Page";

export default async function PrivacyPolicyPage() {
  const response = await getPrivacyPolicy();

  if (!response) {
    // @TODO: handle error
    return <Page title="Settings" />;
  }

  return (
    <CompliancePage
      pageTitle="Settings"
      title={response.title}
      body={response.body}
    />
  );
}
