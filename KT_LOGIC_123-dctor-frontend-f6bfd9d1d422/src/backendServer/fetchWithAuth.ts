"use server";

import { cookies } from "next/headers";

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) {
  const nextCookies = cookies();

  const authorization = nextCookies.get("Authorization")?.value;

  return fetch(input, {
    ...(init || {}),
    headers: {
      ...(init?.headers || {}),
      ...(authorization ? { Authorization: authorization } : {}),
    },
  });
}
