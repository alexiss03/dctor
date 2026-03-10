"use client";

import { getCurrentUser } from "@/backendServer/user";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";
import { AdminDashboardLayout } from "./AdminDashboardLayout";
import { ClinicDashboardLayout } from "./ClinicDashboardLayout";
import { DoctorDashboardLayout } from "./DoctorDashboardLayout";
import { PatientDashboardLayout } from "./PatientDashboardLayout";

export function DashboardLayout({ ...props }: PropsWithChildren) {
  const router = useRouter();

  const {
    data: user,
    isFetched,
    ...args
  } = useQuery(["currentUser"], {
    queryFn: () => getCurrentUser().then((response) => response.data),
  });

  function redirectUser() {
    if (isFetched && !user) {
      router.replace("/");
    }
  }

  useEffect(redirectUser, [args, isFetched, router, user]);

  if (!user) {
    return null;
  }

  if (user.type === "patient") {
    return <PatientDashboardLayout {...props} />;
  } else if (user.type === "admin") {
    return <AdminDashboardLayout {...props} />;
  } else if (user.type === "clinicUser") {
    return <ClinicDashboardLayout {...props} />;
  }

  return <DoctorDashboardLayout {...props} />;
}
