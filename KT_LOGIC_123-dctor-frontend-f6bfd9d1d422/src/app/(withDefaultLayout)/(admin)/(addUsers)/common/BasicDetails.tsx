"use client";

import { Input } from "@/components/Input";
import { InputField } from "@/components/InputField";

import { Button } from "@/components/Button";
import { TextArea } from "@/components/TextArea";

import { ButtonSelect } from "@/components/ButtonSelect";
import { DatePicker } from "@/components/DatePicker";
import { useAddUser } from "./AddUserContext";
import styles from "./style.module.css";

type BasicDetailsProps = {
  type: "doctor" | "clinic";
};

export function BasicDetails({ type }: BasicDetailsProps) {
  const [{ formData: parentFormData }, { next }] = useAddUser();

  function handleSubmit(formData: FormData) {
    formData.forEach((value, key) => {
      parentFormData.set(key, value);
    });

    next();
  }

  return (
    <form action={handleSubmit}>
      <InputField label="First Name">
        <Input
          name="firstName"
          type="text"
          defaultValue={
            (parentFormData.get("firstName") as string) || undefined
          }
          required
        />
      </InputField>
      <InputField label="Last Name">
        <Input
          name="lastName"
          type="text"
          defaultValue={(parentFormData.get("lastName") as string) || undefined}
          required
        />
      </InputField>

      <InputField label="Email">
        <Input
          name="email"
          type="email"
          defaultValue={(parentFormData.get("email") as string) || undefined}
          required
        />
      </InputField>

      <InputField label="Gender">
        <ButtonSelect
          name="gender"
          options={[
            {
              value: "M",
              text: "Male",
            },
            {
              value: "F",
              text: "Female",
            },
          ]}
          defaultValue={(parentFormData.get("gender") as string) || undefined}
        />
      </InputField>

      <InputField label="Birthday">
        <DatePicker
          name="birthday"
          full
          initialValue={
            parentFormData.get("birthday")
              ? new Date(parentFormData.get("birthday") as string)
              : undefined
          }
        />
      </InputField>

      <InputField label="Mobile Number">
        <Input
          name="contactNumber"
          type="text"
          defaultValue={
            (parentFormData.get("contactNumber") as string) || undefined
          }
          required
        />
      </InputField>

      {type === "doctor" && (
        <InputField label="About Me">
          <TextArea
            name="bio"
            defaultValue={(parentFormData.get("bio") as string) || undefined}
            required
          />
        </InputField>
      )}

      <br />

      <InputField label="Profile Picture">
        <Input
          name="photo"
          type="image"
          defaultValue={(parentFormData.get("photo") as string) || undefined}
          required
          text="Upload profile picture"
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
