import { getUser } from "@/backendServer/user";
import { BaseClinic, BaseDoctor, DoctorProfile } from "@/types/healthcare";
import { SearchResult } from "@/types/search";
import { formatTimeblock } from "@/utils/date";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { DatePicker } from "../DatePicker";
import { Option, Select } from "../Select";
import styles from "./style.module.css";

type AvailabilityPickerProps = {
  data:
    | SearchResult
    | (BaseDoctor & Pick<DoctorProfile, "availabilityPerClinic">);
  clinicId: BaseClinic["id"];
};

export function AvailabilityPicker({
  data,
  clinicId,
}: AvailabilityPickerProps) {
  const [date, setDate] = useState(new Date());
  const [selectedMonthDate, setSelectedMonthDate] = useState(date);

  const startOfMonth = dayjs(selectedMonthDate).startOf("month").toISOString();
  const endOfMonth = dayjs(selectedMonthDate).endOf("month").toISOString();

  const { data: dataUser } = useQuery(["profile", startOfMonth, endOfMonth], {
    queryFn: () =>
      getUser("doctor" in data ? data.doctor.id : data.id, {
        dtstart: startOfMonth,
        dtend: endOfMonth,
      }).then((response) =>
        "error" in response ? null : (response.data as DoctorProfile)
      ),
  });

  const availability = dataUser?.availability.filter(
    (availabilitySlot) => availabilitySlot.clinicId === clinicId
  );

  const timeslotsOnSelectedWeekday = availability?.filter((availabilitySlot) =>
    dayjs(availabilitySlot.dateStart).isSame(date, "day")
  );

  const [selectedTimeslot, setSelectedTimeslot] = useState<Option | null>(
    timeslotsOnSelectedWeekday?.[0]
      ? {
          value: timeslotsOnSelectedWeekday[0].dateStart,
          label: formatTimeblock({
            start: timeslotsOnSelectedWeekday[0].dateStart,
            end: timeslotsOnSelectedWeekday[0].dateEnd,
          }),
        }
      : null
  );

  function handleDatePickerChange(date: Date) {
    setDate(date);
  }

  function handleMonthChange(date: Date) {
    setSelectedMonthDate(date);
  }

  function handleTimeslotChange(option: unknown) {
    setSelectedTimeslot(option as Option);
  }

  const firstTimeslot = timeslotsOnSelectedWeekday?.filter(
    (d) => d.isAvailable
  )[0];

  function resetTimeslotSelectionOnWeekdayChange() {
    setSelectedTimeslot(
      firstTimeslot
        ? {
            value: firstTimeslot.dateStart,
            label: formatTimeblock({
              start: firstTimeslot.dateStart,
              end: firstTimeslot.dateEnd,
            }),
          }
        : null
    );
  }

  function getDtStartValue() {
    if (!selectedTimeslot) {
      return "";
    }

    const timeblockStart = selectedTimeslot.value;

    const [startHour, startMinute] = timeblockStart.split(":");

    const dateStart = dayjs(date)
      .hour(parseInt(startHour))
      .minute(parseInt(startMinute))
      .second(0)
      .millisecond(0)
      .toISOString();

    return dateStart;
  }

  useEffect(resetTimeslotSelectionOnWeekdayChange, [firstTimeslot]);

  return (
    <>
      <div className={styles["date-picker-container"]}>
        <DatePicker
          inline
          onChange={handleDatePickerChange}
          loadingOnFormSubmit
          required
          minDate={new Date()}
          initialValue={date}
          onMonthChange={handleMonthChange}
          includeDates={
            availability?.map(
              (availabilitySlot) => new Date(availabilitySlot.dateStart)
            ) ?? []
          }
        />
      </div>
      {timeslotsOnSelectedWeekday ? (
        <Select
          options={timeslotsOnSelectedWeekday.map((timeblock) => ({
            value: timeblock.dateStart,
            label: formatTimeblock({
              start: timeblock.dateStart,
              end: timeblock.dateEnd,
            }),
            disabled: !timeblock.isAvailable,
          }))}
          value={selectedTimeslot}
          onChange={handleTimeslotChange}
          loadingOnFormSubmit
          required
        />
      ) : (
        <p style={{ textAlign: "center" }}>Loading appointment slots...</p>
      )}

      <input name="dateStart" type="hidden" value={getDtStartValue()} />
    </>
  );
}
