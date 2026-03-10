import { Appointment } from "@/types/appointment";
import {
  Availability,
  BaseClinic,
  BaseDoctor,
  ClinicProfile,
  DoctorProfile,
  HealthcareTreatment,
} from "@/types/healthcare";
import { DoctorInsurance, Insurance } from "@/types/insurance";
import { PatientProfile } from "@/types/patient";
import { SearchResult, SearchResultDoctor } from "@/types/search";
import { User } from "@/types/user";
import dayjs from "dayjs";
import _ from "lodash";

export const SAMPLE_INSURANCE: Insurance = {
  id: "insurance1",
  name: "AXA Insurance",
};

export const SAMPLE_INSURANCE_2: Insurance = {
  id: "insurance2",
  name: "MAX Insurance",
};

export const SAMPLE_INSURANCES = [SAMPLE_INSURANCE, SAMPLE_INSURANCE_2];

export const SAMPLE_CATEGORIES: HealthcareTreatment[] = [
  {
    id: "cardiology",
    name: "Cardiology",
    price: 1000,
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    price: 500,
  },
];

const hours = 14;

export const SAMPLE_AVAILABILITY: Availability[] = _.flatten(
  Array.from(new Array(hours)).map((_, i) => {
    const _start = 9 + i;

    return Array.from(new Array(5)).map((_, j) => {
      const weekday = j + 1;

      return {
        weekday,
        start: `${(_start + "").padStart(2, "0")}:00:00`,
        end: `${(_start + 1 + "").padStart(2, "0")}:00:00`,
      };
    });
  })
);

export const SAMPLE_BASE_CLINIC: BaseClinic = {
  id: "sampleclinic1",
  type: "clinic",
  name: "Toronto Clinic",
  avatarUrl: "/DUMMYclinic.jpg",
};

export const SAMPLE_BASE_CLINIC_2: BaseClinic = {
  id: "sampleclinic2",
  type: "clinic",
  name: "Vancouver Clinic",
  avatarUrl: "/DUMMYclinic.jpg",
};

export const SAMPLE_DOCTOR_INSURANCE: DoctorInsurance = {
  insurance: SAMPLE_INSURANCE,
  clinic: SAMPLE_BASE_CLINIC,
};

export const SAMPLE_USER_PATIENT: User = {
  id: "sample_patient",
  type: "patient",
  firstName: "DUMMY",
  lastName: "PATIENT",
  displayName: "DUMMY PATIENT",
  birthday: dayjs("01/01/1990").toISOString(),
  gender: "M",
  email: "test@test.com",
  avatarUrl: "/DUMMYpatient.jpg",
  bio: "This is a test account.",
};

export const SAMPLE_USER = SAMPLE_USER_PATIENT;

export const SAMPLE_USER_DOCTOR: User = {
  id: "sample_doctor",
  type: "doctor",
  firstName: "DUMMY",
  lastName: "DOCTOR",
  displayName: "Dr. DUMMY PATIENT",
  birthday: dayjs("01/01/1990").toISOString(),
  gender: "M",
  email: "doctor@test.com",
  avatarUrl: "/DUMMYdoctor.jpg",
  bio: "This is a test account.",
};

export const SAMPLE_USER_ADMIN: User = {
  id: "sample_admin",
  type: "admin",
  firstName: "DUMMY",
  lastName: "ADMIN",
  displayName: "DUMMY ADMIN",
  birthday: dayjs("01/01/1990").toISOString(),
  gender: "M",
  email: "admin@test.com",
  avatarUrl: "/DUMMYdoctor.jpg",
  bio: "This is a test account.",
};

export const SAMPLE_PATIENT: PatientProfile = {
  id: "samplepatient1",
  type: "patient",
  firstName: "Sickly",
  lastName: "Juan",
  displayName: "Sickly Juan",
  avatarUrl: "/DUMMYpatient.jpg",
  insurances: [SAMPLE_INSURANCE],
  birthday: dayjs().year(1990).month(9).day(6).toISOString(),
  gender: "M",
  email: "patient@test.com",
  dateCreated: dayjs().toISOString(),
  dateLastOnline: dayjs().toISOString(),
  isPushNotificationsEnabled: true,
  isEmailNotificationsEnabled: false,
  notifyAppointmentIn: 7,
};

