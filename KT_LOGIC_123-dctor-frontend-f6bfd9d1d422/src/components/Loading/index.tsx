import { Page } from "@/components/Page";

type LoadingProps = {
  fullPage?: boolean;
};

export default function Loading({ fullPage }: LoadingProps) {
  if (fullPage) {
    return (
      <Page>
        <div className="loading-wrapper">
          <p>Loading...</p>
        </div>
      </Page>
    );
  }

  return (
    <div style={{ marginTop: "4rem", textAlign: "center" }}>
      <p>Loading...</p>
    </div>
  );
}
