"use server";

import { post } from "@/backendServer";

export async function resetPassword(
  code: string,
  newPassword: string,
  username: string
) {
  const response = await post(`set-password`, {
    username,
    code,
    newPassword,
  });

  return response;
}
