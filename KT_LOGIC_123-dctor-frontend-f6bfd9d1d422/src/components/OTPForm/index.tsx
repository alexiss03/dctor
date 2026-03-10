"use client";

import Link from "next/link";
import { Input } from "../Input";
import { SectionHeader } from "../SectionHeader";

import { OtpPurpose, verifyOtp } from "@/backendServer/otp";
import { usePrompt } from "@/hooks/usePrompt";
import { WarningIcon } from "@/icons/warning";
import { Button } from "../Button";
import style from "./style.module.css";

type OTPFormProps = {
  email: string;
  backUrl: string;
  purpose: OtpPurpose;
  onSuccess: () => void;
  full?: boolean;
};

export function OTPForm({
  email,
  backUrl,
  purpose,
  onSuccess,
  full = false,
}: OTPFormProps) {
  const { prompt } = usePrompt();

  async function handleSubmit(formData: FormData) {
    const code = formData.get("code") as string;

    const response = await verifyOtp(email, purpose, code);

    if ("error" in response) {
      const message =
        response.error.statusCode === 422
          ? "Invalid code"
          : "An error has occurred";

      prompt({
        icon: <WarningIcon />,
        message,
        description: "Please try again.",
      });

      return;
    }

    onSuccess();
  }

  return (
    <form action={handleSubmit}>
      <div
        className={full ? "" : "two-column"}
        style={{ marginBottom: "2rem" }}
      >
        <div>
          <SectionHeader backUrl={backUrl}>Edit Email</SectionHeader>
          <p>
            <strong>
              Please enter the 6-digit code sent to your email address.
            </strong>
          </p>
          <Input type="text" name="code" required />
          <p className={style["resend-text"]}>
            Didn{"'"}t receive a code?{" "}
            <Link href="#" style={{ marginLeft: "0.5rem" }}>
              Resend
            </Link>
          </p>
        </div>
      </div>

      <div className={"flex-end"}>
        <Button variant="primary" type="submit" size="large">
          Submit
        </Button>
      </div>
    </form>
  );
}
