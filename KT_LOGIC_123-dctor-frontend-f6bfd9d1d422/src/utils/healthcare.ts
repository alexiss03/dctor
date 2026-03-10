import { SAMPLE_CLINIC } from "@/mockData";
import {
  AvailabilityAPI,
  AvailabilitySlotAPI,
  GetInsurancesResultAPI,
  GetTreatmentsResultAPI,
  GetUserResultAPI,
  HealthFacilityAPI,
  InsuranceAPI,
  LocationAPI,
  ReviewAPI,
  SearchResultClinicAPI,
  TreatmentAPI,
  TreatmentCategoryAPI,
  TreatmentSectionAPI,
} from "@/types/api";
import {
  Availability,
  AvailabilitySlot,
  BaseClinic,
  ClinicProfile,
  DoctorAvailability,
  DoctorProfile,
  DoctorTreatment,
  HealthcareTreatment,
  Location,
  Review,
  Treatment,
  TreatmentCategory,
  TreatmentSection,
  TreatmentWithCategory,
} from "@/types/healthcare";
import { DoctorInsurance, Insurance } from "@/types/insurance";
import { BasePatient } from "@/types/patient";
import dayjs from "dayjs";
import _ from "lodash";

export function formatAvailabilitySlot(
  availabilitySlot: AvailabilitySlotAPI
): AvailabilitySlot {
  return {
    dateStart: availabilitySlot.dtstart,
    dateEnd: availabilitySlot.dtend,
    isAvailable: availabilitySlot.is_available,
    clinicId: availabilitySlot.clinic_id,
  };
}

export function formatHealthcareTreatment(
  treatment: TreatmentAPI
): HealthcareTreatment {
  return {
    id: treatment.id,
    name: treatment.treatment.name,
    price: treatment.price,
  };
}

export function formatGetInsurancesResult(
  insurance: GetInsurancesResultAPI
): Insurance {
  return {
    id: insurance.uuid,
    name: insurance.name,
  };
}

export function formatInsurance(
  insurance: InsuranceAPI | GetInsurancesResultAPI
): Insurance {
  return {
    id: "uuid" in insurance ? insurance.uuid : insurance.id,
    name: insurance.name,
  };
}

export function formatAvailability(
  availability: AvailabilityAPI
): Availability {
  return {
    start: availability.time_start,
    end: availability.time_end,
    weekday: availability.weekday,
  };
}

export function formatLocation(location: LocationAPI): Location {
  return {
    text: location.address_line,
    latitude: location.latitude,
    longitude: location.longitude,
  };
}

export function getAvailabilityToday(availability: Availability[]) {
  const currentWeekday = dayjs().day();

  return availability.filter(
    (availability) => availability.weekday === currentWeekday
  );
}

export function formatBaseClinic(clinic: HealthFacilityAPI): BaseClinic {
  return {
    id: clinic.facility.id,
    type: "clinic",
    name: clinic.facility.name,
    avatarUrl: "/DUMMYclinic.jpg", // @TODO: get from api
  };
}

export function formatClinicWithLocation(
  clinic: HealthFacilityAPI
): BaseClinic & Pick<ClinicProfile, "location"> {
  let addresses: LocationAPI[] = [];

  if (Array.isArray(clinic.facility.attributes.addresses)) {
    addresses = clinic.facility.attributes.addresses;
  }

  return {
    ...formatBaseClinic(clinic),
    location: addresses[0]
      ? formatLocation(addresses[0])
      : SAMPLE_CLINIC.location, // @TODO:
  };
}

