"use client";

import { Input } from "@/components/Input";
import { InputField } from "@/components/InputField";

import { Button } from "@/components/Button";
import { TextArea } from "@/components/TextArea";

import { InputLabel } from "@/components/InputLabel";
import { useAddUser } from "./AddUserContext";
import styles from "./style.module.css";

export function ClinicDetails() {
  const [{ formData: parentFormData }, { next }] = useAddUser();

  function handleSubmit(formData: FormData) {
    formData.forEach((value, key) => {
      parentFormData.set(key, value);
    });

    next();
  }

  return (
    <form action={handleSubmit}>
      <InputField label="Name">
        <Input
          name="clinicName"
          type="text"
          defaultValue={
            (parentFormData.get("clinicName") as string) || undefined
          }
          required
        />
      </InputField>

      <InputField label="Email">
        <Input
          name="clinicEmail"
          type="email"
          defaultValue={
            (parentFormData.get("clinicEmail") as string) || undefined
          }
          required
        />
      </InputField>

      <InputField label="Location">
        <div style={{ marginBottom: "1rem" }}>
          <InputLabel>Address</InputLabel>
          <Input
            name="address"
            type="string"
            defaultValue={
              (parentFormData.get("address") as string) || undefined
            }
            required
          />
        </div>
        <div className="two-column">
          <div>
            <InputLabel>Latitude</InputLabel>
            <Input
              name="latitude"
              type="number"
              defaultValue={
                (parentFormData.get("latitude") as string) || undefined
              }
              required
              step="any"
            />
          </div>
          <div>
            <InputLabel>Longitude</InputLabel>
            <Input
              name="longitude"
              type="number"
              defaultValue={
                (parentFormData.get("longitude") as string) || undefined
              }
              required
              step="any"
            />
          </div>
        </div>
      </InputField>

      <InputField label="Mobile Number">
        <Input
          name="clinicContactNumber"
          type="text"
          defaultValue={
            (parentFormData.get("clinicContactNumber") as string) || undefined
          }
          required
        />
      </InputField>

      <InputField label="About Me">
        <TextArea
          name="bio"
          defaultValue={(parentFormData.get("bio") as string) || undefined}
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
