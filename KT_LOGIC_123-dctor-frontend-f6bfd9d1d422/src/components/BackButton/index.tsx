"use client";

import { IconButton } from "@/components/IconButton";
import { BackIcon } from "@/icons/back";
import { useRouter } from "next/navigation";

import { experimental_useFormStatus as useFormStatus } from "react-dom";

type BackButtonProps = {
  href: string | -1; // use -1 for browser back
  loadingOnFormSubmit?: boolean;
  onClick?: () => void;
};

export function BackButton({
  href,
  loadingOnFormSubmit = false,
  onClick,
}: BackButtonProps) {
  const { pending } = useFormStatus();

  const router = useRouter();

  function handleBack() {
    if (href === -1) {
      router.back();
    } else {
      router.push(href);
    }
  }

  const isLoading = loadingOnFormSubmit && pending;

  return (
    <IconButton
      type="button"
      onClick={onClick ?? handleBack}
      disabled={isLoading}
    >
      <BackIcon />
    </IconButton>
  );
}
