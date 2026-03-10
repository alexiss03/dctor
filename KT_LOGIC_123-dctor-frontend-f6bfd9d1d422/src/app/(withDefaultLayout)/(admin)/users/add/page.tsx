"use client";

import { Page } from "@/components/Page";
import classNames from "classnames";

import { getClinics, getTreatments } from "@/backendServer/healthcare";
import { getInsurances } from "@/backendServer/insurance";
import { Button } from "@/components/Button";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import styles from "./style.module.css";

type AccountTypeButtonProps = {
  image: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
};

function AccountTypeButton({
  image,
  label,
  active,
  onClick,
}: AccountTypeButtonProps) {
  return (
    <Button
      className={classNames(styles["account-type-button"], "white-box", {
        [styles.active]: active,
      })}
      variant="clear"
      onClick={onClick}
    >
      <div className={styles["button-image-wrapper"]}>{image}</div>
      <p>{label}</p>
    </Button>
  );
}

export default function AddUsers() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedType, setSelectedType] = useState<"doctor" | "clinic" | null>(
    null
  );

  function handleNext() {
    if (selectedType === "doctor") {
      router.push("/doctors/add");
    } else {
      router.push("/clinics/add");
    }
  }

  function prefetchData() {
    queryClient.prefetchQuery(["clinics"], {
      queryFn: () =>
        getClinics().then((response) =>
          "error" in response ? [] : response.data
        ),
    });
    queryClient.prefetchQuery(["insurances"], {
      queryFn: () =>
        getInsurances().then((response) =>
          "error" in response ? [] : response.data
        ),
    });
    queryClient.prefetchQuery(["treatments"], {
      queryFn: () =>
        getTreatments().then((response) =>
          "error" in response ? [] : response.data
        ),
    });
  }

  useEffect(prefetchData, [queryClient]);

  return (
    <Page title="Add New Account">
      <div className={classNames(styles.container, "white-box")}>
        <h1>Choose account type</h1>
        <div className={styles["content-container"]}>
          <div className={classNames(styles["buttons-container"], "section")}>
            <AccountTypeButton
              image={<Image src="/clinic.png" width={96} height={109} alt="" />}
              label="Clinic"
              active={selectedType === "clinic"}
              onClick={() => setSelectedType("clinic")}
            />
            <AccountTypeButton
              image={<Image src="/doctor.png" width={86} height={136} alt="" />}
              label="Doctor"
              active={selectedType === "doctor"}
              onClick={() => setSelectedType("doctor")}
            />
          </div>
          <Button
            variant="primary"
            size="large"
            disabled={!selectedType}
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </div>
    </Page>
  );
}
