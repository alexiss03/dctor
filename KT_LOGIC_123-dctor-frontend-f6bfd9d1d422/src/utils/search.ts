import {
  AvailabilityAPI,
  HealthFacilityAPI,
  InsuranceAPI,
  LocationAPI,
  SearchResultClinicAPI,
  SearchResultDoctorAPI,
  TreatmentAPI,
} from "@/types/api";
import { BaseClinic, ClinicProfile } from "@/types/healthcare";
import { SearchResult } from "@/types/search";
import {
  formatAvailability,
  formatHealthcareTreatment,
  formatInsurance,
  formatLocation,
} from "./healthcare";
import { SAMPLE_CLINIC } from "@/mockData";

export function formatSearchResult(
  search: SearchResultDoctorAPI
): SearchResult | null {
  if (!Array.isArray(search.user.health_facilities)) {
    return null;
  }

  const healthFacilities = search.user.health_facilities as HealthFacilityAPI[];

  // we are currently assuming the first item is the most relevant clinic
  const clinic = healthFacilities[0];

  if (
    !clinic ||
    !Array.isArray(clinic.availability) ||
    !Array.isArray(clinic.treatments) ||
    !Array.isArray(clinic.insurance_list) ||
    !Array.isArray(clinic.facility.attributes.addresses)
  ) {
    return null;
  }

  const id = `${search.source_id}/${clinic.facility.id}`;

  const clinicAvailability = clinic.availability as AvailabilityAPI[];
  const clinicTreatments = clinic.treatments as TreatmentAPI[];
  const clinicInsurances = clinic.insurance_list.map(
    (d) => d.insurance
  ) as InsuranceAPI[];
  const clinicAddresses = clinic.facility.attributes.addresses as LocationAPI[];
  const primaryAddress = clinicAddresses[0];

  return {
    id,
    type: "doctor",
    doctor: {
      id: search.source_id,
      type: "doctor",
      displayName: search.name,
      avatarUrl: search.user.avatar,
      categories: clinicTreatments.map((treatment) =>
        formatHealthcareTreatment(treatment)
      ),
      insurances: clinicInsurances.map((insurance) =>
        formatInsurance(insurance)
      ),
      rating: {
        score: search.user.reviews_received_stats?.aggregate.avg.rating ?? 0,
        reviewsCount: search.user.reviews_received_stats?.aggregate.count ?? 0,
      },
      contactNumber: search.user.phone,
      availability: clinicAvailability.map((availability) =>
        formatAvailability(availability)
      ),
    },
    clinic: {
      id: clinic.facility.id,
      type: "clinic",
      name: clinic.facility.name,
      location: primaryAddress
        ? formatLocation(primaryAddress)
        : SAMPLE_CLINIC.location,
    },
  };
}

export function formatSearchResultToClinic(
  searchResult: SearchResultClinicAPI
): BaseClinic &
  Pick<ClinicProfile, "categories" | "rating" | "location" | "availability"> {
  const primaryAddress = searchResult.addresses[0];

  return {
    id: searchResult.source_id,
    type: "clinic",
    name: searchResult.name,
    avatarUrl: searchResult.facility.avatar,
    categories: searchResult.treatments.map((treatment) =>
      formatHealthcareTreatment(treatment)
    ),
    rating: {
      score:
        searchResult.facility.reviews_received_stats.aggregate.avg.rating || 0,
      reviewsCount:
        searchResult.facility.reviews_received_stats.aggregate.count || 0,
    },
    location: primaryAddress
      ? formatLocation(primaryAddress)
      : SAMPLE_CLINIC.location,
    availability: searchResult.availability.map((availability) =>
      formatAvailability(availability)
    ),
  };
}
