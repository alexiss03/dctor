"use server";

import { post } from "@/backendServer";
import { cookies } from "next/headers";

export async function logout() {
  const response = await post("logout");

  if ("error" in response) {
    return response;
  }

  const nextCookies = cookies();

  nextCookies.delete("Authorization");

  return response;
}