export const SAMPLE_BASE_DOCTOR: BaseDoctor = {
  id: "sampledoctor1",
  type: "doctor",
  firstName: "Doctory",
  lastName: "Docz",
  displayName: "Dr. Doctory Docz",
  avatarUrl: "/DUMMYdoctor.jpg",
};

export const SAMPLE_CLINIC: ClinicProfile = {
  ...SAMPLE_BASE_CLINIC,
  categories: SAMPLE_CATEGORIES,
  rating: {
    score: 4.7,
    reviewsCount: 534,
  },
  location: {
    text: "Ontario, Canada",
    latitude: 49.222841,
    longitude: -123.023084,
  },
  email: "clinic@test.com",
  availability: SAMPLE_AVAILABILITY,
  bio: "This is a sample clinic.",
  insurances: [SAMPLE_INSURANCE],
  contactNumber: "+2-647-555-2671",
  doctors: [SAMPLE_BASE_DOCTOR],
  photosUrl: Array.from(new Array(8)).map((_, i) => `${i + 1}.jpg`),
};

export const SAMPLE_CLINIC_2: ClinicProfile = {
  ...SAMPLE_BASE_CLINIC,
  categories: [SAMPLE_CATEGORIES[0]],
  rating: {
    score: 4.2,
    reviewsCount: 712,
  },
  location: {
    text: "Vancouver, Canada",
    latitude: 43.653646,
    longitude: -79.38629,
  },
  email: "clinic2@test.com",
  availability: SAMPLE_AVAILABILITY,
  bio: "This is a sample clinic.",
  insurances: [SAMPLE_INSURANCE],
  contactNumber: "+3-647-555-2671",
  doctors: [SAMPLE_BASE_DOCTOR],
  photosUrl: Array.from(new Array(8)).map((_, i) => `${i + 1}.jpg`),
};

export const SAMPLE_DOCTOR: DoctorProfile = {
  ...SAMPLE_BASE_DOCTOR,
  categories: SAMPLE_CATEGORIES,
  treatmentsPerClinic: SAMPLE_CATEGORIES.map((treatment) => ({
    clinic: SAMPLE_BASE_CLINIC,
    treatment,
  })),
  rating: {
    score: 4.9,
    reviewsCount: 120,
  },
  insurancesPerClinic: [SAMPLE_DOCTOR_INSURANCE],
  contactNumber: "+1-647-555-2671",
  email: "doctor@test.com",
  availabilityPerClinic: SAMPLE_AVAILABILITY.map((availability) => ({
    availability,
    clinic: SAMPLE_BASE_CLINIC,
  })),
  bio: "This is a sample doctor.",
  clinics: [
    { ...SAMPLE_BASE_CLINIC, location: SAMPLE_CLINIC.location },
    { ...SAMPLE_BASE_CLINIC_2, location: SAMPLE_CLINIC_2.location },
  ],
  photosUrl: Array.from(new Array(8)).map((_, i) => `${i + 1}.jpg`),
  availability: [],
};

export const SAMPLE_APPOINTMENT: Appointment = {
  id: "sampleappointment1",
  doctor: SAMPLE_DOCTOR,
  patient: SAMPLE_PATIENT,
  clinic: { ...SAMPLE_BASE_CLINIC, location: SAMPLE_CLINIC.location },
  status: "incoming",
  timeblock: {
    start: dayjs().hour(9).minute(0).second(0).millisecond(0).toISOString(),
    end: dayjs().hour(10).minute(0).second(0).millisecond(0).toISOString(),
  },
  reviewScore: null,
  condition: "my tummy hort",
  doctorsNotes: "Avoid being stressed.",
};

export const SAMPLE_SEARCH_RESULT_DOCTOR: SearchResultDoctor = {
  ..._.pick(
    SAMPLE_DOCTOR,
    "id",
    "type",
    "firstName",
    "lastName",
    "displayName",
    "categories",
    "rating",
    "contactNumber",
    "avatarUrl"
  ),
  availability: SAMPLE_DOCTOR.availabilityPerClinic
    .filter((d) => d.clinic.id === SAMPLE_BASE_CLINIC.id)
    .map((d) => d.availability),
  insurances: SAMPLE_INSURANCES,
};

export const SAMPLE_SEARCH_RESULT: SearchResult = {
  id: "samplesearchresult1",
  type: "doctor",
  doctor: SAMPLE_SEARCH_RESULT_DOCTOR,
  clinic: { ...SAMPLE_BASE_CLINIC, location: SAMPLE_CLINIC.location },
};
