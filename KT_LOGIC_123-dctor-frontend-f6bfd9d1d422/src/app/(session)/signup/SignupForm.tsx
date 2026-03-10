"use client";

import { Input } from "@/components/Input";

import { requestOtp, verifyOtp } from "@/backendServer/otp";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/Button";
import { ButtonSelect } from "@/components/ButtonSelect";
import { DatePicker } from "@/components/DatePicker";
import { OtpInput } from "@/components/OTPInput";
import { Select } from "@/components/Select";
import { Insurance } from "@/types/insurance";
import classNames from "classnames";
import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useRef, useState } from "react";
import { login, signup } from "../actions";
import sessionStyles from "../style.module.css";
import styles from "./style.module.css";

type MainFormProps = {
  error: string | null;
  insurances: Insurance[];
  formData: FormData;
};

function MainForm({ error, insurances, formData }: MainFormProps) {
  const dateOfBirth = formData.get("dateOfBirth") as string | null;

  return (
    <>
      <div className={sessionStyles["title-container"]}>
        <BackButton href="/login" loadingOnFormSubmit />
        <h1>Sign up</h1>
      </div>
      <div className={sessionStyles["input-container"]}>
        <Input
          name="firstName"
          type="text"
          placeholder="First Name"
          required
          full
          defaultValue={formData.get("firstName") as string}
        />
        <Input
          name="lastName"
          type="text"
          placeholder="Last Name"
          required
          full
          defaultValue={formData.get("lastName") as string}
        />
        <DatePicker
          name="dateOfBirth"
          placeholder="Date of Birth"
          full
          loadingOnFormSubmit
          initialValue={dateOfBirth ? new Date(dateOfBirth) : undefined}
          required
        />
        <ButtonSelect
          name="gender"
          label="Gender"
          loadingOnFormSubmit
          options={[
            {
              value: "M",
              text: "Male",
            },
            {
              value: "F",
              text: "Female",
            },
          ]}
          defaultValue={formData.get("gender") as string}
        ></ButtonSelect>
        <Select
          name="insurance"
          placeholder="Insurance"
          isMulti
          options={insurances.map((insurance) => ({
            value: insurance.id,
            label: insurance.name,
          }))}
          loadingOnFormSubmit
          defaultValue={
            formData.get("insurance")
              ? (formData.getAll("insurance") as string[]).map(
                  (insuranceId) => ({
                    value: insuranceId,
                    label: insurances.find(
                      (insurance) => insurance.id === insuranceId
                    )?.name,
                  })
                )
              : undefined
          }
        />
        <Input
          name="email"
          type="email"
          placeholder="Email Address"
          required
          full
          defaultValue={formData.get("email") as string}
        />
      </div>
      <div className={styles["checkbox-container"]}>
        <input
          name="agreement"
          type="checkbox"
          defaultChecked={formData.get("agreement") === "on"}
        />
        <p className={sessionStyles["small-text"]}>
          By signing up you are agreeing to our{" "}
          <Link href="/terms-of-service">Terms of Service</Link> and{" "}
          <Link href="/privacy-policy">Privacy Policy</Link>
        </p>
      </div>
      {error && <p className="error-text">{error}</p>}
      <div className={sessionStyles["cta-container"]}>
        <Button
          type="submit"
          variant="primary"
          size="large"
          full
          loadingOnFormSubmit
          loadingText="Creating your account"
        >
          Sign up
        </Button>
      </div>
    </>
  );
}

type PasswordFormProps = {
  onBack: () => void;
  error: string | null;
};

function PasswordForm({ error, onBack }: PasswordFormProps) {
  return (
    <>
      <div
        className={sessionStyles["title-container"]}
        style={{ marginBottom: "1rem" }}
      >
        <BackButton href="#" loadingOnFormSubmit onClick={onBack} />
        <h1>Set your password</h1>
      </div>
      <div className={sessionStyles["input-container"]}>
        <p className={sessionStyles["description"]}>
          Please enter your password to continue.
        </p>
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          full
        />
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          required
          full
        />
      </div>
      {error && <p className="error-text">{error}</p>}
      <div className={sessionStyles["cta-container"]}>
        <Button
          type="submit"
          variant="primary"
          size="large"
          full
          loadingOnFormSubmit
          loadingText="Creating your account"
        >
          Confirm Password
        </Button>
      </div>
    </>
  );
}

type OTPInputProps = {
  error: string | null;
  onBack: () => void;
};

