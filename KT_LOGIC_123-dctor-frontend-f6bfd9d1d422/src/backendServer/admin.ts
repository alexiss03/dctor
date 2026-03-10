"use server";

import { AvailabilityAPI } from "@/types/api";
import { Availability } from "@/types/healthcare";
import dayjs from "dayjs";
import randomstring from "randomstring";
import { post } from ".";

type CreateUserTreatmentField = {
  treatmentId: string;
  price: number;
};

export type CreateDoctorClinicField = {
  clinicId: string;
  insuranceIds: string[];
  schedule: Availability[];
  treatments: CreateUserTreatmentField[];
};

export type CreateDoctorInput = {
  firstName: string;
  lastName: string;
  gender: "M" | "F";
  email: string;
  birthday: string;
  contactNumber: string;
  bio: string;
  // photo: string; // @TODO: handle image uploads
  clinics: CreateDoctorClinicField[];
};

type SignupResponse = {
  user: {
    id: string;
  };
  permissions: {
    affected_rows: number;
  };
  password: {
    status: string;
  };
};

function getSignupUserId(
  responseData: SignupResponse | { user?: { id?: string }; data?: string; sub?: string; id?: string }
) {
  if (
    responseData &&
    typeof responseData === "object" &&
    "user" in responseData &&
    responseData.user &&
    typeof responseData.user.id === "string"
  ) {
    return responseData.user.id;
  }

  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData &&
    typeof responseData.data === "string"
  ) {
    return responseData.data;
  }

  if (
    responseData &&
    typeof responseData === "object" &&
    "sub" in responseData &&
    typeof responseData.sub === "string"
  ) {
    return responseData.sub;
  }

  if (
    responseData &&
    typeof responseData === "object" &&
    "id" in responseData &&
    typeof responseData.id === "string"
  ) {
    return responseData.id;
  }

  return "";
}

export async function createDoctor(doctorFields: CreateDoctorInput) {
  const password = randomstring.generate(12);

  const payload = {
    agreement: true,
    user: {
      search_index: {
        data: {
          source_type: "doctor",
        },
      },
      password,
      first_name: doctorFields.firstName,
      last_name: doctorFields.lastName,
      avatar: "", // @TODO:
      email: doctorFields.email,
      phone: doctorFields.contactNumber,
      bio: doctorFields.bio,
      gender: doctorFields.gender,
      birthday: dayjs(doctorFields.birthday).format("YYYY-MM-DD"),
      properties: {
        email_notifications: false,
        push_notifications: false,
        notification_reminder: 1,
      },
      left_relationships: {
        data: doctorFields.clinics.map((clinicField) => {
          const newAvailability: Omit<AvailabilityAPI, "rule">[] = [];

          clinicField.schedule.forEach((availability) => {
            const { start, end } = availability;

            const startHour = parseInt(start.split(":")[0]);
            const endHour = parseInt(end.split(":")[0]);

            const length = endHour - startHour;

            Array.from(new Array(length)).forEach((__, i) => {
              newAvailability.push({
                weekday: availability.weekday,
                time_start: `${(startHour + i)
                  .toString()
                  .padStart(2, "0")}:00:00`,
                time_end: `${(startHour + i + 1)
                  .toString()
                  .padStart(2, "0")}:00:00`,
              });
            });
          });

          return {
            relationship_type: "doctor_is_affiliated_to_clinic",
            related_entity_id: clinicField.clinicId,
            availability: {
              data: newAvailability,
            },
            insurance_list: {
              data: clinicField.insuranceIds.map((insuranceId) => ({
                insurance_id: insuranceId,
              })),
            },
            treatments: {
              data: clinicField.treatments.map((treatment) => ({
                treatment_id: treatment.treatmentId,
                currency: "USD",
                price: treatment.price,
              })),
            },
          };
        }),
      },
    },
  };

  const response = await post<SignupResponse>("signup", payload);

  if ("error" in response) {
    return response;
  }

  const id = getSignupUserId(response.data);

  if (!id) {
    return {
      error: {
        statusCode: 500,
        name: "InvalidSignupResponse",
        message: "Signup response did not include a user id.",
      },
    };
  }

  return {
    data: {
      id,
    },
  };
}

export type CreateClinicInput = {
  user: {
    firstName: string;
    lastName: string;
    gender: "M" | "F";
    email: string;
    birthday: string;
    contactNumber: string;
  };
  clinic: {
    name: string;
    email: string;
    contactNumber: string;
    bio: string;
  };
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  // photo: string; // @TODO: handle image uploads
  insuranceIds: string[];
  schedule: Availability[];
  treatments: CreateUserTreatmentField[];
};

export async function createClinic(clinicFields: CreateClinicInput) {
  const password = randomstring.generate(12);

  const payload = {
    agreement: true,
    user: {
      search_index: {
        data: {
          source_type: "clinic_admin",
        },
      },
      password: password,
      first_name: clinicFields.user.firstName,
      last_name: clinicFields.user.lastName,
      avatar: "", // @TODO:
      email: clinicFields.user.email,
      phone: clinicFields.user.contactNumber,
      properties: {
        email_notifications: false,
        push_notifications: false,
        notification_reminder: 1,
      },
      left_relationships: {
        data: [
          {
            relationship_type: "clinic_admin_manages_clinic",
            related_entity_as_facility: {
              data: {
                search_index: {
                  data: {
                    source_type: "clinic",
                    addresses: {
                      data: [
                        {
                          address_line: clinicFields.location.address,
                          latitude: clinicFields.location.latitude,
                          longitude: clinicFields.location.longitude,
                        },
                      ],
                    },
                    availability: {
                      data: clinicFields.schedule.map((availability) => ({
                        weekday: availability.weekday,
                        time_start: availability.start,
                        time_end: availability.end,
                      })),
                    },
                    insurance_list: {
                      data: clinicFields.insuranceIds.map((insuranceId) => ({
                        insurance_id: insuranceId,
                      })),
                    },
                    treatments: {
                      data: clinicFields.treatments.map((treatment) => ({
                        treatment_id: treatment.treatmentId,
                        currency: "USD",
                        price: treatment.price,
                      })),
                    },
                  },
                },
                name: clinicFields.clinic.name,
                email: clinicFields.clinic.email,
                phone: clinicFields.clinic.contactNumber,
                bio: clinicFields.clinic.bio,
              },
            },
          },
        ],
      },
    },
  };

  const response = await post<SignupResponse>("signup", payload);

  if ("error" in response) {
    return response;
  }

  const id = getSignupUserId(response.data);

  if (!id) {
    return {
      error: {
        statusCode: 500,
        name: "InvalidSignupResponse",
        message: "Signup response did not include a user id.",
      },
    };
  }

  return {
    data: {
      id,
    },
  };
}
