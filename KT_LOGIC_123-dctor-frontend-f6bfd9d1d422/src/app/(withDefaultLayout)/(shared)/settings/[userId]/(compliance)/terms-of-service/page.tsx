import { getTermsOfService } from "@/backendServer/compliance";
import { CompliancePage } from "@/components/CompliancePage";
import { Page } from "@/components/Page";

export default async function TermsOfServicePage() {
  const response = await getTermsOfService();

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