function OTPInputForm({ error, onBack }: OTPInputProps) {
  const [otp, setOtp] = useState("");

  function handleSubmitOtp() {
    if ("signup-form" in document) {
      (document["signup-form"] as HTMLFormElement).requestSubmit();
    }
  }

  function handleOtpChange(newValue: string) {
    setOtp(newValue);

    if (newValue.length === 6) {
      handleSubmitOtp();
    }
  }

  function handleResend() {
    // @TODO: api call
    console.log("resend otp");
  }

  return (
    <>
      <div className={sessionStyles["title-container"]}>
        <BackButton href="#" loadingOnFormSubmit onClick={onBack} />
        <h1>Verify your email address</h1>
      </div>
      <p className={sessionStyles["description"]}>
        Please enter the 6-digit code sent to your email address.
      </p>
      <OtpInput value={otp} onChange={handleOtpChange} />
      <input name="code" type="hidden" value={otp} />
      {error && <p className="error-text">{error}</p>}
      <div className={sessionStyles["cta-container"]}>
        <p className={styles["resend-otp-text"]}>
          {`Didn’t receive a code?`}{" "}
          <a href="#" onClick={handleResend}>
            Resend
          </a>
        </p>
        <Button
          variant="primary"
          size="large"
          full
          loadingOnFormSubmit
          loadingText="Creating your account"
          onClick={handleSubmitOtp}
        >
          Verify
        </Button>
      </div>
    </>
  );
}

type SignupFormProps = {
  insurances: Insurance[];
};

export function SignupForm({ insurances }: SignupFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const formData = useRef(new FormData());

  async function handleSignup() {
    setError(null);

    const firstName = formData.current.get("firstName") as string;
    const lastName = formData.current.get("lastName") as string;
    const dateOfBirth = dayjs(
      formData.current.get("dateOfBirth") as string
    ).format("YYYY-MM-DD");
    const gender = formData.current.get("gender") as "M" | "F";
    const insurance = formData.current.getAll("insurance") as string[];
    const email = formData.current.get("email") as string;
    const password = formData.current.get("password") as string;
    const agreement = formData.current.get("agreement") as string;

    if (agreement !== "on") {
      setError("Please agree to the terms and conditions.");

      return;
    }

    if (!dayjs(dateOfBirth).isValid()) {
      setError("Date of Birth is not valid.");

      return;
    }

    const response = await signup({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      insurance,
      email,
      password,
    });

    if ("error" in response) {
      setError(response.error.message);

      return;
    }

    await login(email, password);

    redirect("/dashboard");
  }

  async function handleSubmit(_formData: FormData) {
    _formData.forEach((__, key) => {
      formData.current.delete(key);
    });

    _formData.forEach((value, key) => {
      formData.current.append(key, value);
    });

    // checkboxes to be handled separately
    if (currentStepIndex === 0 && !_formData.get("agreement")) {
      formData.current.delete("agreement");
    }

    // validations
    if (currentStepIndex === 0) {
      const agreement = formData.current.get("agreement") as string;
      const dateOfBirth = dayjs(
        formData.current.get("dateOfBirth") as string
      ).format("YYYY-MM-DD");

      if (agreement !== "on") {
        setError("Please agree to the terms and conditions.");

        return;
      }

      if (!dayjs(dateOfBirth).isValid()) {
        setError("Date of Birth is not valid.");

        return;
      }
    }

    if (currentStepIndex === 1) {
      const password = formData.current.get("password") as string;
      const confirmPassword = formData.current.get("confirmPassword") as string;

      if (password !== confirmPassword) {
        setError("Passwords do not match.");

        return;
      }
    }

    if (currentStepIndex === 2) {
      const email = formData.current.get("email") as string;
      const code = formData.current.get("code") as string;
      const response = await verifyOtp(email, "signup", code);
      if ("error" in response) {
        const message =
          response.error.statusCode === 422
            ? "Invalid code"
            : "An error has occurred";
        setError(message);
        return;
      }
    }

    // validation successful
    if (currentStepIndex === 1) {
      const email = formData.current.get("email") as string;
      const response = await requestOtp(email, "signup");
      if ("error" in response) {
        setError("Something wrong happened.");
        return;
      }
    }
    if (currentStepIndex === 2) {
      await handleSignup();
    } else {
      setCurrentStepIndex((currentStepIndex) => currentStepIndex + 1);
    }

    setError(null);
  }

  function handleBack() {
    setCurrentStepIndex((currentStepIndex) => currentStepIndex - 1);
  }

  return (
    <form name="signup-form" action={handleSubmit}>
      <div className={classNames(sessionStyles.container, "white-box")}>
        {currentStepIndex === 0 && (
          <MainForm
            insurances={insurances}
            error={error}
            formData={formData.current}
          />
        )}
        {currentStepIndex === 1 && (
          <PasswordForm onBack={handleBack} error={error} />
        )}
        {currentStepIndex === 2 && (
          <OTPInputForm error={error} onBack={handleBack} />
        )}
      </div>
    </form>
  );
}
