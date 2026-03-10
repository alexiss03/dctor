"use server";

import { SearchResultAPI } from "@/types/api";
import { BaseClinic, ClinicProfile, Treatment } from "@/types/healthcare";
import { BasePatient, PatientProfile } from "@/types/patient";
import { SearchResult } from "@/types/search";
import { formatSearchResultPatient } from "@/utils/patient";
import { formatSearchResult, formatSearchResultToClinic } from "@/utils/search";
import { get } from ".";

type SearchOptions = {
  q?: string;
  types?: ("doctor" | "clinic" | "patient")[];
  treatmentIds?: Treatment["id"][];
  minPrice?: string;
  maxPrice?: string;
  insurances?: string[];
  weekday?: string;
  time?: string;
  rating?: string;
};

type SearchResponse<T> = {
  search_results: T[];
  total: {
    aggregate: {
      count: number;
    };
  };
};

type LegacyDoctorSearchResult = Extract<SearchResultAPI, { source_type: "doctor" }>;
type LegacyClinicSearchResult = Extract<SearchResultAPI, { source_type: "clinic" }>;
type LegacyPatientSearchResult = Extract<SearchResultAPI, { source_type: "patient" }>;

type RawSearchIndexDoctor = {
  sourceType?: string;
  source_type?: string;
  sourceId?: string;
  source_id?: string;
  name?: string;
  rating?: number;
  treatments?: Array<{
    id?: string;
    name?: string;
    price?: number;
    currency?: string;
  }>;
  insurance?: Array<{
    id?: string;
    name?: string;
  }>;
  availability?: Array<{
    weekday?: number;
    timeStart?: string;
    time_start?: string;
    timeEnd?: string;
    time_end?: string;
  }>;
  addresses?: Array<{
    addressLine?: string;
    address_line?: string;
    latitude?: number;
    longitude?: number;
  }>;
};

function getSearchResultsPayload(
  payload: unknown
): SearchResultAPI[] {
  if (Array.isArray(payload)) {
    return payload as SearchResultAPI[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    "search_results" in payload &&
    Array.isArray((payload as SearchResponse<SearchResultAPI>).search_results)
  ) {
    return (payload as SearchResponse<SearchResultAPI>).search_results;
  }

  return [];
}

function getSourceType(value: unknown): string | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as { source_type?: unknown; sourceType?: unknown };

  if (typeof record.source_type === "string") {
    return record.source_type;
  }

  if (typeof record.sourceType === "string") {
    return record.sourceType;
  }

  return null;
}

function isLegacyDoctorRecord(
  value: SearchResultAPI
): value is LegacyDoctorSearchResult {
  return (
    value.source_type === "doctor" &&
    "user" in value &&
    value.user !== null &&
    typeof value.name === "string"
  );
}

function isLegacyClinicRecord(
  value: SearchResultAPI
): value is LegacyClinicSearchResult {
  return (
    value.source_type === "clinic" &&
    "facility" in value &&
    value.facility !== null &&
    typeof value.name === "string"
  );
}

function isLegacyPatientRecord(
  value: SearchResultAPI
): value is LegacyPatientSearchResult {
  return (
    value.source_type === "patient" &&
    "user" in value &&
    value.user !== null &&
    typeof value.name === "string"
  );
}

