"use client";

import { Button } from "@/components/Button";
import { Schedules } from "@/components/Schedules";
import { useAddUser } from "./AddUserContext";
import styles from "./style.module.css";

export function SetSchedule() {
  const [{ formData: parentFormData }, { next, getSelectedClinics }] =
    useAddUser();

  const clinics = getSelectedClinics();

  function handleSubmit(formData: FormData) {
    formData.forEach((value, key) => {
      parentFormData.set(key, value);
    });

    next();
  }

  return (
    <form action={handleSubmit}>
      <Schedules clinics={clinics || undefined} />
      <div className={styles["next-button-container"]}>
        <Button type="submit" variant="primary" size="large">
          Next
        </Button>
      </div>
    </form>
  );
}
