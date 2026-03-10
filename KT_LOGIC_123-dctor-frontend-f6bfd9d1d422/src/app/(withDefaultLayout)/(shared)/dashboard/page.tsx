import { getTreatmentSections } from "@/backendServer/healthcare";
import { getQueryClient } from "@/utils/queryClient";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { Dashboard } from "./Dashboard";

export default async function DashboardPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(["treatmentsSections"], {
    queryFn: () =>
      getTreatmentSections().then((response) =>
        "error" in response ? [] : response.data
      ),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Dashboard />
    </Hydrate>
  );
}
