"use server";

import { getCurrentUser } from "@/backendServer/user";

import {
  SignupInput,
  login as loginAPI,
  signup as signupAPI,
} from "@/backendServer/session";

export async function login(email: string, password: string) {
  try {
    const response = await loginAPI(email, password);

    if ("error" in response) {
      return null;
    }

    const user = await getCurrentUser();

    return user;
  } catch (e) {
    throw e;
  }
}

export async function signup(input: SignupInput) {
  const user = await signupAPI(input);

  return user;
}
