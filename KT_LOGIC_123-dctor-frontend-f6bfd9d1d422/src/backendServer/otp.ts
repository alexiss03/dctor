import { post } from ".";

export type OtpPurpose = "signup" | "forget" | "email-update";

export async function requestOtp(email: string, purpose: OtpPurpose) {
  const response = await post<Record<string, string>>(
    "send-verification-code",
    {
      dest: email,
      code: "",
      method: purpose,
    }
  );

  return response;
}

export async function verifyOtp(
  email: string,
  purpose: OtpPurpose,
  code: string
) {
  const response = await post<Record<string, string>>(
    "send-verification-code",
    {
      dest: email,
      code,
      method: purpose,
    }
  );

  return response;
}
