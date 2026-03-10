"use client";

import { Button } from "@/components/Button";
import { InputField } from "@/components/InputField";
import { Option, Select } from "@/components/Select";

import { Insurance } from "@/types/insurance";
import { useAddUser } from "./AddUserContext";
import styles from "./style.module.css";

type InsurancesProps = {
  insurances: Insurance[];
};

export function Insurances({ insurances }: InsurancesProps) {
  const [{ formData: parentFormData }, { next, getSelectedClinics }] =
    useAddUser();

  const clinics = getSelectedClinics();

  function handleSubmit(formData: FormData) {
    if (!clinics) {
      parentFormData.delete(`insurances`);
    } else {
      clinics.forEach((clinic) => {
        parentFormData.delete(`insurances/${clinic.id}`);
      });
    }

    formData.forEach((value, key) => {
      parentFormData.append(key, value);
    });

    next();
  }

  return (
    <form action={handleSubmit}>
      {(clinics || [undefined]).map((clinic) => {
        const fieldName = clinic ? `insurances/${clinic.id}` : "insurances";

        const selectedInsuranceIds = parentFormData.getAll(fieldName);

        const options: Option[] = insurances.map((insurance) => ({
          value: insurance.id,
          label: insurance.name,
        }));

        const defaultValue = options.filter((option) =>
          selectedInsuranceIds.includes(option.value)
        );

        return (
          <InputField key={fieldName} label={clinic?.name ?? "Insurance"}>
            <Select
              name={fieldName}
              options={options}
              isMulti
              required
              defaultValue={defaultValue}
            />
          </InputField>
        );
      })}

      <div className={styles["next-button-container"]}>
        <Button type="submit" variant="primary" size="large">
          Next
        </Button>
      </div>
    </form>
  );
}
