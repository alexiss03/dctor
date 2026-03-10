"use client";

import { Button } from "@/components/Button";
import { HealthcareBox } from "@/components/HealthcareBox";

import {
  cancelAppointment,
  getAppointmentsSelf,
  rescheduleAppointment,
} from "@/backendServer/appointment";
import { getUser } from "@/backendServer/user";
import { ActionButtons } from "@/components/ActionButtons";
import { AvailabilityPicker } from "@/components/AvailabilityPicker";
import { usePrompt } from "@/hooks/usePrompt";
import { useSidePane } from "@/hooks/useSidePane";
import { AppointmentSetIcon } from "@/icons/appointmentSet";
import { Appointment } from "@/types/appointment";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import styles from "./style.module.css";

type RescheduleAppointmentProps = {
  appointment: Appointment;
};

function RescheduleAppointment({ appointment }: RescheduleAppointmentProps) {
  const { prompt, close: closePrompt, errorPrompt } = usePrompt();
  const { close: closeSidePane } = useSidePane();
  const queryClient = useQueryClient();

  function handleRescheduleSubmit(formData: FormData) {
    const dateStart = formData.get("dateStart") as string;

    prompt({
      icon: <AppointmentSetIcon />,
      message: <p>{`You're about to reschedule your appointment.`}</p>,
      description: (
        <p>{`Do you wish to reschedule your appointment with ${appointment.doctor.displayName}?`}</p>
      ),
      actions: [
        {
          key: "submit",
          variant: "primary",
          children: "Reschedule Appointment",
          onClick: async () => {
            const response = await rescheduleAppointment(
              appointment.id,
              dateStart
            );

            if ("error" in response) {
              errorPrompt();

              return;
            } else {
              queryClient.invalidateQueries(["appointmentsSelf"]);

              prompt({
                icon: <AppointmentSetIcon />,
                message: (
                  <>
                    <p>Thank you!</p>
                    <p>Appointment rescheduled.</p>
                  </>
                ),
              });
            }

            closePrompt();
            closeSidePane();
          },
        },
        {
          key: "cancel",
          variant: "clear",
          children: "Not now",
          onClick: closePrompt,
        },
      ],
    });
  }

  return (
    <form action={handleRescheduleSubmit} style={{ height: "100%" }}>
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
            direction="column"
            hasContainer={false}
            hasBackground={false}
          />
          <hr />
          <div className={"section"}>
            <AvailabilityPicker
              data={appointment.doctor}
              clinicId={appointment.clinic.id}
            />
          </div>
        </div>

        <ActionButtons
          actions={[
            <Button
              key="reschedule"
              variant="primary"
              size="large"
              type="submit"
              full
            >
              Reschedule
            </Button>,
          ]}
        />
      </div>
    </form>
  );
}

export function IncomingAppointments() {
  const { open } = useSidePane();
  const { prompt, close } = usePrompt();

  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading } = useQuery(
    ["appointmentsSelf", "upcoming"],
    {
      queryFn: () =>
        getAppointmentsSelf({ status: ["incoming", "ongoing"] }).then(
          (response) => ("error" in response ? [] : response.data)
        ),
    }
  );

  async function handleCancelAppointment(appointment: Appointment) {
    prompt({
      icon: <AppointmentSetIcon />,
      message: <p>{`You're about to cancel your appointment.`}</p>,
      description: (
        <p>{`Do you wish to cancel your appointment with ${appointment.doctor.displayName}?`}</p>
      ),
      actions: [
        {
          key: "submit",
          variant: "primary",
          children: "Cancel Appointment",
          onClick: async () => {
            await cancelAppointment(appointment.id);

            queryClient.invalidateQueries(["appointmentsSelf"]);

            close();

            prompt({
              icon: <AppointmentSetIcon />,
              message: (
                <>
                  <p>Thank you!</p>
                  <p>Appointment cancelled.</p>
                </>
              ),
            });
          },
        },
        {
          key: "cancel",
          variant: "clear",
          children: "Not now",
          onClick: close,
        },
      ],
    });
  }

  function handleRescheduleAppointment(appointment: Appointment) {
    open(
      <RescheduleAppointment appointment={appointment} />,
      "Reschedule Appointment"
    );
  }

  function prefetchData() {
    appointments.forEach((appointment) => {
      queryClient.prefetchQuery(["doctor", appointment.doctor.id], {
        queryFn: () =>
          getUser(appointment.doctor.id).then((response) =>
            "error" in response ? null : response.data
          ),
      });
    });
  }

  useEffect(prefetchData, [appointments, queryClient]);

  if (!appointments) {
    return null;
  }

  return (
    <div className={styles.container}>
      {isLoading && <p>Loading...</p>}
      {!appointments.length && !isLoading && (
        <p>You have no upcoming appointments.</p>
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
              name: "date",
              icon: true,
              label: true,
            },
            {
              name: "time",
              icon: true,
              label: true,
            },
          ]}
          actions={[
            <Button
              key="cancel"
              variant="secondary"
              size="large"
              onClick={() => handleCancelAppointment(appointment)}
            >
              Cancel Appointment
            </Button>,
            <Button
              key="reschedule"
              variant="primary"
              size="large"
              onClick={() => handleRescheduleAppointment(appointment)}
            >
              Reschedule
            </Button>,
          ]}
        />
      ))}
    </div>
  );
}
