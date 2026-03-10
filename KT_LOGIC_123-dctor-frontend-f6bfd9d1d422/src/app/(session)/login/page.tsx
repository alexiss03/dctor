"use client";

import classNames from "classnames";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import Image from "next/image";

import { Link } from "@/components/Link";
import { useState } from "react";
import { login } from "../actions";
import sessionStyles from "../style.module.css";
import styles from "./style.module.css";

const DEMO_USERNAME = "seed.patient.local@example.com";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const user = await login(email, password);

      if (!user) {
        setError("Username or password is incorrect.");

        return;
      }

      window.location.href = "/dashboard";
    } catch (e: unknown) {
      setError(
        e && typeof e === "object" && "message" in e
          ? (e.message as string)
          : "An unknown error has occurred."
      );
    }
  }

  return (
    <form action={handleLogin}>
      <div className={classNames(sessionStyles.container, "white-box")}>
        <div
          className={classNames(
            styles["logo-container"],
            sessionStyles["input-container"]
          )}
        >
          <Image
            className={styles.logo}
            src="/logo.svg"
            width={219}
            height={87}
            alt="Dctor Logo"
            priority
          />
        </div>
        <div>
          <Input
            name="email"
            type="email"
            placeholder="Email"
            defaultValue={DEMO_USERNAME}
            required
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            required
          />
        </div>
        {error && <div className="error-text">{error}</div>}
        <div className={styles["recovery-container"]}>
          <Link href="/forgot-password" loadingOnFormSubmit>
            Forgot password?
          </Link>
        </div>
        <div className={sessionStyles["cta-container"]}>
          <Button
            type="submit"
            variant="primary"
            size="large"
            full
            loadingOnFormSubmit
            loadingText="Logging in"
          >
            Login
          </Button>
        </div>
        <div>
          <p className={sessionStyles["small-text"]}>
            {`Don't have an account yet? `}
            <Link href="/signup" loadingOnFormSubmit>
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
}
