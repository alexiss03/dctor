"use client";

import { EditProfileOptions, editProfile } from "@/backendServer/user";
import { Button } from "@/components/Button";
import { Page } from "@/components/Page";
import { useQueryClient } from "@tanstack/react-query";
import { SectionHeader } from "../../../../../../../components/SectionHeader";
import { AccountSection } from "../../AccountSection";

import { usePrompt } from "@/hooks/usePrompt";
import { SuccessCheckIcon } from "@/icons/successCheck";
import { WarningIcon } from "@/icons/warning";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useSettingsUser } from "../../Settings";
import styles from "../../style.module.css";

export default function EditAccountSettingsPage({
  params,
}: {
  params: { userId: string };
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { prompt } = usePrompt();

  const { data: user } = useSettingsUser(params.userId);

  async function handleSubmit(formData: FormData) {
    if (!user) {
      return;
    }

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const birthday = formData.get("birthday") as string;
    const gender = formData.get("gender") as string;
    // const photo = formData.get("photo") as string;
    // const insurance = formData.get("insurance") as string;

    const newFormData: EditProfileOptions = {};

    if ("firstName" in user && user.firstName !== firstName) {
      newFormData.firstName = firstName;
    }

    if ("lastName" in user && user.lastName !== lastName) {
      newFormData.lastName = lastName;
    }

    if ("firstName" in user) {
      if (newFormData.firstName || newFormData.lastName) {
        newFormData.name = `${newFormData.firstName ?? user.firstName} ${
          newFormData.lastName ?? user.lastName
        }`;
      }
    }

    if ("birthday" in user && user.birthday !== birthday) {
      newFormData.birthday = birthday;
    }

    if ("gender" in user && user.gender !== gender) {
      newFormData.gender = gender;
    }

    // @TODO: photo
    // @TODO: insurance

    const result = await editProfile(user.id, newFormData);

    if ("error" in result) {
      prompt({
        icon: <WarningIcon />,
        message: "Something wrong happened.",
      });

      return;
    }

    queryClient.invalidateQueries(["currentUser"]);

    router.push(`/settings/${params.userId}`);

    prompt({
      icon: <SuccessCheckIcon />,
      message: "Change profile successful!",
    });
  }

  return (
    <Page title="Settings">
      <form action={handleSubmit}>
        {user && (
          <div className="white-box container">
            <SectionHeader backUrl={`/settings/${params.userId}`}>
              Edit Account Settings
            </SectionHeader>
            <AccountSection user={user} edit />
            <div className={classNames(styles["action-row"], "flex-end")}>
              <Button variant="primary" type="submit" size="large">
                Save
              </Button>
            </div>
          </div>
        )}
      </form>
    </Page>
  );
}
