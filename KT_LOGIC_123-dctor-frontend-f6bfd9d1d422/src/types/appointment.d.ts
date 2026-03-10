import {
  BaseClinic,
  BaseDoctor,
  ClinicProfile,
  DoctorProfile,
} from "./healthcare";
import { BasePatient, PatientProfile } from "./patient";

export type Timeblock = {
  start: string;
  end: string;
};

export type Appointment = {
  id: string;
  doctor: BaseDoctor &
    Pick<
      DoctorProfile,
      | "categories"
      | "insurancesPerClinic"
      | "availabilityPerClinic"
      | "bio"
      | "contactNumber"
    >;
  patient: BasePatient & Pick<PatientProfile, "insurances">;
  clinic: BaseClinic & Pick<ClinicProfile, "location">;
  status: "incoming" | "ongoing" | "completed" | "cancelled";
  timeblock: Timeblock;
  reviewScore: number | null;
  condition: string;
  doctorsNotes: string | null;
};
