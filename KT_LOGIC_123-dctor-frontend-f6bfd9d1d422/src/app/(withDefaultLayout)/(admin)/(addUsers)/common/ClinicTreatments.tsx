"use client";

import { Button } from "@/components/Button";
import { ClinicProfile, Treatment } from "@/types/healthcare";

import { Input } from "@/components/Input";
import { InputField } from "@/components/InputField";
import { Option, Select } from "@/components/Select";
import { Fragment, useState } from "react";
import { useAddUser } from "./AddUserContext";
import styles from "./style.module.css";

type ClinicTreatmentsProps = { treatments: Treatment[] };

export function ClinicTreatments({ treatments }: ClinicTreatmentsProps) {
  const [{ formData: parentFormData }, { next, getSelectedClinics }] =
    useAddUser();

  const clinics = getSelectedClinics();

  const [selectedTreatmentOptions, setSelectedTreatmentOptions] = useState<
    Record<ClinicProfile["id"], Option[]>
  >(
    !clinics
      ? {
          treatments: [],
        }
      : clinics.reduce((acc, clinic) => {
          return {
            ...acc,
            [clinic.id]: treatments
              .filter((treatment) => {
                const selectedTreatmentIds = parentFormData.getAll(
                  `treatments/${clinic.id}`
                );

                return selectedTreatmentIds.includes(treatment.id);
              })
              .map((treatment) => {
                return {
                  value: treatment?.id,
                  label: treatment?.name,
                };
              }),
          };
        }, {})
  );

  function handleTreatmentChange(
    clinicId: ClinicProfile["id"] | null,
    treatmentOptions: Option[]
  ) {
    setSelectedTreatmentOptions((selectedTreatments) => ({
      ...selectedTreatments,
      [clinicId || "treatments"]: treatmentOptions,
    }));
  }

  function handleSubmit(formData: FormData) {
    if (!clinics) {
      parentFormData.delete(`treatments`);
    } else {
      clinics.forEach((clinic) => {
        parentFormData.delete(`treatments/${clinic.id}`);
      });
    }

    formData.forEach((value, key) => {
      if (key.startsWith("price")) {
        parentFormData.set(key, (value as string).replace("$USD ", ""));
      } else {
        parentFormData.append(key, value);
      }
    });

    next();
  }

  return (
    <form action={handleSubmit}>
      {(clinics || [undefined]).map((clinic) => {
        const options: Option[] = treatments.map((treatment) => ({
          value: treatment.id,
          label: treatment.name,
        }));

        return (
          <InputField
            key={clinic?.id ?? "treatment"}
            label={clinic?.name ?? "Treatments"}
          >
            <Select
              name={clinic ? `treatments/${clinic.id}` : "treatments"}
              options={options}
              isMulti
              required
              value={selectedTreatmentOptions[clinic?.id ?? "treatments"]}
              onChange={(options) =>
                handleTreatmentChange(clinic?.id ?? null, options as Option[])
              }
            />
          </InputField>
        );
      })}

      {(clinics || [undefined]).map((clinic) => {
        if (selectedTreatmentOptions[clinic?.id ?? "treatments"].length === 0) {
          return null;
        }

        return (
          <Fragment key={clinic?.id ?? "treatments"}>
            {clinic && <h3>{clinic.name}</h3>}
            {selectedTreatmentOptions[clinic?.id ?? "treatments"].map(
              (treatmentOption) => {
                const treatment = treatments.find(
                  (treatment) => treatment.id === treatmentOption.value
                );

                if (!treatment) {
                  return null;
                }

                const existingValue = parentFormData.get(
                  clinic
                    ? `price/${clinic.id}/${treatment.id}`
                    : `price/${treatment.id}`
                ) as string | null;

                return (
                  <InputField key={treatment.id} label={treatment.name}>
                    <Input
                      name={
                        clinic
                          ? `price/${clinic.id}/${treatment.id}`
                          : `price/${treatment.id}`
                      }
                      type="currency"
                      defaultValue={
                        existingValue !== null ? existingValue : 1000
                      }
                      required
                    />
                  </InputField>
                );
              }
            )}
          </Fragment>
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
