"use client";

import { AppointmentStatus } from "@/components/AppointmentStatus";
import { Button } from "@/components/Button";
import { HealthcareBox } from "@/components/HealthcareBox";
import { Table } from "@/components/Table";
import { useSidePane } from "@/hooks/useSidePane";
import { Appointment, Timeblock } from "@/types/appointment";
import { formatTimeblock } from "@/utils/date";
import { ColumnDef } from "@tanstack/react-table";

import {
  cancelAppointment,
  completeAppointment,
  updateAppointment,
} from "@/backendServer/appointment";
import { ActionButtons } from "@/components/ActionButtons";
import { HealthcareField } from "@/components/HealthcareField";
import { usePrompt } from "@/hooks/usePrompt";
import { AppointmentIcon } from "@/icons/appointment";
import { AppointmentSetIcon } from "@/icons/appointmentSet";
import { WarningIcon } from "@/icons/warning";
import { ReactNode } from "react";
import styles from "./style.module.css";

type ViewAppointmentProps = {
  appointment: Appointment;
  onDoctorsNoteEdit: (newDoctorsNote: string) => void;
  onCancel?: (appointment: Appointment) => void;
  onComplete?: (appointment: Appointment) => void;
};

function ViewAppointment({
  appointment,
  onDoctorsNoteEdit,
  onCancel,
  onComplete,
}: ViewAppointmentProps) {
  const { prompt, close } = usePrompt();

  function handleEditDoctorsNotes(formData: FormData) {
    const doctorsNotes = formData.get("doctorsNotes") as string;

    onDoctorsNoteEdit(doctorsNotes);
  }

  function handleCompleteAppointment() {
    if (appointment.status === "incoming" || appointment.status === "ongoing") {
      prompt({
        icon: <WarningIcon />,
        message: <p>WARNING!!!</p>,
        description: (
          <p>
            Concluding this appointment cannot be taken back. Do you wish to
            continue?
          </p>
        ),
        actions: [
          {
            key: "submit",
            variant: "primary",
            children: "Complete Appointment",
            onClick: async () => {
              await completeAppointment(appointment.id);

              close();

              prompt({
                icon: <AppointmentSetIcon />,
                message: (
                  <>
                    <p>Thank you!</p>
                    <p>Appointment concluded.</p>
                  </>
                ),
              });

              onComplete?.(appointment);
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
  }

  async function handleCancelAppointment() {
    prompt({
      icon: <AppointmentSetIcon />,
      message: <p>{`You're about to cancel your appointment.`}</p>,
      description: (
        <p>{`Do you wish to cancel your appointment with ${appointment.patient.displayName}?`}</p>
      ),
      actions: [
        {
          key: "submit",
          variant: "primary",
          children: "Cancel Appointment",
          onClick: async () => {
            await cancelAppointment(appointment.id);

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

            onCancel?.(appointment);
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

  return (
    <form action={handleEditDoctorsNotes} style={{ height: "100%" }}>
      <div className={styles["view-appointment-wrapper"]}>
        <div>
          <HealthcareBox
            data={appointment}
            fields={[
              { name: "photo" },
              { name: "name" },
              { name: "category" },
              { name: "status", label: true },
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
          <HealthcareField data={appointment} field="doctorsNotes" label edit />
        </div>

        <ActionButtons
          actions={[
            <Button
              key="complete"
              variant={
                appointment.status === "completed" ? "secondary" : "primary"
              }
              full
              size="large"
              disabled={appointment.status === "completed"}
              onClick={handleCompleteAppointment}
            >
              {completeButtonTextMap[appointment.status]}
            </Button>,
            <Button
              key="doctorsNotes"
              variant={
                appointment.status === "completed" ? "primary" : "secondary"
              }
              full
              size="large"
              type="submit"
            >
              {appointment.doctorsNotes
                ? `Edit Doctor's Notes`
                : `Add Doctor's Notes`}
            </Button>,
            <Button
              key="cancel"
              variant="danger"
              full
              size="large"
              disabled={
                appointment.status === "cancelled" ||
                appointment.status === "completed"
              }
              onClick={handleCancelAppointment}
            >
              Cancel Appointment
            </Button>,
          ]}
        />
      </div>
    </form>
  );
}

const completeButtonTextMap: { [key in Appointment["status"]]: ReactNode } = {
  incoming: "Complete Meeting",
  ongoing: "Complete Meeting",
  completed: "Meeting Completed",
  cancelled: "Meeting Cancelled",
};

type AppointmentsTableProps = {
  data: Appointment[];
  type: "doctor" | "clinic";
  onCancel: (appointment: Appointment) => void;
  onUpdate: () => void;
  onComplete: (appointment: Appointment) => void;
};

export function AppointmentsTable({
  data,
  type,
  onCancel,
  onUpdate,
  onComplete,
}: AppointmentsTableProps) {
  const { open } = useSidePane();
  const { prompt, errorPrompt } = usePrompt();

  async function handleDoctorsNotesEdit(
    appointmentId: Appointment["id"],
    newDoctorsNotes: string
  ) {
    const response = await updateAppointment(appointmentId, {
      notes: newDoctorsNotes,
    });

    if ("error" in response) {
      errorPrompt();

      return;
    }

    prompt({
      icon: <AppointmentIcon />,
      message: `Doctor's Note Added!`,
      description: `Patient's appointment page will be updated soon.`,
    });

    onUpdate();
  }

  function handleAppointmentView(appointment: Appointment) {
    open(
      <ViewAppointment
        appointment={appointment}
        onDoctorsNoteEdit={(newDoctorsNotes) =>
          handleDoctorsNotesEdit(appointment.id, newDoctorsNotes)
        }
        onCancel={onCancel}
        onComplete={onComplete}
      />,
      "View Appointment"
    );
  }

  const columns: ColumnDef<Appointment>[] = [
    {
      header: "Name",
      accessorKey: "patient.displayName",
    },
    type === "doctor"
      ? {
          header: "Clinic",
          accessorKey: "clinic.name",
        }
      : {
          header: "Doctor",
          accessorKey: "doctor.displayName",
        },
    {
      header: "Time",
      accessorKey: "timeblock",
      cell: (info) => {
        return formatTimeblock(info.getValue() as Timeblock);
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info) => {
        return (
          <AppointmentStatus
            status={info.getValue() as Appointment["status"]}
          />
        );
      },
    },
    {
      header: "",
      id: "actions",
      cell: (info) => {
        const appointment = info.row.original;

        return (
          <Button
            variant="clear"
            onClick={() => handleAppointmentView(appointment)}
          >
            View
          </Button>
        );
      },
    },
  ];

  return <Table columns={columns} rowData={data} />;
}
