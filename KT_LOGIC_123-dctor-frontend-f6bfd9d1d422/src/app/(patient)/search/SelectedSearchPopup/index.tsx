"use client";

import { IconButton } from "@/components/IconButton";
import { BackIcon } from "@/icons/back";
import classNames from "classnames";

import { Button } from "@/components/Button";
import { HealthcareBox } from "@/components/HealthcareBox";
import { HealthcareField } from "@/components/HealthcareField";
import { useDoctor } from "@/hooks/useDoctor";
import { DoctorProfile } from "@/types/healthcare";
import styles from "./style.module.css";

type SelectedSearchPopupProps = {
  doctorId: DoctorProfile["id"];
  onCancel: () => void;
  onBook: (doctor: DoctorProfile) => void;
  onView: (doctorID: DoctorProfile["id"]) => void;
};

export function SelectedSearchPopup({
  doctorId,
  onCancel,
  onBook,
  onView,
}: SelectedSearchPopupProps) {
  const { data } = useDoctor(doctorId);

  if (!data) {
    return null;
  }

  return (
    <div className={classNames(styles.container, "white-box")}>
      <div>
        <IconButton onClick={onCancel}>
          <BackIcon />
        </IconButton>
      </div>
      <div>
        <HealthcareBox
          data={data}
          hasContainer={false}
          direction="column"
          fields={[
            { name: "name" },
            { name: "location", icon: true },
            { name: "time", icon: true },
          ]}
          actions={[
            <Button
              key="view"
              variant="secondary"
              size="medium"
              onClick={() => onView(data.id)}
            >
              View
            </Button>,
            // <Button key="save" variant="secondary" size="medium">
            //   Save
            // </Button>,
            <Button
              key="book"
              type="submit"
              variant="primary"
              size="medium"
              onClick={() => onBook(data)}
            >
              Book
            </Button>,
          ]}
        />
        <HealthcareField data={data} field="photos" />
        <hr />
        <HealthcareField data={data} field="location" icon />
        <hr />
        <HealthcareField data={data} field="contactNumber" icon />
        <hr />
        <HealthcareField data={data} field="insurance" label />
        <hr />
        <HealthcareField data={data} field="bio" label />
        <hr />
        <HealthcareField data={data} field="category" label icon />
      </div>
    </div>
  );
}
