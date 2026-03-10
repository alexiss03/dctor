import { getTreatmentSection } from "@/backendServer/healthcare";
import { getQueryClient } from "@/utils/queryClient";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import TreatmentSection from "./TreatmentSection";

type TreatmentSectionPageProps = {
  params: {
    sectionId: string;
  };
};

export default async function TreatmentSectionPage({
  params,
}: TreatmentSectionPageProps) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(["treatmentsSection", params.sectionId], {
    queryFn: () =>
      getTreatmentSection(params.sectionId).then((response) =>
        "error" in response ? null : response.data
      ),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <TreatmentSection />
    </Hydrate>
  );
}
