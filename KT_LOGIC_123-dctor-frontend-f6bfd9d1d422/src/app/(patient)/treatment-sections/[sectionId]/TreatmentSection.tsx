"use client";

import { getTreatmentSection } from "@/backendServer/healthcare";
import { Page } from "@/components/Page";
import { TreatmentSectionGroup } from "@/components/TreatmentSectionGroup";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function TreatmentSection() {
  const params = useParams();

  const id = params["sectionId"] as string;

  const { data: treatmentSection } = useQuery(["treatmentsSection", id], {
    queryFn: () =>
      getTreatmentSection(id).then((response) =>
        "error" in response ? null : response.data
      ),
  });

  return (
    <Page title="Find your Treatments" backUrl="/dashboard">
      {treatmentSection && (
        <div style={{ display: "grid", justifyContent: "center" }}>
          <TreatmentSectionGroup
            name={treatmentSection.name}
            categories={treatmentSection.categories}
            sectionId={treatmentSection.id}
            showViewAll={false}
            description={treatmentSection.description}
          />
        </div>
      )}
    </Page>
  );
}
