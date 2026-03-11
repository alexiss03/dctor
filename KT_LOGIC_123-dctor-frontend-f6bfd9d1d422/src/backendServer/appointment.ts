"use server";

import { TIMESLOT_OCCUPIED } from "@/constants/errors";
import { SAMPLE_CLINIC } from "@/mockData";
import { AppointmentAPI } from "@/types/api";
import { Appointment } from "@/types/appointment";
import {
  BaseClinic,
  BaseDoctor,
  ClinicProfile,
  DoctorProfile,
} from "@/types/healthcare";
import { BasePatient, PatientProfile } from "@/types/patient";
import { SearchResult } from "@/types/search";
import { formatAppointment } from "@/utils/appointment";
import dayjs from "dayjs";
import _ from "lodash";
import { revalidatePath } from "next/cache";
import { get, patch, post } from ".";
import { getUser } from "./user";

type GetAppointmentsSelfProps = {
  date?: string;
  upcoming?: boolean;
  status?: Appointment["status"][];
};

export async function getAppointmentsSelf(options?: GetAppointmentsSelfProps) {
  const searchParams = new URLSearchParams();

  if (options?.date) {
    searchParams.append(
      "filter[dtstart][_gt]",
      dayjs(options.date)
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toISOString()
    );
    searchParams.append(
      "filter[dtstart][_lt]",
      dayjs(options.date)
        .hour(23)
        .minute(59)
        .second(99)
        .millisecond(999)
        .toISOString()
    );
  }

  if (options?.upcoming) {
    searchParams.append(
      "filter[dtstart][_gt]",
      dayjs().hour(0).minute(0).second(0).millisecond(0).toISOString()
    );
  }

  if (options?.status) {
    options.status.forEach((status) => {
      searchParams.append("filter[status][_in]", status);
    });
  }

  let response = await get<AppointmentAPI[]>(
    "users/me/appointments",
    searchParams
  );

  if ("error" in response && response.error.statusCode === 404) {
    response = await get<AppointmentAPI[]>("appointments", searchParams);
  }

  if ("error" in response) {
    return response;
  }

  const normalizedAppointments = response.data
    .map((appointment) => {
      const raw = appointment as Record<string, unknown>;

      const rawAttendees = Array.isArray(raw.attendees)
        ? (raw.attendees as Array<Record<string, unknown>>)
        : [];

      const attendees = rawAttendees
            .map((attendee, index) => ({
              id:
                typeof attendee.id === "string"
                  ? attendee.id
                  : `attendee-${index}`,
              status: null,
              attendee_id:
                (typeof attendee.attendee_id === "string"
                  ? attendee.attendee_id
                  : undefined) ??
                (typeof attendee.attendeeId === "string"
                  ? attendee.attendeeId
                  : undefined) ??
                "",
            }))
            .filter((attendee) => attendee.attendee_id !== "")
      ;

      const status =
        raw.status === "new" ? "incoming" : raw.status;

      const dtStart =
        typeof raw.dtstart === "string"
          ? raw.dtstart
          : typeof raw.dtStart === "string"
          ? raw.dtStart
          : new Date().toISOString();

      const dtEnd =
        typeof raw.dtend === "string"
          ? raw.dtend
          : typeof raw.dtEnd === "string"
          ? raw.dtEnd
          : dtStart;

      const clinicId =
        typeof raw.clinic_id === "string"
          ? raw.clinic_id
          : typeof raw.clinicId === "string"
          ? raw.clinicId
          : "";

      return {
        id: typeof raw.id === "string" ? raw.id : "",
        dtstart: dtStart,
        dtend: dtEnd,
        clinic_id: clinicId,
        attendees,
        status:
          typeof status === "string"
            ? (status as AppointmentAPI["status"])
            : "incoming",
        condition: typeof raw.condition === "string" ? raw.condition : "",
        notes: typeof raw.notes === "string" ? raw.notes : null,
      };
    })
    .filter(
      (appointment) =>
        Array.isArray(appointment.attendees) &&
        appointment.attendees.length >= 2 &&
        !!appointment.clinic_id
    );

  if (normalizedAppointments.length === 0) {
    return { data: [] };
  }

  const doctorsIdsToFetch = _.uniq(
    normalizedAppointments.map(
      (appointment) => appointment.attendees[0].attendee_id
    )
  );

  const patientIdsToFetch = _.uniq(
    normalizedAppointments.map(
      (appointment) => appointment.attendees[1].attendee_id
    )
  );

  const clinicIdsToFetch = _.uniq(
    normalizedAppointments.map((appointment) => appointment.clinic_id)
  );

  const doctorPromises = doctorsIdsToFetch.map((doctorId) =>
    getUser(doctorId).then((response) =>
      "error" in response ? null : response.data
    )
  );
  const patientPromises = patientIdsToFetch.map((doctorId) =>
    getUser(doctorId).then((response) =>
      "error" in response ? null : response.data
    )
  );
  const clinicPromises = clinicIdsToFetch.map((doctorId) =>
    getUser(doctorId).then((response) =>
      "error" in response ? null : response.data
    )
  );

  const allResponses = await Promise.all([
    ...doctorPromises,
    ...patientPromises,
    ...clinicPromises,
  ]);

  return {
    data: normalizedAppointments
      .map((appointment) => {
        const doctor = allResponses.find(
          (d) => d?.id === appointment.attendees[0].attendee_id
        ) as DoctorProfile | undefined;

        const patient = allResponses.find(
          (d) => d?.id === appointment.attendees[1].attendee_id
        ) as (BasePatient & Pick<PatientProfile, "insurances">) | undefined;

        // Keep this resilient in production: skip malformed records instead of
        // throwing, which causes server-action 500s.
        if (!doctor || !patient) {
          return null;
        }

        const clinic = { ...SAMPLE_CLINIC, id: appointment.clinic_id };

        return formatAppointment(appointment, {
          doctor,
          patient,
          clinic: clinic as BaseClinic & Pick<ClinicProfile, "location">,
        });
      })
      .filter((appointment): appointment is Appointment => appointment !== null),
  };
}

