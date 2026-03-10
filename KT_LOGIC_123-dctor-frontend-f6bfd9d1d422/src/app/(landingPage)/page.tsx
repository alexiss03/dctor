import { getTreatmentSections } from "@/backendServer/healthcare";
import { getQueryClient } from "@/utils/queryClient";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { LandingPage } from "./LandingPage";

export default async function LandingPageHydrate() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(["treatmentsSections"], {
    queryFn: () =>
      getTreatmentSections().then((response) => {
        if ("error" in response) {
          return [];
        }

        return response.data;
      }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <LandingPage />
    </Hydrate>
  );
}
