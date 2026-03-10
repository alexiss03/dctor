"use client";

import { AvailabilityPicker } from "@/components/AvailabilityPicker";
import { Button } from "@/components/Button";
import { HealthcareBox } from "@/components/HealthcareBox";
import { InputLabel } from "@/components/InputLabel";
import { Option, Select } from "@/components/Select";
import { TextArea } from "@/components/TextArea";
import { usePrompt } from "@/hooks/usePrompt";
import { AppointmentSetIcon } from "@/icons/appointmentSet";
import { DoctorProfile } from "@/types/healthcare";
import { useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { book } from "./actions";
import styles from "./style.module.css";

type BookingOverlayProps = {
  data: DoctorProfile;
  onCancel: () => void;
};

export function AppointmentBooking({ data, onCancel }: BookingOverlayProps) {
  const queryClient = useQueryClient();
  const { prompt } = usePrompt();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [clinicId, setClinicId] = useState(data.clinics[0].id);

  async function onBook(formData: FormData) {
    const response = await book(formData);

    if ("error" in response) {
      if (response.error.name === "TimeslotOccupied") {
        setError(response.error.message);
      } else {
        prompt({
          message: "Failed to book appointment",
          description: "Please try again",
        });
      }

      return;
    }

    onCancel();

    queryClient.invalidateQueries(["appointmentsSelf"]);

    router.push("/dashboard");

    prompt({
      icon: <AppointmentSetIcon />,
      message: (
        <>
          <p>Thank you!</p>
          <p>Your apppointment has been created.</p>
        </>
      ),
      description: (
        <p>{`We've sent the information in your registered email address.`}</p>
      ),
    });
  }

  const doctorId = data.id;

  return (
    <form action={onBook}>
      <div className={classNames(styles["doctor-info-container"], "section")}>
        <HealthcareBox
          data={data}
          fields={[
            { name: "photo" },
            { name: "name" },
            { name: "category" },
            { name: "location", icon: true },
            { name: "time", icon: true },
            { name: "rating" },
          ]}
          direction="column"
          hasContainer={false}
          hasBackground={false}
        />
      </div>
      <hr />
      {!("clinic" in data) && (
        <>
          <InputLabel>Clinic</InputLabel>
          <Select
            options={data.clinics.map((clinic) => ({
              value: clinic.id,
              label: clinic.name,
            }))}
            value={data.clinics
              .map((clinic) => ({
                value: clinic.id,
                label: clinic.name,
              }))
              .find((clinic) => clinic.value === clinicId)}
            onChange={(option: unknown) =>
              setClinicId((option as Option).value)
            }
            required
          />
        </>
      )}
      <InputLabel>Condition</InputLabel>
      <TextArea
        name="condition"
        placeholder={`(ex. "My head hurts.")`}
        required
      />
      <div className={classNames(styles["datetime-picker"], "section")}>
        <AvailabilityPicker data={data} clinicId={clinicId} />
      </div>
      <div className={styles["actions-container"]}>
        <Button
          variant="secondary"
          size="large"
          onClick={onCancel}
          loadingOnFormSubmit
        >
          Cancel Booking
        </Button>
        <Button
          variant="primary"
          size="large"
          type="submit"
          loadingOnFormSubmit
        >
          Book now
        </Button>
        {error && <p className="error-text">{error}</p>}
      </div>
      <input name="doctorID" type="hidden" value={doctorId} />
      <input name="clinicID" type="hidden" value={clinicId} />
    </form>
  );
}
