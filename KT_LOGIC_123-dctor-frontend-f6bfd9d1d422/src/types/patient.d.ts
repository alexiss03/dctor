import { Insurance } from "./insurance";

export type BasePatient = {
  id: string;
  type: "patient";
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl: string;
};

export type PatientProfile = BasePatient & {
  insurances: Insurance[];
  birthday: string;
  gender: "M" | "F";
  email: string;
  dateCreated: string;
  dateLastOnline: string;
  isPushNotificationsEnabled: boolean;
  isEmailNotificationsEnabled: boolean;
  notifyAppointmentIn: number;
};
