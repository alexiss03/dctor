import { CancelledIcon } from "@/icons/cancelled";
import { CompletedIcon } from "@/icons/completed";
import { IncomingIcon } from "@/icons/incoming";
import { OngoingIcon } from "@/icons/ongoing";
import { Appointment } from "@/types/appointment";
import { ReactNode } from "react";

import classNames from "classnames";
import styles from "./style.module.css";

const statusTextMap: Record<Appointment["status"], string> = {
  incoming: "Incoming",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusIconMap: Record<Appointment["status"], ReactNode> = {
  incoming: <IncomingIcon />,
  ongoing: <OngoingIcon />,
  completed: <CompletedIcon />,
  cancelled: <CancelledIcon />,
};

type AppointmentStatusProps = {
  status: Appointment["status"];
};

export function AppointmentStatus({ status }: AppointmentStatusProps) {
  return (
    <p
      className={classNames(styles.status, {
        "success-text": status === "completed",
        "error-text": status === "cancelled",
      })}
    >
      {statusIconMap[status]} {statusTextMap[status]}
    </p>
  );
}
