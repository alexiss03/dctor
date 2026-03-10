"use client";

import { useRouter } from "next/navigation";

import { Page } from "@/components/Page";
import classNames from "classnames";

import { Button } from "@/components/Button";
import { HealthcareBox } from "@/components/HealthcareBox";
import { Input } from "@/components/Input";
import { SAMPLE_CLINIC, SAMPLE_DOCTOR } from "@/mockData";
import styles from "./style.module.css";

// @TODO:
export default function ClinicAffiliatedDoctors() {
  const clinic = SAMPLE_CLINIC;
  const doctor = SAMPLE_DOCTOR;

  const router = useRouter();

  function handleBackToProfile() {
    router.push(`/clinics/${clinic.id}`);
  }

  return (
    <Page title={`Clinic's Profile > Affiliated Doctors`}>
      <div className={classNames(styles.container, "white-box")}>
        <HealthcareBox
          data={clinic}
          fields={[
            {
              name: "photo",
            },
            {
              name: "name",
            },
          ]}
          hasContainer={false}
          actions={[
            <Button key="back" variant="clear" onClick={handleBackToProfile}>
              Back to profile
            </Button>,
          ]}
        />
        <div className={styles["search-container"]}>
          <Input
            type="text"
            placeholder="Search Doctor's name, Specialist, Procedures"
          />
        </div>
        <div>
          <HealthcareBox
            data={doctor}
            fields={[
              {
                name: "photo",
              },
              {
                name: "name",
              },
              {
                name: "category",
              },
              {
                name: "availabilityToday",
                icon: true,
              },
              {
                name: "rating",
              },
            ]}
            actions={[
              // <Button key="save" variant="secondary" size="large">
              //   Save
              // </Button>,
              <Button key="book" variant="primary" size="large">
                Book
              </Button>,
            ]}
          />
          <HealthcareBox
            data={doctor}
            fields={[
              {
                name: "photo",
              },
              {
                name: "name",
              },
              {
                name: "category",
              },
              {
                name: "availabilityToday",
                icon: true,
              },
              {
                name: "rating",
              },
            ]}
            actions={[
              // <Button key="save" variant="secondary" size="large">
              //   Save
              // </Button>,
              <Button key="book" variant="primary" size="large">
                Book
              </Button>,
            ]}
          />
          <HealthcareBox
            data={doctor}
            fields={[
              {
                name: "photo",
              },
              {
                name: "name",
              },
              {
                name: "category",
              },
              {
                name: "availabilityToday",
                icon: true,
              },
              {
                name: "rating",
              },
            ]}
            actions={[
              // <Button key="save" variant="secondary" size="large">
              //   Save
              // </Button>,
              <Button key="book" variant="primary" size="large">
                Book
              </Button>,
            ]}
          />
        </div>
      </div>
    </Page>
  );
}
