"use client";

import { getCurrentUser } from "@/backendServer/user";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

type UserGuardProps = {
  allowedTypes?: ("admin" | "patient" | "doctor" | "clinicUser")[];
};

export function UserGuard({
  allowedTypes = ["admin", "patient", "doctor", "clinicUser"],
  children,
}: PropsWithChildren<UserGuardProps>) {
  const router = useRouter();

  const { data: user, isFetched } = useQuery(["currentUser"], {
    queryFn: () => getCurrentUser().then((response) => response.data),
  });

  function redirect() {
    if (!isFetched) {
      return;
    }

    if (!user) {
      router.replace("/login");

      return;
    }

    if (!allowedTypes.includes(user.type)) {
      router.replace("/dashboard");

      return;
    }
  }

  useEffect(redirect, [allowedTypes, isFetched, router, user]);

  if (!isFetched || (user && !allowedTypes.includes(user.type))) {
    return null;
  }

  return children;
}
