"use client";

import { InputField } from "@/components/InputField";
import { InputLabel } from "@/components/InputLabel";
import { Option, Select } from "@/components/Select";
import { useState } from "react";
import BaseSwitch from "react-switch";

import {
  changeNotificationSettings,
  getCurrentUser,
} from "@/backendServer/user";
import { PatientProfile } from "@/types/patient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./style.module.css";

type SwitchProps = {
  checked: boolean;
  onChange: () => void;
};

function Switch({ checked, onChange }: SwitchProps) {
  return (
    <BaseSwitch
      onChange={onChange}
      checked={checked}
      onColor="#4551FD"
      onHandleColor="#ffffff"
      handleDiameter={20}
      uncheckedIcon={false}
      checkedIcon={false}
      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
      activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
      height={20}
      width={38}
    />
  );
}

export default function Notification() {
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery(["currentUser"], {
    queryFn: () =>
      getCurrentUser().then((response) => response.data as PatientProfile),
  });

  const [enablePush, setEnablePush] = useState<boolean>(
    currentUser?.isPushNotificationsEnabled ?? false
  );
  const [enableEmail, setEnableEmail] = useState<boolean>(
    currentUser?.isEmailNotificationsEnabled ?? false
  );

  const notifyInOptions: Option[] = Array.from(new Array(7)).map((__, i) => ({
    value: `${i + 1}`,
    label: `${i + 1} day${i + 1 !== 1 ? "s" : ""}`,
  }));

  const notifyInDefaultValue = {
    value: `${currentUser?.notifyAppointmentIn ?? 7}`,
    label: `${currentUser?.notifyAppointmentIn ?? 7} day${
      (currentUser?.notifyAppointmentIn ?? 7) !== 1 ? "s" : ""
    }`,
  };

  async function handleChange(
    type:
      | "notifyAppointmentIn"
      | "isPushNotificationsEnabled"
      | "isEmailNotificationsEnabled",
    option: Option | boolean
  ) {
    if (!currentUser) {
      return;
    }

    if (type === "isPushNotificationsEnabled" && typeof option === "boolean") {
      setEnablePush(option);
    }

    if (type === "isEmailNotificationsEnabled" && typeof option === "boolean") {
      setEnableEmail(option);
    }

    await changeNotificationSettings(currentUser.id, {
      notifyAppointmentIn:
        type === "notifyAppointmentIn"
          ? parseInt((option as Option).value)
          : currentUser.notifyAppointmentIn,
      isPushNotificationsEnabled:
        type === "isPushNotificationsEnabled"
          ? (option as boolean)
          : currentUser.isPushNotificationsEnabled,
      isEmailNotificationsEnabled:
        type === "isEmailNotificationsEnabled"
          ? (option as boolean)
          : currentUser.isEmailNotificationsEnabled,
    });

    queryClient.invalidateQueries(["currentUser"]);
  }

  return (
    <>
      <div className="white-box container">
        <h2>Appointment Notifications Settings</h2>
        <InputLabel>Notify Appointment in</InputLabel>
        <div style={{ width: "200px" }}>
          <Select
            options={notifyInOptions}
            defaultValue={notifyInDefaultValue}
            onChange={(option: unknown) =>
              handleChange("notifyAppointmentIn", option as Option)
            }
          />
        </div>
      </div>
      <div className="white-box container">
        <h2>Notification Settings</h2>
        <div className={styles["input-container"]}>
          <InputField label="Push Notifications">
            <Switch
              onChange={() => {
                handleChange("isPushNotificationsEnabled", !enablePush);
              }}
              checked={enablePush}
            />
          </InputField>
        </div>
        <hr />
        <div className={styles["input-container"]}>
          <InputField label="Email Notifications">
            <Switch
              onChange={() => {
                handleChange("isEmailNotificationsEnabled", !enableEmail);
              }}
              checked={enableEmail}
            />
          </InputField>
        </div>
      </div>
    </>
  );
}
