"use client";

import { Button } from "@/components/Button";
import { Page } from "@/components/Page";
import { DoctorProfile } from "@/types/healthcare";
import { SectionHeader } from "../../../../../../../components/SectionHeader";

import { usePrompt } from "@/hooks/usePrompt";
import { SuccessCheckIcon } from "@/icons/successCheck";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { DoctorSection } from "../../DoctorSection";
import { useSettingsUser } from "../../Settings";
import styles from "../../style.module.css";

export default function EditDoctorSettingsPage({
  params,
}: {
  params: { userId: string };
}) {
  const router = useRouter();
  const { prompt } = usePrompt();

  const { data: user } = useSettingsUser(params.userId);

  function handleSubmit(formData: FormData) {
    const clinics = formData.getAll("clinics");
    const treatments = formData.getAll("treatments");

    // @TODO: compare differences

    // @TODO: api call
    console.log({ clinics, treatments });

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
            <DoctorSection user={user as DoctorProfile} edit />
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
