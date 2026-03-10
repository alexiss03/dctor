"use client";

import { BaseClinic } from "@/types/healthcare";
import { Fragment } from "react";

import { TIME_OPTIONS } from "@/utils/date";
import classNames from "classnames";
import dayjs from "dayjs";
import { InputLabel } from "../InputLabel";
import { Select } from "../Select";
import styles from "./style.module.css";

type ScheduleItemProps = {
  weekday: number;
  clinicId: string | null;
};

function ScheduleItem({ weekday, clinicId }: ScheduleItemProps) {
  return (
    <>
      <div
        className={classNames(
          styles["schedule-row-grid"],
          styles["weekday-container"]
        )}
      >
        <div>
          <input
            name={
              clinicId ? `weekday/${clinicId}/${weekday}` : `weekday/${weekday}`
            }
            type="checkbox"
            defaultChecked
          />
        </div>
        <p>{dayjs().day(weekday).format("dddd")}</p>
      </div>
      <div
        className={classNames(
          styles["schedule-row-grid"],
          styles["time-range-container"],
          "two-column"
        )}
      >
        <Select
          name={
            clinicId
              ? `time/${clinicId}/${weekday}/start`
              : `time/${weekday}/start`
          }
          options={TIME_OPTIONS}
          defaultValue={TIME_OPTIONS[0]}
        />
        <Select
          name={
            clinicId ? `time/${clinicId}/${weekday}/end` : `time/${weekday}/end`
          }
          options={TIME_OPTIONS}
          defaultValue={TIME_OPTIONS[13]}
        />
      </div>
    </>
  );
}

type SchedulesProps = {
  clinics?: BaseClinic[];
};

export function Schedules({ clinics }: SchedulesProps) {
  return (clinics || [undefined]).map((clinic) => {
    return (
      <Fragment key={clinic?.id ?? "clinic"}>
        {clinic && <h3>{clinic.name}</h3>}
        <div className={styles["schedule-grid"]}>
          <InputLabel>Set available days</InputLabel>
          <InputLabel>Set available time</InputLabel>
          {Array.from(new Array(7)).map((_, i) => (
            <ScheduleItem key={i} clinicId={clinic?.id ?? null} weekday={i} />
          ))}
        </div>
      </Fragment>
    );
  });
}
