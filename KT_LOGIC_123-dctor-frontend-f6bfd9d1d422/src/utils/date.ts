import customParseFormat from "dayjs/plugin/customParseFormat";

import { Timeblock } from "@/types/appointment";
import { Availability } from "@/types/healthcare";
import dayjs, { Dayjs } from "dayjs";
import _ from "lodash";

dayjs.extend(customParseFormat);

export function formatDate(date: Dayjs | string) {
  return dayjs(date).format("MMMM D, YYYY");
}

export function formatTime(date: Dayjs | string) {
  return dayjs(date).format("hh:mm A");
}

export function formatTimeblock(timeblock: Timeblock) {
  let { start, end } = timeblock;

  if (dayjs(start).isValid()) {
    start = dayjs(start).format("HH:mm:ss");
  }

  if (dayjs(end).isValid()) {
    end = dayjs(end).format("HH:mm:ss");
  }

  return `${dayjs(start, "HH:mm:ss").format("hh:mm A")} - ${dayjs(
    end,
    "HH:mm:ss"
  ).format("hh:mm A")}`;
}

export function formatAvailabilitiesToday(availabilities: Availability[]) {
  const currentWeekday = dayjs().day();

  availabilities = availabilities.filter(
    (availability) => availability.weekday === currentWeekday
  );

  if (!availabilities.length) {
    return `No schedule available today`;
  }

  let { start } = availabilities[0];
  let { end } = availabilities[availabilities.length - 1];

  if (dayjs(start).isValid()) {
    start = dayjs(start).format("HH:mm:ss");
  }

  if (dayjs(end).isValid()) {
    end = dayjs(end).format("HH:mm:ss");
  }

  return `${dayjs(start, "HH:mm:ss").format("hh:mm A")} - ${dayjs(
    end,
    "HH:mm:ss"
  ).format("hh:mm A")}`;
}

export function getAvailabilityTodayText(availabilities: Availability[]) {
  const currentWeekday = dayjs().day();

  const currentTimeblocks = _.filter(
    availabilities,
    (availability) => availability.weekday === currentWeekday
  );

  if (!currentTimeblocks.length) {
    return "No schedule available today.";
  }

  return `${formatAvailabilitiesToday(currentTimeblocks)} (${dayjs().format(
    "dddd"
  )})`;
}

export const TIME_OPTIONS = Array.from(new Array(24)).map((_, i) => ({
  value: `${(i + 9) % 24}`,
  label: dayjs()
    .hour((i + 9) % 24)
    .minute(0)
    .format("hh:mm A"),
}));

export function getDateFromDateAndTime(date: string, start: string) {
  const [startHour, startMinute] = start.split(":");

  return dayjs(date)
    .hour(parseInt(startHour))
    .minute(parseInt(startMinute))
    .second(0)
    .millisecond(0)
    .toISOString();
}
