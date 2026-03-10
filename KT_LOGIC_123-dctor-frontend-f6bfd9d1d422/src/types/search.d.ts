import {
  Availability,
  HealthcareTreatment,
  Location,
  Rating,
} from "./healthcare";
import { Insurance } from "./insurance";

export type SearchResultDoctor = {
  id: string;
  type: "doctor";
  displayName: string;
  avatarUrl: string;
  categories: HealthcareTreatment[];
  insurances: Insurance[];
  rating: Rating;
  contactNumber: string;
  availability: Availability[];
};

export type SearchResultClinic = {
  id: string;
  type: "clinic";
  name: string;
  location: Location;
};

export type SearchResult = {
  id: string;
  type: "doctor";
  doctor: SearchResultDoctor;
  clinic: SearchResultClinic;
};
