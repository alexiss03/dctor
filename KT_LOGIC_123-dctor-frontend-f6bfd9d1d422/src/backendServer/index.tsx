"use server";

import { fetchWithAuth } from "./fetchWithAuth";

export type ErrorResponse = {
  error: {
    statusCode: number;
    name: string;
    message: string;
  };
};

export type SuccessfulResponse<T> = {
  data: T;
};

const DEFAULT_API_URL = "http://127.0.0.1:3000/api";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function getApiBaseUrl(): string {
  const configuredApiUrl = process.env.API_URL?.trim();
  if (configuredApiUrl) {
    return trimTrailingSlash(configuredApiUrl);
  }

  const configuredApiHostPort = process.env.API_HOSTPORT?.trim();
  if (configuredApiHostPort) {
    const normalizedHostPort = trimTrailingSlash(configuredApiHostPort);

    if (/^https?:\/\//i.test(normalizedHostPort)) {
      return normalizedHostPort.endsWith("/api")
        ? normalizedHostPort
        : `${normalizedHostPort}/api`;
    }

    return `http://${normalizedHostPort}/api`;
  }

  return DEFAULT_API_URL;
}

const apiBaseUrl = getApiBaseUrl();

function buildErrorResponse(
  statusCode: number,
  name: string,
  message: string
): ErrorResponse {
  return {
    error: {
      statusCode,
      name,
      message,
    },
  };
}

async function safeReadJson(response: Response): Promise<unknown> {
  const payload = await response.text();
  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export async function get<T>(
  url: string,
  searchParams?: Record<string, string> | URLSearchParams
): Promise<SuccessfulResponse<T> | ErrorResponse> {
  const searchParamsObject = new URLSearchParams(searchParams);

  const searchParamsString = searchParamsObject.toString()
    ? `?${searchParamsObject.toString()}`
    : "";

  try {
    const response = await fetchWithAuth(
      `${apiBaseUrl}/${url}${searchParamsString}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const responseData = (await safeReadJson(response)) as
      | { error?: { name?: string; message?: string } }
      | T
      | null;

    if (!response.ok) {
      return buildErrorResponse(
        response.status,
        responseData &&
          typeof responseData === "object" &&
          "error" in responseData
          ? responseData.error?.name ?? "UnknownError"
          : "UnknownError",
        responseData &&
          typeof responseData === "object" &&
          "error" in responseData
          ? responseData.error?.message ?? "An unknown error has occurred."
          : "An unknown error has occurred."
      );
    }

    return { data: (responseData ?? ({} as T)) as T };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to reach backend service.";

    return buildErrorResponse(503, "BackendUnavailable", message);
  }
}

async function update<T>(
  url: string,
  data: Record<string, unknown> | undefined,
  auth: boolean = true,
  headers: Record<string, string> = {},
  method: string
): Promise<SuccessfulResponse<T> | ErrorResponse> {
  const requestFn = auth ? fetchWithAuth : fetch;

  try {
    const response = await requestFn(`${apiBaseUrl}/${url}`, {
      method,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      cache: "no-store",
    });

    const responseData = (await safeReadJson(response)) as
      | { error?: { name?: string; message?: string } }
      | T
      | null;

    if (!response.ok) {
      return buildErrorResponse(
        response.status,
        responseData &&
          typeof responseData === "object" &&
          "error" in responseData
          ? responseData.error?.name ?? "UnknownError"
          : "UnknownError",
        responseData &&
          typeof responseData === "object" &&
          "error" in responseData
          ? responseData.error?.message ?? "An unknown error has occurred."
          : "An unknown error has occurred."
      );
    }

    return { data: (responseData ?? ({} as T)) as T };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to reach backend service.";

    return buildErrorResponse(503, "BackendUnavailable", message);
  }
}

export async function post<T>(
  url: string,
  data?: Record<string, unknown>,
  auth = true,
  headers: Record<string, string> = {}
): Promise<SuccessfulResponse<T> | ErrorResponse> {
  return update<T>(url, data, auth, headers, "POST");
}

export async function patch<T>(
  url: string,
  data?: Record<string, unknown>,
  auth = true,
  headers: Record<string, string> = {}
) {
  return update<T>(url, data, auth, headers, "PATCH");
}