function formatRawSearchIndexDoctor(
  search: RawSearchIndexDoctor
): SearchResult | null {
  const doctorId = `${search.source_id ?? search.sourceId ?? ""}`;

  if (!doctorId) {
    return null;
  }

  const doctorName = search.name ?? "Global Doctor";

  const treatments = Array.isArray(search.treatments)
    ? search.treatments
    : [];
  const insurance = Array.isArray(search.insurance) ? search.insurance : [];
  const availability = Array.isArray(search.availability)
    ? search.availability
    : [];
  const addresses = Array.isArray(search.addresses) ? search.addresses : [];

  const firstAddress = addresses[0];
  const addressText =
    firstAddress?.address_line ??
    firstAddress?.addressLine ??
    "Global Clinic";
  const cityName = addressText.split(",")[0]?.trim() || "Global";
  const latitude =
    typeof firstAddress?.latitude === "number" ? firstAddress.latitude : 0;
  const longitude =
    typeof firstAddress?.longitude === "number" ? firstAddress.longitude : 0;

  const clinicId = `world-clinic-${doctorId}`;

  return {
    id: `${doctorId}/${clinicId}`,
    type: "doctor",
    doctor: {
      id: doctorId,
      type: "doctor",
      displayName: doctorName,
      avatarUrl: `https://robohash.org/${encodeURIComponent(doctorId)}`,
      categories:
        treatments.length > 0
          ? treatments.map((treatment, index) => ({
              id: treatment.id ?? `treatment-${index + 1}`,
              name: treatment.name ?? "General Consultation",
              price:
                typeof treatment.price === "number" ? treatment.price : 100,
            }))
          : [
              {
                id: "treatment-1",
                name: "General Consultation",
                price: 100,
              },
            ],
      insurances:
        insurance.length > 0
          ? insurance.map((record, index) => ({
              id: record.id ?? `insurance-${index + 1}`,
              name: record.name ?? "Global Health Plan",
            }))
          : [
              {
                id: "insurance-1",
                name: "Global Health Plan",
              },
            ],
      rating: {
        score: typeof search.rating === "number" ? search.rating : 4.2,
        reviewsCount: 12,
      },
      contactNumber: "",
      availability:
        availability.length > 0
          ? availability.map((item) => ({
              weekday: typeof item.weekday === "number" ? item.weekday : 1,
              start: item.time_start ?? item.timeStart ?? "09:00:00",
              end: item.time_end ?? item.timeEnd ?? "17:00:00",
            }))
          : [
              {
                weekday: 1,
                start: "09:00:00",
                end: "17:00:00",
              },
            ],
    },
    clinic: {
      id: clinicId,
      type: "clinic",
      name: `${cityName} Medical Center`,
      location: {
        text: addressText,
        latitude,
        longitude,
      },
    },
  };
}

export async function search<
  T extends
    | SearchResult
    | (BaseClinic & Partial<ClinicProfile>)
    | (BasePatient & Partial<PatientProfile>)
>(options?: SearchOptions) {
  const searchParams = new URLSearchParams();
  let hasMobileFilter = false;

  if (options?.q) {
    searchParams.append("query[input]", options.q);
    hasMobileFilter = true;
  }

  if (options?.types) {
    if (options.types.length === 1) {
      searchParams.append("filter[where][sourceType]", options.types[0]);
    } else {
      options.types.forEach((type) => {
        searchParams.append("filter[where][sourceType][inq]", type);
      });
    }
  }

  if (options?.treatmentIds) {
    options.treatmentIds.forEach((treatmentId) => {
      searchParams.append("query[treatments]", treatmentId);
    });
    hasMobileFilter = true;
  }

  if (options?.minPrice) {
    searchParams.append("query[minPrice]", options.minPrice);
    hasMobileFilter = true;
  }

  if (options?.maxPrice) {
    searchParams.append("query[maxPrice]", options.maxPrice);
    hasMobileFilter = true;
  }

  if (options?.insurances) {
    options.insurances.forEach((insurance) => {
      searchParams.append("query[insurance]", insurance);
    });
    hasMobileFilter = true;
  }

  if (options?.weekday) {
    searchParams.append("query[weekday]", `${options.weekday}`);
    hasMobileFilter = true;
  }

  if (options?.time) {
    searchParams.append("query[availability]", `${options.time}`);
    hasMobileFilter = true;
  }

  if (options?.rating) {
    searchParams.append("query[rating]", `${options.rating}`);
    hasMobileFilter = true;
  }

  if (hasMobileFilter) {
    searchParams.append("filter-template", "mobile-search");
  }

  const response = await get<SearchResponse<SearchResultAPI>>(
    `search`,
    searchParams
  );

  if ("error" in response) {
    return response;
  }

  const result = getSearchResultsPayload(response.data);

  return {
    data: result
      .map((d) => {
        try {
          const sourceType = getSourceType(d);

          if (sourceType === "doctor") {
            if (isLegacyDoctorRecord(d)) {
              return formatSearchResult(d);
            }

            return formatRawSearchIndexDoctor(
              d as unknown as RawSearchIndexDoctor
            );
          } else if (sourceType === "clinic") {
            if (!isLegacyClinicRecord(d)) {
              return null;
            }

            return formatSearchResultToClinic(d);
          } else {
            if (!isLegacyPatientRecord(d)) {
              return null;
            }

            return formatSearchResultPatient(d);
          }
        } catch (e) {
          return null;
        }
      })
      .filter((d) => !!d) as T[],
  };
}
