/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetUserResultAPI, HealthFacilityAPI } from "@/types/api";
import { ClinicUser, User } from "@/types/user";

export function getNameWithTitle(user: {
  type: "doctor" | "patient" | "clinicUser";
  firstName: string;
  lastName: string;
}) {
  if (user.type === "patient") {
    return `${user.firstName} ${user.lastName}`;
  }

  return `Dr. ${user.firstName} ${user.lastName}`;
}

export function formatUser(user: GetUserResultAPI): User {
  const userRoles = user.roles.map((role) => role.split("/")[1]);

  const type = userRoles.includes("role_clinic_admin")
    ? "clinicUser"
    : userRoles.includes("role_doctor")
    ? "doctor"
    : userRoles.includes("role_admin")
    ? "admin"
    : "patient";

  let displayName = `${user.first_name} ${user.last_name}`;

  if (type === "doctor") {
    displayName = `Dr. ${user.first_name} ${user.last_name}`;
  }

  return {
    id: user.id,
    type: type,
    firstName: user.first_name,
    lastName: user.last_name,
    displayName,
    birthday: user.birthday,
    gender: user.gender,
    email: user.email,
    avatarUrl: user.avatar,
    bio: user.bio,
  };
}

export function formatClinicAdmin(user: GetUserResultAPI): ClinicUser {
  let healthFacililities: HealthFacilityAPI[] = [];

  if (Array.isArray(user.health_facilities)) {
    healthFacililities = user.health_facilities;
  }

  return {
    ...formatUser(user),
    type: "clinicUser",
    clinic: {
      id: healthFacililities[0].facility.id,
      type: "clinic",
      name: healthFacililities[0].facility.name,
      avatarUrl: "/DUMMYclinic.jpg", // @TODO:
    },
  };
}
