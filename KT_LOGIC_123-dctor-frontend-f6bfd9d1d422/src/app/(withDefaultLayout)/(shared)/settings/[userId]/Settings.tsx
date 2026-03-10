"use client";

import { Page } from "@/components/Page";

import { getCurrentUser, getUser } from "@/backendServer/user";
import { HealthcareField } from "@/components/HealthcareField";
import { ClinicProfile, DoctorProfile } from "@/types/healthcare";
import { PatientProfile } from "@/types/patient";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SectionHeader } from "../../../../../components/SectionHeader";
import { AccountSection } from "./AccountSection";
import { DoctorSection } from "./DoctorSection";
import styles from "./style.module.css";

export function useSettingsUser(id: string) {
  const queryKey = id !== "self" ? ["profile", id] : ["currentUser"];

  const data = useQuery(queryKey, {
    queryFn: () => {
      if (id !== "self") {
        return getUser(id).then((response) =>
          "error" in response
            ? null
            : (response.data as DoctorProfile | ClinicProfile | PatientProfile)
        );
      }

      return getCurrentUser().then(
        (response) =>
          response.data as DoctorProfile | ClinicProfile | PatientProfile
      );
    },
  });

  return data;
}

type SettingsProps = {
  id: string;
};

export function Settings({ id }: SettingsProps) {
  const pathname = usePathname();

  const { data: user } = useSettingsUser(id);

  const { data: currentUser } = useQuery(["currentUser"], {
    queryFn: () => getCurrentUser().then((response) => response.data),
  });

  return (
    <Page title="Settings">
      {user && (
        <>
          <div className="white-box container">
            <SectionHeader
              action={
                <Link href={`${pathname}/edit/account`}>Edit Profile</Link>
              }
            >
              Account Settings
            </SectionHeader>
            <AccountSection user={user} />
            <hr />
            <div className={styles["top-fields-container"]}>
              <div className={styles["fields-container"]}>
                {currentUser?.id === user.id && (
                  <>
                    <HealthcareField data={user} field="password" label />
                  </>
                )}
                <div className="two-column" style={{ alignItems: "center" }}>
                  <HealthcareField data={user} field="email" label />
                  <div>
                    <Link href={`${pathname}/edit/email`}>Change email</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {user.type === "doctor" && (
            <div className="white-box container">
              <SectionHeader
                action={
                  <Link href={`${pathname}/edit/doctor`}>Edit Doctor</Link>
                }
              >
                Doctor Settings
              </SectionHeader>
              <DoctorSection user={user} />
            </div>
          )}

          {currentUser?.id === user.id && (
            <div className="white-box container">
              <h1>Data Privacy Settings</h1>
              <p>
                Review DCTOR{"'"}s{" "}
                <Link href="/settings/terms-of-service">Terms of Service</Link>{" "}
                and <Link href="/settings/privacy-policy">Privacy Policy</Link>.
              </p>
            </div>
          )}
        </>
      )}
    </Page>
  );
}
