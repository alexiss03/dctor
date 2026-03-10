import { getUser } from "@/backendServer/user";
import { getQueryClient } from "@/utils/queryClient";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { UserProfile } from "./UserProfile";

type UserProfilePageProps = {
  params: {
    userId: string;
  };
};

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(["profile", params.userId], {
    queryFn: () =>
      getUser(params.userId).then((response) =>
        "error" in response ? null : response.data
      ),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <UserProfile />
    </Hydrate>
  );
}
