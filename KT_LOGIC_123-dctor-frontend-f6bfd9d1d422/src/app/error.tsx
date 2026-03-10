"use client";

import { Button } from "@/components/Button";
import { useEffect } from "react";

import styles from "./style.module.css";

export default function Error({
  error: e,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // @TODO: Log the error to an error reporting service
    console.error(e);
  }, [e]);

  return (
    <div className={styles["error-page-wrapper"]}>
      <h2>An unexpected error has occurred.</h2>
      <p>{e.message}</p>
      <Button variant="primary" size="large" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