export function formatDoctorProfile(doctor: GetUserResultAPI): DoctorProfile {
  let healthFacilities: HealthFacilityAPI[] = [];

  if (Array.isArray(doctor.health_facilities)) {
    healthFacilities = doctor.health_facilities as HealthFacilityAPI[];
  }

  const treatmentsPerClinic: DoctorTreatment[] = [];

  healthFacilities.forEach((healthFacility) => {
    let treatments: TreatmentAPI[] = [];

    if (Array.isArray(healthFacility.treatments)) {
      treatments = healthFacility.treatments as TreatmentAPI[];
    }

    treatments.forEach((treatment) => {
      treatmentsPerClinic.push({
        clinic: formatBaseClinic(healthFacility),
        treatment: formatHealthcareTreatment(treatment),
      });
    });
  });

  const insurancesPerClinic: DoctorInsurance[] = [];

  healthFacilities.forEach((healthFacility) => {
    let insurances: InsuranceAPI[] = [];

    if (Array.isArray(healthFacility.insurance_list)) {
      insurances = healthFacility.insurance_list.map(
        (d) => d.insurance
      ) as InsuranceAPI[];
    }

    insurances.forEach((insurance) => {
      insurancesPerClinic.push({
        clinic: formatBaseClinic(healthFacility),
        insurance: formatInsurance(insurance),
      });
    });
  });

  const availabilityPerClinic: DoctorAvailability[] = [];

  healthFacilities.forEach((healthFacility) => {
    let availability: AvailabilityAPI[] = [];

    if (Array.isArray(healthFacility.availability)) {
      availability = healthFacility.availability as AvailabilityAPI[];
    }

    availability.forEach((availability) => {
      availabilityPerClinic.push({
        clinic: formatBaseClinic(healthFacility),
        availability: formatAvailability(availability),
      });
    });
  });

  const clinics = healthFacilities.map((healthFacility) =>
    formatClinicWithLocation(healthFacility)
  );

  let availability: AvailabilitySlotAPI[] = [];

  if (Array.isArray(doctor.availability_calendar)) {
    availability = doctor.availability_calendar as AvailabilitySlotAPI[];
  }

  return {
    id: doctor.id,
    type: "doctor",
    firstName: doctor.first_name,
    lastName: doctor.last_name,
    displayName:
      doctor.name || `${doctor.first_name ?? ""} ${doctor.last_name ?? ""}`.trim(),
    categories: _.uniqBy(treatmentsPerClinic, "id").map(
      (doctorTreatment) => doctorTreatment.treatment
    ),
    treatmentsPerClinic,
    insurancesPerClinic,
    rating: {
      // @TODO: rating from API
      score: null,
      reviewsCount: 0,
    },
    contactNumber: doctor.phone,
    email: doctor.email,
    availabilityPerClinic,
    bio: doctor.bio,
    clinics,
    avatarUrl: doctor.avatar,
    photosUrl: Array.from(new Array(8)).map((_, i) => `${i + 1}.jpg`),
    availability: availability.map((availabilitySlot) =>
      formatAvailabilitySlot(availabilitySlot)
    ),
  };
}

export function formatClinicProfile(
  clinic: SearchResultClinicAPI
): ClinicProfile {
  return {
    id: clinic.source_id,
    type: "clinic",
    name: clinic.name,
    avatarUrl: SAMPLE_CLINIC.avatarUrl, // @TODO:
    categories: clinic.treatments.map((treatment) =>
      formatHealthcareTreatment(treatment)
    ),
    insurances: clinic.insurance_list.map((insurance) =>
      formatInsurance(insurance)
    ),
    rating: SAMPLE_CLINIC.rating, // @TODO:
    location: clinic.addresses[0]
      ? formatLocation(clinic.addresses[0])
      : SAMPLE_CLINIC.location,
    contactNumber: SAMPLE_CLINIC.contactNumber, // @TODO:
    email: SAMPLE_CLINIC.email, // @TODO:
    availability: clinic.availability.map((availability) =>
      formatAvailability(availability)
    ),
    bio: SAMPLE_CLINIC.bio, // @TODO:
    doctors: [], // @TODO:
    photosUrl: Array.from(new Array(8)).map((_, i) => `${i + 1}.jpg`),
  };
}

export function formatGetTreatmentResult(
  treatment: GetTreatmentsResultAPI
): TreatmentWithCategory {
  return {
    id: treatment.uuid,
    name: treatment.name,
    category: { id: treatment.category.id, name: treatment.category.name },
  };
}

export function formatTreatmentSection(
  section: TreatmentSectionAPI,
  allTreatments: TreatmentWithCategory[]
): TreatmentSection {
  return {
    id: section.id,
    name: section.name,
    description: section.description,
    categories: section.sub_categories.map((category) =>
      formatTreatmentCategory(
        category,
        allTreatments.filter(
          (treatment) => treatment.category.id === category.id
        )
      )
    ),
  };
}

export function formatTreatmentCategory(
  category: TreatmentCategoryAPI,
  categoryTreatments: Treatment[]
): TreatmentCategory {
  return {
    id: category.id,
    name: category.name,
    iconUrl: category.icon_url,
    backgroundColor: category.attributes.bg_color,
    cardType: category.attributes.card_type,
    treatmentIds: categoryTreatments.map((treatment) => treatment.id),
  };
}

export function formatReview(
  review: ReviewAPI,
  patient: Pick<BasePatient, "id" | "avatarUrl" | "displayName">
): Review {
  return {
    id: review.id,
    rating: review.rating,
    comment: review.comments,
    dateCreated: review.create_date,
    patient: {
      id: patient.id,
      avatarUrl: patient.avatarUrl,
      displayName: patient.displayName,
    },
  };
}
