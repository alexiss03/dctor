"use client";

import classNames from "classnames";

import { IconButton } from "@/components/IconButton";
import { BackIcon } from "@/icons/back";

import { useAddUser } from "./AddUserContext";
import styles from "./style.module.css";

export function AddUser() {
  const [{ currentStepIndex, currentStep }, { back }] = useAddUser();

  return (
    <div className={classNames(styles.container, "white-box")}>
      <div className={styles["input-fields-container"]}>
        <div className={styles["title-container"]}>
          {currentStepIndex > 0 && (
            <IconButton onClick={back}>
              <BackIcon />
            </IconButton>
          )}
          <h1>{currentStep.title}</h1>
        </div>
        {currentStep.render}
      </div>
    </div>
  );
}
