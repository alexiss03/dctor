"use server";

import { GetUserResultAPI } from "@/types/api";
import { DoctorProfile } from "@/types/healthcare";
import { PatientProfile } from "@/types/patient";
import { ClinicUser, User } from "@/types/user";
import { formatDoctorProfile } from "@/utils/healthcare";
import { formatPatient } from "@/utils/patient";
import { formatClinicAdmin, formatUser } from "@/utils/user";
import { ErrorResponse, SuccessfulResponse, get, patch, post } from ".";

function normalizeRoles(roles: unknown): string[] {
  if (!Array.isArray(roles)) {
    return [];
  }

  return roles
    .map((role) => {
      if (typeof role === "string") {
        return role;
      }

      if (
        role &&
        typeof role === "object" &&
        "owner" in role &&
        "name" in role
      ) {
        return `${role.owner}/${role.name}`;
      }

      return null;
    })
    .filter((role): role is string => !!role);
}

function normalizeUser(user: GetUserResultAPI): GetUserResultAPI {
  const _user = user as GetUserResultAPI & {
    firstName?: string;
    lastName?: string;
    createDate?: string;
    healthFacilities?: unknown;
  };

  return {
    ..._user,
    first_name: _user.first_name ?? _user.firstName ?? "",
    last_name: _user.last_name ?? _user.lastName ?? "",
    roles: normalizeRoles(_user.roles),
    health_facilities:
      _user.health_facilities ??
      (_user.healthFacilities as GetUserResultAPI["health_facilities"]) ??
      [],
  };
}

function formatGetUserResponse(user: GetUserResultAPI) {
  const normalizedUser = normalizeUser(user);

  const userRoles = normalizedUser.roles.map((role) => role.split("/")[1]);

  if (userRoles.includes("role_doctor")) {
    return formatDoctorProfile(normalizedUser);
  } else if (userRoles.includes("role_patient")) {
    return formatPatient(normalizedUser);
  } else if (userRoles.includes("role_clinic_admin")) {
    return formatClinicAdmin(normalizedUser);
  }

  return formatUser(normalizedUser);
}

type GetUserOptions = {
  dtstart?: string;
  dtend?: string;
};

export async function getUser<
  T extends DoctorProfile | PatientProfile | ClinicUser | User | null
>(
  userId: string,
  options?: GetUserOptions
): Promise<ErrorResponse | SuccessfulResponse<T>> {
  const searchParams = new URLSearchParams();

  if (options?.dtstart) {
    searchParams.append("dtstart", options.dtstart);
  }

  if (options?.dtend) {
    searchParams.append("dtend", options.dtend);
  }

  const response = await get<GetUserResultAPI>(`users/${userId}`, searchParams);

  if ("error" in response) {
    return response;
  }

  return { data: formatGetUserResponse(response.data) as T };
}

export async function getCurrentUser<
  T extends DoctorProfile | PatientProfile | User
>() {
  const response = await get<GetUserResultAPI>("users/me");

  if ("error" in response) {
    return { data: null };
  }

  return { data: formatGetUserResponse(response.data) as T };
}

export type EditProfileOptions = {
  firstName?: string;
  lastName?: string;
  name?: string;
  gender?: string;
  birthday?: string;
  email?: string;
};

export async function editProfile(
  profileId: string,
  options: EditProfileOptions
) {
  const payload: { user: Record<string, string> } = {
    user: {},
  };

  if (options.firstName) {
    payload.user.first_name = options.firstName;
  }

  if (options.lastName) {
    payload.user.last_name = options.lastName;
  }

  if (options.name) {
    payload.user.name = options.name;
  }

  if (options.gender) {
    payload.user.gender = options.gender;
  }

  if (options.birthday) {
    payload.user.birthday = options.birthday;
  }

  if (options.email) {
    payload.user.email = options.email;
  }

  const response = await patch(`users/${profileId}`, payload);

  return response;
}

type ChangeNotificationSettingsOptions = {
  notifyAppointmentIn: number;
  isPushNotificationsEnabled: boolean;
  isEmailNotificationsEnabled: boolean;
};

export async function changeNotificationSettings(
  id: string,
  options: ChangeNotificationSettingsOptions
) {
  const payload = {
    user: {
      properties: {
        push_notifications: options.isPushNotificationsEnabled,
        email_notifications: options.isEmailNotificationsEnabled,
        notification_reminder: options.notifyAppointmentIn,
      },
    },
  };

  const response = await patch(`users/${id}`, payload);

  if ("error" in response) {
    return response;
  }

  return {
    data: {},
  };
}

export async function changePassword(
  userId: string,
  oldPassword: string,
  newPassword: string
) {
  const response = await post("set-password", {
    userName: userId,
    oldPassword,
    newPassword,
  });

  if (
    "data" in response &&
    response.data &&
    typeof response.data === "object" &&
    "status" in response.data &&
    response.data.status === "error" &&
    "msg" in response.data &&
    typeof response.data.msg === "string"
  ) {
    return {
      error: {
        statusCode: 400,
        name: "InvalidPassword",
        message: response.data.msg,
      },
    };
  }
  return response;
}
