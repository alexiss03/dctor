"use client";

import { Button } from "@/components/Button";
import { HealthcareBox } from "@/components/HealthcareBox";
import { HealthcareField } from "@/components/HealthcareField";
import { useSidePane } from "@/hooks/useSidePane";
import { Appointment } from "@/types/appointment";
import appointmentStyles from "../style.module.css";

import {
  getAppointmentsSelf,
  reviewAppointment,
} from "@/backendServer/appointment";
import { ActionButtons } from "@/components/ActionButtons";
import { InputLabel } from "@/components/InputLabel";
import { TextArea } from "@/components/TextArea";
import { usePrompt } from "@/hooks/usePrompt";
import { RatingIcon } from "@/icons/rating";
import { SuccessCheckIcon } from "@/icons/successCheck";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import styles from "./style.module.css";

type ViewAppointmentProps = {
  appointment: Appointment;
};

function ViewAppointment({ appointment }: ViewAppointmentProps) {
  return (
    <div>
      <HealthcareBox
        data={appointment}
        fields={[
          { name: "photo" },
          { name: "name" },
          { name: "category" },
          { name: "location", icon: true },
          { name: "time", icon: true },
          { name: "rating" },
        ]}
        hasContainer={false}
        hasBackground={false}
        direction="column"
      />
      <hr />
      <div className="grey-box">
        <HealthcareBox
          data={appointment}
          fields={[
            { name: "location", icon: true, label: true },
            { name: "date", icon: true, label: true },
            { name: "time", icon: true, label: true },
            { name: "condition", icon: true, label: true },
          ]}
          hasContainer={false}
          hasBackground={false}
          direction="column"
        />
      </div>
      {appointment.doctorsNotes && (
        <HealthcareField data={appointment} field="doctorsNotes" label />
      )}
    </div>
  );
}

type ReviewAppointmentProps = {
  appointment: Appointment;
  onReview: () => void;
};

function ReviewAppointment({ appointment, onReview }: ReviewAppointmentProps) {
  const [selectedScore, setSelectedScore] = useState(5);
  const { prompt, errorPrompt } = usePrompt();

  async function handleReviewSubmit(formData: FormData) {
    const { id: appointmentId } = appointment;
    const { id: doctorId } = appointment.doctor;
    const { id: patientId } = appointment.patient;
    const score = selectedScore;
    const comment = formData.get("comment") as string;

    const response = await reviewAppointment(appointmentId, {
      patientId,
      doctorId,
      rating: score,
      comment,
    });

    if ("error" in response) {
      errorPrompt();

      return;
    }

    prompt({
      icon: <SuccessCheckIcon />,
      message: "Review sent!",
    });

    onReview();
  }

  return (
    <form action={handleReviewSubmit} style={{ height: "100%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <div>
          <HealthcareBox
            data={appointment}
            fields={[
              { name: "photo" },
              { name: "name" },
              { name: "category" },
              { name: "location", icon: true },
              { name: "time", icon: true },
              { name: "rating" },
            ]}
            hasContainer={false}
            hasBackground={false}
            direction="column"
          />
          <hr />
          <div className={styles["review-container"]}>
            <h2 className={styles["review-title"]}>
              How was your experience with {appointment.doctor.displayName}?
            </h2>
            <div className={styles["review-stars-container"]}>
              {Array.from(new Array(5))
                .map((_, i) => i + 1)
                .map((score) => (
                  <Button
                    key={score}
                    variant="clear"
                    onClick={() => setSelectedScore(score)}
                  >
                    <RatingIcon active={score <= selectedScore} />
                  </Button>
                ))}
            </div>
          </div>
          <InputLabel>Write a comment</InputLabel>
          <TextArea name="comment" />
        </div>
        <ActionButtons
          actions={[
            <Button
              key="submit"
              variant="primary"
              type="submit"
              size="large"
              full
            >
              Submit
            </Button>,
          ]}
        />
      </div>
    </form>
  );
}

export function PastAppointments() {
  const { open, close } = useSidePane();
  const queryClient = useQueryClient();
  const { data: appointments = [], isLoading } = useQuery(
    ["appointmentsSelf", "past"],
    {
      queryFn: () =>
        getAppointmentsSelf({ status: ["cancelled", "completed"] }).then(
          (response) => ("error" in response ? [] : response.data)
        ),
    }
  );

  function handleOnReview() {
    close();
    queryClient.invalidateQueries(["appointmentsSelf", "past"]);
  }

  function handleDoctorsNotesOpen(appointment: Appointment) {
    open(<ViewAppointment appointment={appointment} />, `View Appointment`);
  }

  function handleReviewAppointment(appointment: Appointment) {
    open(
      <ReviewAppointment appointment={appointment} onReview={handleOnReview} />,
      `Write a review`
    );
  }

  return (
    <div className={appointmentStyles.container}>
      {isLoading && <p>Loading...</p>}
      {!appointments.length && !isLoading && (
        <p>You have no past appointments.</p>
      )}
      {appointments.map((appointment, i) => (
        <HealthcareBox
          key={`${appointment.id}/${i}`}
          data={appointment}
          fields={[
            {
              name: "photo",
            },
            {
              name: "name",
            },
            {
              name: "category",
            },
            {
              name: "location",
              icon: true,
            },
            {
              name: "status",
              label: true,
            },
            {
              name: "date",
              icon: true,
              label: true,
            },
            {
              name: "time",
              icon: true,
              label: true,
            },
            {
              name: "rating",
            },
          ]}
          actions={[
            <Button
              key="view"
              variant="secondary"
              size="large"
              onClick={() => handleDoctorsNotesOpen(appointment)}
            >
              View
            </Button>,
            <Button
              key="review"
              variant="primary"
              size="large"
              onClick={() => handleReviewAppointment(appointment)}
              disabled={!!appointment.reviewScore}
            >
              Review
            </Button>,
          ]}
        />
      ))}
    </div>
  );
}
