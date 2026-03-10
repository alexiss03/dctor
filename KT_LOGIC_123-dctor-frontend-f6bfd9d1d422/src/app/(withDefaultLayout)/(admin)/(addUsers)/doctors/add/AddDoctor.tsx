"use client";

import { getClinics, getTreatments } from "@/backendServer/healthcare";
import { getInsurances } from "@/backendServer/insurance";
import { useQuery } from "@tanstack/react-query";
import { AddUser } from "../../common/AddUser";
import { AddUserProvider } from "../../common/AddUserContext";
import { AffiliatedClinics } from "../../common/AffiliatedClinics";
import { BasicDetails } from "../../common/BasicDetails";
import { ClinicTreatments } from "../../common/ClinicTreatments";
import { Insurances } from "../../common/Insurances";
import { SetSchedule } from "../../common/SetSchedule";

export function AddDoctor() {
  const { data: clinics } = useQuery(["clinics"], {
    queryFn: () =>
      getClinics().then((response) =>
        "error" in response ? [] : response.data
      ),
    initialData: [],
  });
  const { data: insurances } = useQuery(["insurances"], {
    queryFn: () =>
      getInsurances().then((response) =>
        "error" in response ? [] : response.data
      ),
    initialData: [],
  });
  const { data: treatments } = useQuery(["treatments"], {
    queryFn: () =>
      getTreatments().then((response) =>
        "error" in response ? [] : response.data
      ),
    initialData: [],
  });

  const steps = [
    {
      title: "Account Profile",
      render: <BasicDetails type="doctor" />,
    },
    {
      title: "Affiliated Clinics",
      render: <AffiliatedClinics clinics={clinics} />,
    },
    {
      title: "Set Insurances",
      render: <Insurances insurances={insurances} />,
    },
    {
      title: "Set Schedule",
      render: <SetSchedule />,
    },
    {
      title: "Set Clinic Treatments",
      render: <ClinicTreatments treatments={treatments} />,
    },
  ];

  return (
    <AddUserProvider steps={steps} clinics={clinics}>
      <AddUser />
    </AddUserProvider>
  );
}
