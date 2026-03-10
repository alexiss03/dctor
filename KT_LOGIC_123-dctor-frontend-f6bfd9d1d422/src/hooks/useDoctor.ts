import { getUser } from "@/backendServer/user";
import { BaseDoctor, DoctorProfile } from "@/types/healthcare";
import { useQuery } from "@tanstack/react-query";

export function useDoctor(id: BaseDoctor["id"]) {
  const data = useQuery(["profile", id], {
    queryFn: () =>
      getUser<DoctorProfile>(id).then((response) =>
        "error" in response ? null : response.data
      ),
  });

  return data;
}