type BookAppointmentArgs = {
  doctorID: SearchResult["doctor"]["id"];
  clinicID: SearchResult["clinic"]["id"];
  dateStart: string;
  condition: string;
};

export async function bookAppointment({
  doctorID,
  clinicID,
  dateStart,
  condition,
}: BookAppointmentArgs) {
  let response = await post<{ code: string }>("appointments", {
    appointment: {
      dtstamp: dateStart,
      condition,
      clinic_id: clinicID,
      attendees: {
        data: [{ attendee_id: doctorID }],
      },
    },
  });

  if ("error" in response) {
    response = await post<{ code: string }>("appointments", {
      dtStamp: dateStart,
      dtStart: dateStart,
      status: "new",
      condition,
    });
  }

  if ("error" in response) {
    return response;
  }

  if (response.data.code === "permission-error") {
    return {
      error: {
        statusCode: 400,
        name: "TimeslotOccupied",
        message: TIMESLOT_OCCUPIED,
      },
    };
  }

  return { data: {} };
}

export async function cancelAppointment(appointmentId: Appointment["id"]) {
  let response = await patch(`appointments/${appointmentId}/cancel`, {
    method: "PATCH",
  });

  if ("error" in response && response.error.statusCode === 404) {
    response = await patch(`appointments/${appointmentId}`, {
      status: "cancelled",
    });
  }

  if ("error" in response) {
    return response;
  } else {
    revalidatePath(`/appointments/incoming`);
    revalidatePath(`/appointments/history`);
  }

  return response;
}

export async function completeAppointment(appointmentId: Appointment["id"]) {
  let response = await patch(`appointments/${appointmentId}/complete`);

  if ("error" in response && response.error.statusCode === 404) {
    response = await patch(`appointments/${appointmentId}`, {
      status: "completed",
    });
  }

  if ("error" in response) {
    return response;
  } else {
    revalidatePath(`/appointments/incoming`);
    revalidatePath(`/appointments/history`);
  }

  return response;
}

export async function rescheduleAppointment(
  appointmentId: Appointment["id"],
  timestamp: string
) {
  const payload = {
    appointment: {
      dtstamp: dayjs(timestamp).toISOString(),
    },
  };

  let response = await patch(
    `appointments/${appointmentId}/reschedule`,
    payload
  );

  if ("error" in response && response.error.statusCode === 404) {
    response = await patch(`appointments/${appointmentId}`, {
      dtStart: dayjs(timestamp).toISOString(),
      dtStamp: dayjs(timestamp).toISOString(),
    });
  }

  return response;
}

type ReviewAppointmentPayload = {
  patientId: BasePatient["id"];
  doctorId: BaseDoctor["id"];
  rating: number;
  comment: string;
};

export async function reviewAppointment(
  appointmentId: Appointment["id"],
  payload: ReviewAppointmentPayload
) {
  const _payload = {
    review: {
      created_by_id: payload.patientId,
      create_date: dayjs().toISOString(),
      last_updated_by_id: payload.patientId,
      last_update_date: dayjs().toISOString(),
      reviewer_id: payload.patientId,
      reviewee_id: payload.doctorId,
      reference_id: appointmentId,
      reference_type: "appointment",
      rating: payload.rating,
      comments: payload.comment,
      reviewer_type: "patient",
      reviewee_type: "doctor",
    },
  };

  let response = await post("reviews", _payload);

  if ("error" in response && response.error.statusCode === 404) {
    response = await post("doctor-reviews", {
      doctorId: payload.doctorId,
      patientId: payload.patientId,
      rating: payload.rating,
      comments: payload.comment,
    });
  }

  return response;
}

type UpdateAppointmentData = {
  notes?: string;
};

export async function updateAppointment(
  id: Appointment["id"],
  data: UpdateAppointmentData
) {
  const payload: Record<string, unknown> = {};

  if (data.notes) {
    payload.notes = data.notes;
  }

  console.log(payload);

  let response = await patch(`appointments/${id}`, {
    data: payload,
  });

  if ("error" in response) {
    response = await patch(`appointments/${id}`, payload);
  }

  return response;
}
