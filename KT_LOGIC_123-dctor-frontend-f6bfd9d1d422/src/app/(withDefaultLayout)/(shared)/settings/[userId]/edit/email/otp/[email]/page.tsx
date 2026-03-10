"use client";

import { editProfile } from "@/backendServer/user";
import { OTPForm } from "@/components/OTPForm";
import { Page } from "@/components/Page";

import { usePrompt } from "@/hooks/usePrompt";
import { SuccessCheckIcon } from "@/icons/successCheck";
import { WarningIcon } from "@/icons/warning";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSettingsUser } from "../../../../Settings";

export default function EmailOtpPage({
  params,
}: {
  params: { userId: string; email: string };
}) {
  const queryClient = useQueryClient();

  const email = decodeURIComponent(params.email);

  const { data: user } = useSettingsUser(params.userId);

  const router = useRouter();
  const { prompt } = usePrompt();

  if (!user) {
    return <Page />;
  }

  async function handleSuccess() {
    if (!user) {
      return;
    }

    const response = await editProfile(user.id, {
      email,
    });

    if ("error" in response) {
      prompt({
        icon: <WarningIcon />,
        message: "Something wrong happened.",
      });

      return;
    }

    if (params.userId === "self") {
      await queryClient.invalidateQueries(["currentUser"]);
    }

    await queryClient.invalidateQueries(["profile", params.userId]);

    router.push(`/settings/${params.userId}`);

    prompt({
      icon: <SuccessCheckIcon />,
      message: "Change email successful!",
    });
  }

  return (
    <Page title="Settings">
      <div className="white-box container">
        <OTPForm
          email={email}
          backUrl={`/settings/${user.id}/edit/email`}
          purpose="email-update"
          onSuccess={handleSuccess}
        />
      </div>
    </Page>
  );
}
