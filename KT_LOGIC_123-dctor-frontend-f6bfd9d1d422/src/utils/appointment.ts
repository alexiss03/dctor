import { AppointmentAPI } from "@/types/api";
import { Appointment } from "@/types/appointment";
import { BaseClinic, ClinicProfile, DoctorProfile } from "@/types/healthcare";
import { BasePatient, PatientProfile } from "@/types/patient";

type FormatAppointmentAdditionalData = {
  doctor: DoctorProfile;
  patient: BasePatient & Pick<PatientProfile, "insurances">;
  clinic: BaseClinic & Pick<ClinicProfile, "location">;
};

export function formatAppointment(
  appointment: AppointmentAPI,
  { doctor, patient, clinic }: FormatAppointmentAdditionalData
): Appointment {
  return {
    id: appointment.id,
    doctor,
    patient,
    clinic,
    status: appointment.status,
    timeblock: {
      start: appointment.dtstart,
      end: appointment.dtend,
    },
    reviewScore: null, // @TODO: api doesn't have review score yet
    condition: appointment.condition,
    doctorsNotes: appointment.notes,
  };
}
