import { DoctorInsurance } from "./insurance";
import { BasePatient } from "./patient";

// availability is intended to represent a usual schedule, not a specific one
// this is not meant to be used with booking, use AvailabilitySlot instead
export type Availability = {
  start: string; // HH:mm:ss format
  end: string;
  weekday: number;
};

export type AvailabilitySlot = {
  dateStart: string; // ISO string
  dateEnd: string;
  isAvailable: boolean;
  clinicId: string;
};

export type DoctorAvailability = {
  clinic: BaseClinic;
  availability: Availability;
};

export type Treatment = {
  id: string;
  name: string;
};

export type HealthcareTreatment = Treatment & {
  price: number;
};

export type TreatmentWithCategory = Treatment & {
  category: {
    id: string;
    name: string;
  };
};

export type TreatmentCategory = {
  id: string;
  name: string;
  iconUrl: string;
  backgroundColor: string;
  cardType: "default" | "categories";
  treatmentIds: Treatment["id"][];
};

export type TreatmentSection = {
  id: string;
  name: string;
  description: string;
  categories: TreatmentCategory[];
};

export type Location = {
  text: string;
  latitude: number;
  longitude: number;
};

export type Rating = {
  score: number | null;
  reviewsCount: number;
};

export type BaseClinic = {
  id: string;
  type: "clinic";
  name: string;
  avatarUrl: string;
};

export type ClinicProfile = BaseClinic & {
  categories: HealthcareTreatment[];
  insurances: Insurance[];
  rating: Rating;
  location: Location;
  contactNumber: string;
  email: string;
  availability: Availability[];
  bio: string;
  doctors: BaseDoctor[];
  photosUrl: string[];
};

export type DoctorTreatment = {
  clinic: BaseClinic;
  treatment: HealthcareTreatment;
};

export type BaseDoctor = {
  id: string;
  type: "doctor";
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl: string;
};

export type DoctorProfile = BaseDoctor & {
  categories: HealthcareTreatment[];
  treatmentsPerClinic: DoctorTreatment[];
  insurancesPerClinic: DoctorInsurance[];
  rating: Rating;
  contactNumber: string;
  email: string;
  availabilityPerClinic: DoctorAvailability[];
  bio: string;
  clinics: (BaseClinic & Pick<ClinicProfile, "location">)[];
  photosUrl: string[];
  availability: AvailabilitySlot[];
};

export type Review = {
  id: string;
  rating: number;
  comment: string;
  dateCreated: string;
  patient: Pick<BasePatient, "id" | "avatarUrl" | "displayName">;
};
