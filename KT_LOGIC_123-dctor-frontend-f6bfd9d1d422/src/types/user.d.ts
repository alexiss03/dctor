import { BaseClinic } from "./healthcare";

export type User = {
  id: string;
  type: "patient" | "doctor" | "admin" | "clinicUser";
  firstName: string;
  lastName: string;
  displayName: string;
  birthday: string;
  gender: "M" | "F";
  email: string;
  avatarUrl: string;
  bio: string;
};

export type ClinicUser = User & {
  type: "clinicUser";
  clinic: BaseClinic;
};
