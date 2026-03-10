"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { InputField } from "@/components/InputField";
import { Page } from "@/components/Page";
import { SectionHeader } from "@/components/SectionHeader";
import { useRouter } from "next/navigation";

import { requestOtp } from "@/backendServer/otp";
import { usePrompt } from "@/hooks/usePrompt";
import { WarningIcon } from "@/icons/warning";
import classNames from "classnames";
import styles from "./../../style.module.css";

export default function EditEmailPage({
  params,
}: {
  params: { userId: string };
}) {
  const router = useRouter();
  const { prompt } = usePrompt();

  async function handleSubmit(formData: FormData) {
    const email = formData.get("email") as string;

    const response = await requestOtp(email, "email-update");

    if ("error" in response) {
      prompt({
        icon: <WarningIcon />,
        message: "Something wrong happened.",
      });

      return;
    }

    router.push(`/settings/${params.userId}/edit/email/otp/${email}`);
  }

  return (
    <Page title="Settings">
      <form action={handleSubmit}>
        <div className="white-box container">
          <div className="two-column">
            <div>
              <SectionHeader backUrl={`/settings/${params.userId}`}>
                Edit Email
              </SectionHeader>
              <InputField label="Enter your new email">
                <Input type="email" name="email" required />
              </InputField>
            </div>
          </div>

          <div className={classNames(styles["action-row"], "flex-end")}>
            <Button variant="primary" type="submit" size="large">
              Next
            </Button>
          </div>
        </div>
      </form>
    </Page>
  );
}
