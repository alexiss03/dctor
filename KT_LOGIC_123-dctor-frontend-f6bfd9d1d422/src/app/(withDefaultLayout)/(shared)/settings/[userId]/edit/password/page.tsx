"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { InputField } from "@/components/InputField";
import { Page } from "@/components/Page";
import { usePrompt } from "@/hooks/usePrompt";
import { SuccessCheckIcon } from "@/icons/successCheck";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { SectionHeader } from "../../../../../../../components/SectionHeader";

import { changePassword } from "@/backendServer/user";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { WarningIcon } from "@/icons/warning";
import { DoctorProfile } from "@/types/healthcare";
import { PatientProfile } from "@/types/patient";
import styles from "../../style.module.css";

export default function EditPasswordPage() {
  const router = useRouter();
  const { prompt, errorPrompt } = usePrompt();

  const { data: user } = useCurrentUser<DoctorProfile | PatientProfile>();

  async function handleSubmit(formData: FormData) {
    if (!user) {
      return;
    }

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      errorPrompt("Passwords do not match.");

      return;
    }

    const response = await changePassword(
      user.id,
      currentPassword,
      newPassword
    );

    if ("error" in response) {
      prompt({
        icon: <WarningIcon />,
        message: response.error.message,
      });

      return;
    }

    router.push("/settings/self");

    prompt({
      icon: <SuccessCheckIcon />,
      message: "Change password successful!",
    });
  }

  return (
    <Page title="Settings">
      <form action={handleSubmit}>
        <div className="white-box container">
          <div className="two-column">
            <div>
              <SectionHeader backUrl="/settings/self">
                Edit Password
              </SectionHeader>
              <InputField label="Current Password">
                <Input type="password" name="currentPassword" required />
              </InputField>
              <InputField label="New Password">
                <Input type="password" name="newPassword" required />
              </InputField>
              <InputField label="Confirm Password">
                <Input type="password" name="confirmPassword" required />
              </InputField>
            </div>
          </div>

          <div className={classNames(styles["action-row"], "flex-end")}>
            <Button variant="primary" type="submit" size="large">
              Save
            </Button>
          </div>
        </div>
      </form>
    </Page>
  );
}
