"use client";

import { getCurrentUser } from "@/backendServer/user";
import { Page } from "@/components/Page";
import { DoctorProfile } from "@/types/healthcare";
import { PatientProfile } from "@/types/patient";
import { ClinicUser } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { HealthcareDashboard } from "./HealthcareDashboard";
import { PatientDashboard } from "./PatientDashboard";

export function Dashboard() {
  const router = useRouter();

  const { data: user, isFetched } = useQuery(["currentUser"], {
    queryFn: () => getCurrentUser().then((response) => response.data),
  });

  function redirectUser() {
    if (!user && isFetched) {
      router.replace("/");
    }

    if (user?.type == "admin") {
      router.replace("/search/user");
    }
  }

  useEffect(redirectUser, [isFetched, router, user]);

  if (!isFetched && !user) {
    return <Page />;
  }

  if (!user) {
    return null;
  }

  if (user.type === "patient") {
    return <PatientDashboard user={user as PatientProfile} />;
  } else if (user.type === "doctor") {
    return <HealthcareDashboard user={user as DoctorProfile} />;
  } else if (user.type === "clinicUser") {
    return <HealthcareDashboard user={user as ClinicUser} />;
  }
}
