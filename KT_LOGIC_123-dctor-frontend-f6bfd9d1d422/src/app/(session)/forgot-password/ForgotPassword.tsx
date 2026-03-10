"use client";

import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

import classNames from "classnames";
import { useRef, useState } from "react";
import OtpInput from "react-otp-input";
import sessionStyles from "../style.module.css";
import styles from "./style.module.css";

type EmailInputProps = {
  formData: FormData;
};

function EmailInput({ formData }: EmailInputProps) {
  return (
    <>
      <div className={sessionStyles["title-container"]}>
        <BackButton href="/login" loadingOnFormSubmit />
        <h1>Forgot password</h1>
      </div>
      <p className={sessionStyles["description"]}>
        Please enter your email address.
      </p>
      <div className={styles["input-container"]}>
        <Input
          name="email"
          type="email"
          placeholder="Email Address"
          full
          required
          defaultValue={formData.get("email") as string}
        />
      </div>

      <div className={sessionStyles["cta-container"]}>
        <Button
          type="submit"
          variant="primary"
          size="large"
          full
          loadingText="Resetting your password"
        >
          Verify
        </Button>
      </div>
    </>
  );
}

type OTPInputProps = {
  error: string | null;
  onBack: () => void;
};

function OTPInput({ error, onBack }: OTPInputProps) {
  const [otp, setOtp] = useState("");

  function handleSubmitOtp() {
    if ("forgot-password-form" in document) {
      (document["forgot-password-form"] as HTMLFormElement).requestSubmit();
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
      <div className={styles["input-container"]}>
        <OtpInput
          value={otp}
          onChange={handleOtpChange}
          numInputs={6}
          renderInput={(props) => (
            <Input {...props} wrapperClassName={styles["otp-input-wrapper"]} />
          )}
          containerStyle={{ justifyContent: "space-between" }}
        />
      </div>
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
          loadingText="Resetting your password"
          onClick={handleSubmitOtp}
        >
          Verify
        </Button>
      </div>
    </>
  );
}

type PasswordInputProps = {
  onBack: () => void;
  error: string | null;
};

function PasswordInput({ error, onBack }: PasswordInputProps) {
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
          Please enter your new password.
        </p>
        <Input
          name="password"
          type="password"
          placeholder="New Password"
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

export function ForgotPassword() {
  const [error, setError] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(1);

  const formData = useRef(new FormData());

  function handleNext(_formData: FormData) {
    _formData.forEach((__, key) => {
      formData.current.delete(key);
    });

    _formData.forEach((value, key) => {
      formData.current.append(key, value);
    });

    if (currentStepIndex === 0) {
      // @TODO: api call
      console.log("request for OTP");
    }

    if (currentStepIndex === 1) {
      // @TODO: api call
      console.log("verify otp");
    }

    if (currentStepIndex === 2) {
      const password = formData.current.get("password") as string;
      const confirmPassword = formData.current.get("confirmPassword") as string;

      if (password !== confirmPassword) {
        setError("Passwords do not match.");

        return;
      }
      // @TODO: api call

      console.log({
        email: formData.current.get("email"),
        password: formData.current.get("password"),
      });

      return;
    }

    setCurrentStepIndex((currentStepIndex) => currentStepIndex + 1);
    setError(null);
  }

  function handleBack() {
    setCurrentStepIndex((currentStepIndex) => currentStepIndex - 1);
    setError(null);
  }

  return (
    <form name="forgot-password-form" action={handleNext}>
      <div className={classNames(sessionStyles.container, "white-box")}>
        {currentStepIndex === 0 && <EmailInput formData={formData.current} />}
        {currentStepIndex === 1 && (
          <OTPInput error={error} onBack={handleBack} />
        )}
        {currentStepIndex === 2 && (
          <PasswordInput error={error} onBack={handleBack} />
        )}
      </div>
    </form>
  );
}
