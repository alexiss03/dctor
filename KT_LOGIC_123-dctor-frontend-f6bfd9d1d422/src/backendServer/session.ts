import { cookies } from "next/headers";
import { post } from ".";

type LoginResponse = {
  sub: string;
  data2: string;
  status: "ok" | "error";
  data: string;
  name: string;
  msg: string;
};

export async function login(email: string, password: string) {
  const response = await post<LoginResponse>(
    `login?${new URLSearchParams({
      responseType: "token",
    })}`,
    {
      type: "token",
      username: email,
      password: password,
    },
    true
  );

  if ("error" in response) {
    return response;
  }

  if (response.data.status === "error") {
    return {
      error: {
        statusCode: 400,
        name: "LoginFailed",
        message: response.data.msg,
      },
    };
  }

  const nextCookies = cookies();

  nextCookies.set("Authorization", `Bearer ${response.data.data}`);

  return { data: { ok: true } };
}

export type SignupInput = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "M" | "F";
  email: string;
  password: string;
  insurance: string[];
};

export async function signup(input: SignupInput) {
  const body = {
    agreement: true,
    user: {
      search_index: {
        data: {
          source_type: "patient",
          insurance_list: {
            data: input.insurance.map((insurance) => ({
              insurance_id: insurance,
            })),
          },
        },
      },
      first_name: input.firstName,
      last_name: input.lastName,
      avatar: "",
      email: input.email,
      password: input.password,
      phone: "",
      bio: "",
      gender: input.gender,
      birthday: input.dateOfBirth,
      properties: {
        email_notifications: false,
        push_notifications: false,
        notification_reminder: 1,
      },
    },
  };

  const response = await post("signup", body);

  return response;
}
