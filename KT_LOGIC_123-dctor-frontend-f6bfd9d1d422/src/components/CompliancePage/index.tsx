import { Page } from "@/components/Page";

type CompliancePageProps = {
  pageTitle: string;
  title: string;
  body: string;
  backUrl?: string;
};

export function CompliancePage({
  pageTitle,
  title,
  body,
  backUrl,
}: CompliancePageProps) {
  return (
    <Page title={pageTitle} backUrl={backUrl}>
      <div className="white-box container">
        <h1>{title}</h1>
        {body.split("\n").map((segment, i) => (
          <p key={i}>{segment}</p>
        ))}
      </div>
    </Page>
  );
}
