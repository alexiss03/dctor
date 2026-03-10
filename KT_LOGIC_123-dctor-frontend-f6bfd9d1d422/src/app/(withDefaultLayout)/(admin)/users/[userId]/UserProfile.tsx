"use client";

import { Page } from "@/components/Page";
import classNames from "classnames";

import { getUser } from "@/backendServer/user";
import { EmptyResults } from "@/components/EmptyResults";
import { HealthcareField } from "@/components/HealthcareField";
import { ClinicProfile, DoctorProfile } from "@/types/healthcare";
import { PatientProfile } from "@/types/patient";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./style.module.css";

export function UserProfile() {
  const params = useParams();
  const router = useRouter();

  const id = params.userId as string;

  const { data, isFetched } = useQuery(["profile", id], {
    queryFn: () =>
      getUser(id).then((response) =>
        "error" in response
          ? null
          : (response.data as
              | DoctorProfile
              | ClinicProfile
              | PatientProfile
              | null)
      ),
  });

  function redirectUser() {
    if (data && data.type !== "patient") {
      router.replace("/dashboard");
    }
  }

  useEffect(redirectUser, [data, router]);

  return (
    <Page title="Account Profile" backUrl="/search/user">
      {isFetched && !data && <EmptyResults />}
      {isFetched && data && data.type === "patient" && (
        <div className={classNames(styles.container, "white-box")}>
          <h1>Account Profile</h1>
          <div className={styles["top-fields-container"]}>
            <div className={styles["fields-container"]}>
              <HealthcareField data={data} field="name" label />
              <HealthcareField data={data} field="birthday" label />
              <HealthcareField data={data} field="gender" label />
            </div>
            <div>
              <HealthcareField data={data} field="photo" label />
            </div>
            <div>
              <HealthcareField data={data} field="insurance" label />
            </div>
          </div>
          <hr />
          <div className={styles["top-fields-container"]}>
            <div className={styles["fields-container"]}>
              <HealthcareField data={data} field="email" label />
              <HealthcareField data={data} field="accountInfo" label />
              <HealthcareField data={data} field="notificationSettings" label />
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}
