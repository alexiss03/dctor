"use client";

import { Schedules } from "@/components/Schedules";
import { ClinicProfile, DoctorProfile } from "@/types/healthcare";
import classNames from "classnames";

import { getCurrentUser } from "@/backendServer/user";
import { Button } from "@/components/Button";
import { useQuery } from "@tanstack/react-query";
import styles from "./style.module.css";

export function Scheduler() {
  const { data: user } = useQuery(["currentUser"], {
    queryFn: () =>
      getCurrentUser().then(
        (response) => response.data as ClinicProfile | DoctorProfile
      ),
  });

  if (!user) {
    return null;
  }

  const clinics = user.type === "clinic" ? [user] : user.clinics;

  async function handleSubmit(formData: FormData) {
    const formObject: Record<
      string,
      FormDataEntryValue | FormDataEntryValue[]
    > = {};

    for (const pair of formData.entries()) {
      if (formObject[pair[0]]) {
        if (Array.isArray(formObject[pair[0]])) {
          (formObject[pair[0]] as FormDataEntryValue[]).push(pair[0]);
        } else {
          formObject[pair[0]] = [
            formObject[pair[0]] as FormDataEntryValue,
            pair[1],
          ];
        }
      } else {
        formObject[pair[0]] = pair[1];
      }
    }

    // @TODO: api call
    console.log("submit");
    console.log(formObject);
  }

  return (
    <div className={classNames(styles.container, "white-box")}>
      <div className={styles["content-container"]}>
        <form action={handleSubmit}>
          <h1>Set Schedules</h1>
          <Schedules clinics={clinics} />
          <div className="flex-end">
            <Button type="submit" variant="primary" size="large">
              Apply
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
