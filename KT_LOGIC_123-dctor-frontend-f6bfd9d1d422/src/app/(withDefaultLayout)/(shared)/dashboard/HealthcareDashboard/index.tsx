"use client";

import classNames from "classnames";
import { TopBar } from "../TopBar";

import { DatePicker } from "@/components/DatePicker";
import dayjs from "dayjs";
import { AppointmentsTable } from "./AppointmentsTable";

import isToday from "dayjs/plugin/isToday";

import { getAppointmentsSelf } from "@/backendServer/appointment";
import { Page } from "@/components/Page";
import { DoctorProfile } from "@/types/healthcare";
import { ClinicUser } from "@/types/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import dashboardStyles from "../style.module.css";
import { NextAppointment } from "./NextAppointment";
import styles from "./style.module.css";

dayjs.extend(isToday);

type HealthcareDashboardProps = {
  user: DoctorProfile | ClinicUser;
};

export function HealthcareDashboard({ user }: HealthcareDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const date = searchParams.get("date");

  const { data: appointments, isLoading: appointmentIsLoading } = useQuery(
    ["appointmentsSelf", date],
    {
      queryFn: () =>
        getAppointmentsSelf({
          date: date ? date : new Date().toISOString(),
        }).then((response) => ("error" in response ? [] : response.data)),
    }
  );

  function handleDatePickerChange(date: Date | null) {
    if (!date) {
      date = new Date();
    }

    const newDate = dayjs(date).format("YYYY/MM/DD");

    router.push(
      `/dashboard?${new URLSearchParams({
        date: newDate,
      }).toString()}`
    );
  }

  function handleAppointmentChange() {
    queryClient.invalidateQueries(["appointmentsSelf", date]);
  }

  const name = user.firstName;

  return (
    <Page>
      <>
        <TopBar user={user} />
        <section className="section">
          <p className={classNames(dashboardStyles.greetings, "section")}>
            Good morning, {name}!
          </p>
          <p className={styles["today-text"]}>
            Today is...{" "}
            <span className={styles["today-date"]}>
              {dayjs().format("MMMM D, YYYY")}
            </span>
          </p>
        </section>
        <section className={classNames(styles["schedule-section"], "section")}>
          <div className={styles["date-picker-container"]}>
            <DatePicker
              inline
              onChange={handleDatePickerChange}
              initialValue={dayjs(date || new Date().toISOString()).toDate()}
            />
          </div>
          <NextAppointment
            type={user.type === "clinicUser" ? "clinic" : user.type}
          />
        </section>
        <section className="section">
          <h2>
            Appointment list for{" "}
            {date && !dayjs(date).isToday()
              ? dayjs(date).format("MMMM D, YYYY")
              : "today"}
          </h2>
          {appointmentIsLoading && (
            <div className="white-box container">
              <p>Loading...</p>
            </div>
          )}
          {appointments &&
            (appointments.length > 0 ? (
              <div className="white-box">
                <AppointmentsTable
                  data={appointments}
                  type={user.type === "clinicUser" ? "clinic" : user.type}
                  onCancel={handleAppointmentChange}
                  onUpdate={handleAppointmentChange}
                  onComplete={handleAppointmentChange}
                />
              </div>
            ) : (
              <div className="white-box container">
                <p>You have no appointments for this date.</p>
              </div>
            ))}
        </section>
      </>
    </Page>
  );
}
