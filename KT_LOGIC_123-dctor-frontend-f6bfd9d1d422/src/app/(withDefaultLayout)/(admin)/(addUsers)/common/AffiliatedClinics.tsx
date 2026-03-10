"use client";

import { Button } from "@/components/Button";
import { InputField } from "@/components/InputField";
import { Select } from "@/components/Select";
import { BaseClinic } from "@/types/healthcare";

import { useAddUser } from "./AddUserContext";
import styles from "./style.module.css";

type AffiliatedClinicsProps = {
  clinics: BaseClinic[];
};

export function AffiliatedClinics({ clinics }: AffiliatedClinicsProps) {
  const [{ formData: parentFormData }, { next }] = useAddUser();

  function handleSubmit(formData: FormData) {
    parentFormData.delete("clinics");

    formData.forEach((value, key) => {
      parentFormData.append(key, value);
    });

    next();
  }

  const options = clinics.map((clinic) => ({
    value: clinic.id,
    label: clinic.name,
  }));

  const selectedClinicIds = parentFormData.getAll("clinics");

  const defaultValue = selectedClinicIds.map((id) => ({
    value: id,
    label: clinics.find((clinic) => clinic.id === id)?.name,
  }));

  return (
    <form action={handleSubmit}>
      <InputField label="Add Clinic">
        <Select
          name="clinics"
          options={options}
          isMulti
          defaultValue={defaultValue}
          required
        />
      </InputField>
      <div className={styles["next-button-container"]}>
        <Button type="submit" variant="primary" size="large">
          Next
        </Button>
      </div>
    </form>
  );
}
