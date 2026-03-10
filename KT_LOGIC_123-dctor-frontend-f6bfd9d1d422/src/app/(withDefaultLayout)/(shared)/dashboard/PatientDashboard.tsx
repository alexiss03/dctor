"use client";

import classNames from "classnames";
import { TopBar } from "./TopBar";

import { getTreatmentSections } from "@/backendServer/healthcare";
import { Page } from "@/components/Page";
import { TreatmentSectionGroup } from "@/components/TreatmentSectionGroup";
import { PatientProfile } from "@/types/patient";
import { useQuery } from "@tanstack/react-query";
import styles from "./style.module.css";

type PatientDashboardProps = {
  user: PatientProfile;
};

export function PatientDashboard({ user }: PatientDashboardProps) {
  const { data: treatmentSections = [] } = useQuery(["treatmentsSections"], {
    queryFn: () =>
      getTreatmentSections().then((response) =>
        "error" in response ? [] : response.data
      ),
  });

  const sampledTreatmentSections = treatmentSections.map((section) => ({
    ...section,
    categories: section.categories.slice(0, 4),
  }));

  return (
    <Page>
      <TopBar user={user} search />
      <section className="section">
        <p className={classNames(styles.greetings, "section")}>
          Good morning, {user.firstName}!
        </p>
        <div className={styles.titlegroup}>
          <p className={styles.title}>
            How are <span className={styles.highlight}>you</span> today?
          </p>
          <p className={styles.subtitle}>
            Book an appointment with the right doctors.
          </p>
        </div>
      </section>
      {sampledTreatmentSections.map((section) => (
        <TreatmentSectionGroup
          key={section.id}
          name={section.name}
          categories={section.categories}
          sectionId={section.id}
        />
      ))}
    </Page>
  );
}
