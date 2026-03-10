"use client";

import { PromptProvider } from "@/hooks/usePrompt";
import { SidePaneProvider } from "@/hooks/useSidePane";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";

export function ClientProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <PromptProvider>
        <SidePaneProvider>{children}</SidePaneProvider>
      </PromptProvider>
    </QueryClientProvider>
  );
}
