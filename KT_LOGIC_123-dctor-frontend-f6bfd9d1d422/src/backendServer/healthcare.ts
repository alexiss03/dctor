"use server";

import {
  GetTreatmentCategoriesResultAPI,
  GetTreatmentsResultAPI,
  ReviewAPI,
} from "@/types/api";
import { BaseClinic, ClinicProfile } from "@/types/healthcare";
import { PatientProfile } from "@/types/patient";
import { SearchResult } from "@/types/search";
import {
  formatGetTreatmentResult,
  formatReview,
  formatTreatmentSection,
} from "@/utils/healthcare";
import { ErrorResponse, SuccessfulResponse, get } from ".";
import { search } from "./search";
import { getUser } from "./user";

type LegacyTreatmentCategoryRecord = {
  id?: string;
  uuid?: string;
  name?: string;
  parent?: string | null;
  parent_id?: string | null;
  parentId?: string | null;
  icon_url?: string;
  iconUrl?: string;
  description?: string;
};

function normalizeTreatmentSections(
  payload: unknown
): GetTreatmentCategoriesResultAPI["treatment_categories"] {
  if (
    payload &&
    typeof payload === "object" &&
    "treatment_categories" in payload &&
    Array.isArray(
      (payload as GetTreatmentCategoriesResultAPI).treatment_categories
    )
  ) {
    return (payload as GetTreatmentCategoriesResultAPI).treatment_categories;
  }

  if (!Array.isArray(payload)) {
    return [];
  }

  const records = payload as LegacyTreatmentCategoryRecord[];

  const sectionsById = new Map<
    string,
    GetTreatmentCategoriesResultAPI["treatment_categories"][number]
  >();

  records.forEach((record) => {
    const id = `${record.id ?? record.uuid ?? ""}`;
    const parentId = `${record.parent_id ?? record.parentId ?? record.parent ?? ""}`;

    if (!id || parentId) {
      return;
    }

    sectionsById.set(id, {
      id,
      name: record.name ?? "General",
      icon_url: record.icon_url ?? record.iconUrl ?? "",
      parent: null,
      sub_categories: [],
      description: record.description ?? "",
    });
  });

  records.forEach((record) => {
    const id = `${record.id ?? record.uuid ?? ""}`;
    const parentId = `${record.parent_id ?? record.parentId ?? record.parent ?? ""}`;

    if (!id) {
      return;
    }

    if (!parentId) {
      const section = sectionsById.get(id);

      if (section && section.sub_categories.length === 0) {
        section.sub_categories.push({
          id: section.id,
          name: section.name,
          icon_url: section.icon_url,
          attributes: {
            bg_color: "#F4F5F8",
            card_type: "default",
          },
        });
      }

      return;
    }

    const parentSection = sectionsById.get(parentId);

    if (parentSection) {
      parentSection.sub_categories.push({
        id,
        name: record.name ?? "General",
        icon_url: record.icon_url ?? record.iconUrl ?? "",
        attributes: {
          bg_color: "#F4F5F8",
          card_type: "default",
        },
      });
      return;
    }

    sectionsById.set(id, {
      id,
      name: record.name ?? "General",
      icon_url: record.icon_url ?? record.iconUrl ?? "",
      parent: null,
      sub_categories: [
        {
          id,
          name: record.name ?? "General",
          icon_url: record.icon_url ?? record.iconUrl ?? "",
          attributes: {
            bg_color: "#F4F5F8",
            card_type: "default",
          },
        },
      ],
      description: record.description ?? "",
    });
  });

  return Array.from(sectionsById.values());
}

export async function getClinics() {
  return search({
    types: ["clinic"],
  }) as Promise<
    | ErrorResponse
    | SuccessfulResponse<
        (BaseClinic &
          Pick<
            ClinicProfile,
            "categories" | "rating" | "location" | "availability"
          >)[]
      >
  >;
}

export async function getTreatments() {
  const response = await get<GetTreatmentsResultAPI[]>("treatments");

  if ("error" in response) {
    return response;
  }

  const treatments = response.data as Array<
    GetTreatmentsResultAPI & {
      id?: string;
      uuid?: string;
      categoryId?: string;
      category_id?: string;
      category?: { id: string; name: string };
    }
  >;

  return {
    data: treatments.map((treatment) => {
      if (
        treatment.category &&
        typeof treatment.category.id === "string" &&
        typeof treatment.category.name === "string"
      ) {
        return formatGetTreatmentResult(treatment);
      }

      return {
        id: `${treatment.uuid ?? treatment.id ?? ""}`,
        name: treatment.name,
        category: {
          id: `${treatment.categoryId ?? treatment.category_id ?? "uncategorized"}`,
          name: "General",
        },
      };
    }),
  };
}

