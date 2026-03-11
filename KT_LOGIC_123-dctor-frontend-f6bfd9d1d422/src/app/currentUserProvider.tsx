import { getCurrentUser } from "@/backendServer/user";
import { getQueryClient } from "@/utils/queryClient";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

export async function CurrentUserProvider({ children }: PropsWithChildren) {
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery(["currentUser"], {
      queryFn: async () => {
        try {
          const response = await getCurrentUser();
          return response?.data ?? null;
        } catch {
          return null;
        }
      },
    });
  } catch {
    // Never let a current-user prefetch failure crash the root layout.
    queryClient.setQueryData(["currentUser"], null);
  }

  const dehydratedState = dehydrate(queryClient);

  return <Hydrate state={dehydratedState}>{children}</Hydrate>;
}
