import classNames from "classnames";

import { getAppointmentsSelf } from "@/backendServer/appointment";
import { HealthcareBox } from "@/components/HealthcareBox";
import { useQuery } from "@tanstack/react-query";
import styles from "./style.module.css";

type NextAppointmentProps = {
  type: "doctor" | "clinic";
};

export function NextAppointment({ type }: NextAppointmentProps) {
  const { data: nextAppointments } = useQuery(["upcomingAppointments"], {
    queryFn: () =>
      getAppointmentsSelf({
        upcoming: true,
        status: ["incoming", "ongoing"],
      }).then((response) => ("error" in response ? [] : response.data)),
  });

  if (!nextAppointments) {
    return;
  }

  const nextAppointment = nextAppointments[0];

  if (!nextAppointment) {
    return (
      <div
        className={classNames(
          styles["next-appointment-container"],
          "white-box"
        )}
      >
        <p>No upcoming appointments.</p>
      </div>
    );
  }

  const title =
    type === "doctor" ? "Your next appointment" : "Next appointment";

  const upcomingAppointmentsText = type === "doctor" ? "You have" : "There are";

  const upcomingAppointmentsCount = nextAppointments.length;

  return (
    <div
      className={classNames(styles["next-appointment-container"], "white-box")}
    >
      <h3>{title}</h3>
      <hr />
      <HealthcareBox
        data={nextAppointment}
        fields={[
          {
            name: "photo",
          },
          {
            name: "name",
          },
          {
            name: "insurance",
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
        contextRole="patient"
        hasBackground={false}
        hasContainer={false}
        direction="column"
      />
      <div className={styles["bottom-row"]}>
        <p className={styles["upcoming-appointments-text"]}>
          {upcomingAppointmentsCount ? (
            <>
              {upcomingAppointmentsText}{" "}
              <span className={styles["upcoming-appointments-count"]}>
                {upcomingAppointmentsCount}
              </span>{" "}
              upcoming appointment
              {upcomingAppointmentsCount !== 1 ? "s" : ""}
            </>
          ) : (
            "No upcoming appointments."
          )}
        </p>
      </div>
    </div>
  );
}