type GetDoctorsClinicsOptions = {
  clinicId?: BaseClinic["id"];
};

export async function getDoctorsClinics(
  q?: string,
  options?: GetDoctorsClinicsOptions
) {
  const searchResponse = (await search({
    q,
    types: ["doctor", "clinic"],
  })) as
    | ErrorResponse
    | SuccessfulResponse<
        (
          | SearchResult
          | (BaseClinic &
              Pick<
                ClinicProfile,
                "categories" | "rating" | "location" | "availability"
              >)
        )[]
      >;

  if ("error" in searchResponse) {
    return searchResponse;
  }

  return {
    data: searchResponse.data.filter((d) => {
      if (!options?.clinicId) {
        return true;
      }

      if (d.type !== "doctor") {
        return false;
      }

      if ("clinic" in d) {
        return d.clinic.id === options.clinicId;
      }

      return true;
    }),
  };
}

async function _getTreatmentSections() {
  const response = await get<GetTreatmentCategoriesResultAPI | unknown>(
    "treatments/categories"
  );

  if ("error" in response) {
    return response;
  }

  return { data: normalizeTreatmentSections(response.data) };
}

export async function getTreatmentSections() {
  const [treatmentSections, treatments] = await Promise.all([
    _getTreatmentSections(),
    getTreatments(),
  ]);

  if ("error" in treatmentSections) {
    return { error: treatmentSections.error };
  }

  if ("error" in treatments) {
    return { error: treatments.error };
  }

  return {
    data: treatmentSections.data.map((section) =>
      formatTreatmentSection(section, treatments.data)
    ),
  };
}

export async function getTreatmentSection(id: string) {
  const response = await getTreatmentSections();

  if ("error" in response) {
    return response as ErrorResponse;
  }

  const treatmentSection = response.data.find((section) => section.id === id);

  return { data: treatmentSection ?? null };
}

type GetReviewsOptions = {
  type?: "doctor" | "clinic";
  limit?: number;
};

type GetReviewsResponse = {
  reviews: ReviewAPI[];
  total: {
    aggregate: {
      count: number;
    };
  };
};

// @TODO: support clinics
export async function getReviews(id: string, options?: GetReviewsOptions) {
  const searchParams = new URLSearchParams();

  if (options?.limit !== undefined) {
    searchParams.append("limit", `${options.limit}`);
  }

  let response = await get<GetReviewsResponse>(
    `users/${id}/reviews`,
    searchParams
  );

  if ("error" in response && response.error.statusCode === 404) {
    const fallbackSearchParams = new URLSearchParams();

    fallbackSearchParams.append("filter[where][doctorId]", id);

    if (options?.limit !== undefined) {
      fallbackSearchParams.append("filter[limit]", `${options.limit}`);
    }

    const fallbackResponse = await get<
      Array<{
        id: string;
        patientId?: string;
        patient_id?: string;
        doctorId?: string;
        doctor_id?: string;
        createDate?: string;
        create_date?: string;
        rating?: number;
        comments?: string;
      }>
    >("doctor-reviews", fallbackSearchParams);

    if ("error" in fallbackResponse) {
      return fallbackResponse;
    }

    response = {
      data: {
        reviews: fallbackResponse.data.map((review) => ({
          id: review.id,
          reviewer_id: `${review.patientId ?? review.patient_id ?? ""}`,
          reviewee_id: `${review.doctorId ?? review.doctor_id ?? id}`,
          create_date:
            review.createDate ?? review.create_date ?? new Date().toISOString(),
          rating: review.rating ?? 0,
          reference_id: review.id,
          reference_type: "doctor-review",
          comments: review.comments ?? "",
        })),
        total: {
          aggregate: {
            count: fallbackResponse.data.length,
          },
        },
      },
    };
  }

  if ("error" in response) {
    return response;
  }

  const fetchPatientsPromises = response.data.reviews
    .map((review) =>
      getUser(review.reviewer_id).then((response) => {
        if ("error" in response) {
          return null;
        }

        return response.data as PatientProfile;
      })
    )
    .filter((d) => !!d) as Promise<PatientProfile>[];

  const patients = await Promise.all(fetchPatientsPromises);

  const data = response.data.reviews.flatMap((review) => {
    const patient = patients.find((patient) => patient.id === review.reviewer_id);

    if (!patient) {
      return [];
    }

    return [formatReview(review, patient)];
  });

  return { data };
}
