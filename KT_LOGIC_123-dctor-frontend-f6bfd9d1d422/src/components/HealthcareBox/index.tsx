"use client";

import { Appointment } from "@/types/appointment";
import {
  BaseClinic,
  BaseDoctor,
  ClinicProfile,
  DoctorProfile,
} from "@/types/healthcare";
import classNames from "classnames";
import { ReactNode } from "react";

import { BasePatient, PatientProfile } from "@/types/patient";
import { SearchResult } from "@/types/search";
import Image from "next/image";
import { HealthcareField, HealthcareFieldProps } from "../HealthcareField";
import styles from "./style.module.css";

type Field = {
  name: HealthcareFieldProps["field"] | "photo";
  icon?: boolean;
  label?: boolean;
};

export type HealthcareBoxProps = {
  fields: Field[];
  data:
    | DoctorProfile
    | BaseDoctor
    | ClinicProfile
    | BaseClinic
    | Appointment
    | SearchResult
    | (BasePatient & Partial<PatientProfile>);
  actions?: ReactNode[];
  direction?: "column" | "row";
  hasContainer?: boolean;
  hasBackground?: boolean;
  contextRole?: HealthcareFieldProps["contextRole"];
};

export function HealthcareBox({
  data,
  actions,
  direction = "row",
  fields = [{ name: "photo" }, { name: "name" }],
  hasContainer = true,
  hasBackground = true,
  contextRole,
}: HealthcareBoxProps) {
  function renderFields(fields: Field[]) {
    return fields.map((field) => {
      if (field.name === "rating" && !("rating" in data || "doctor" in data)) {
        return null;
      }

      return (
        <HealthcareField
          key={field.name}
          data={data}
          field={field.name}
          icon={field.icon}
          label={field.label}
          contextRole={contextRole}
        />
      );
    });
  }

  const type = "type" in data ? data.type : "doctor";

  const fieldNames = fields.map((field) => field.name);

  const column1Fields: Field[] = fields.filter((field) =>
    [
      "name",
      "category",
      "location",
      "insurance",
      "availabilityToday",
      "status",
    ].includes(field.name)
  );
  const column2Fields: Field[] = fields.filter((field) =>
    [
      "date",
      "time",
      "condition",
      "rating",
      "affiliatedDoctors",
      "birthday",
      "gender",
    ].includes(field.name)
  );

  return (
    <div
      className={classNames({
        [styles.container]: hasContainer,
        "white-box": hasContainer,
        [styles["no-container"]]: !hasContainer,
      })}
    >
      {hasBackground && (
        <>
          {type === "clinic" ? (
            <Image
              className={styles["background-image"]}
              src="/clinic.png"
              width={96}
              height={109}
              alt=""
            />
          ) : (
            <Image
              className={styles["background-image"]}
              src="/doctor.png"
              width={86}
              height={136}
              alt=""
            />
          )}
        </>
      )}
      {fieldNames.includes("photo") && renderFields([{ name: "photo" }])}
      <div
        className={classNames(styles["info-container"], {
          [styles.row]: direction === "row",
          [styles.column]: direction === "column",
        })}
      >
        <div className={styles["info-column"]}>
          {column1Fields.length > 0 && renderFields(column1Fields)}
        </div>
        <div className={styles["info-column"]}>
          {column2Fields.length > 0 && renderFields(column2Fields)}
        </div>
        {actions && (
          <div
            className={classNames(styles["actions-container"], {
              [styles.row]: direction === "row",
              [styles.column]: direction === "column",
            })}
          >
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
