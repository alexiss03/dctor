import { getCurrentUser } from "@/backendServer/user";
import { DoctorProfile } from "@/types/healthcare";
import { PatientProfile } from "@/types/patient";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export function useCurrentUser<
  T extends PatientProfile | DoctorProfile | User
>() {
  const data = useQuery(["currentUser"], {
    queryFn: () => getCurrentUser<T>().then((response) => response.data),
  });

  return data;
}
