import {
  GetUserResultAPI,
  InsuranceAPI,
  SearchResultPatientAPI,
} from "@/types/api";
import { BasePatient, PatientProfile } from "@/types/patient";
import { formatInsurance } from "./healthcare";

export function formatPatient(patient: GetUserResultAPI): PatientProfile {
  let insurances: InsuranceAPI[] = [];

  if (Array.isArray(patient.insurance_list)) {
    insurances = patient.insurance_list.map(
      (d) => d.insurance
    ) as InsuranceAPI[];
  }

  return {
    id: patient.id,
    type: "patient",
    firstName: patient.first_name,
    lastName: patient.last_name,
    displayName:
      patient.name || `${patient.first_name ?? ""} ${patient.last_name ?? ""}`.trim(),
    insurances,
    birthday: patient.birthday,
    gender: patient.gender,
    email: patient.email,
    dateCreated: new Date().toISOString(), // @TODO: get from api
    dateLastOnline: new Date().toISOString(), // @TODO: get from api
    isPushNotificationsEnabled: patient.properties?.push_notifications ?? false,
    isEmailNotificationsEnabled:
      patient.properties?.email_notifications ?? false,
    notifyAppointmentIn: patient.properties?.notification_reminder ?? 7,
    avatarUrl: patient.avatar,
  };
}

export function formatSearchResultPatient(
  patient: SearchResultPatientAPI
): BasePatient & Pick<PatientProfile, "insurances"> {
  return {
    id: patient.source_id,
    type: "patient",
    firstName: "", // @TODO:
    lastName: "", // @TODO:
    displayName: patient.name,
    avatarUrl: patient.user.avatar,
    insurances: patient.insurance_list.map((d) => formatInsurance(d.insurance)),
  };
}
