"use client";

import { FeedbackModal, FeedbackModalProps } from "@/components/FeedbackModal";
import { SuccessCheckIcon } from "@/icons/successCheck";
import { WarningIcon } from "@/icons/warning";
import {
  PropsWithChildren,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

type PromptArgs = {
  icon?: ReactNode;
  message: ReactNode;
  description?: ReactNode;
  onClose?: () => void;
  actions?: FeedbackModalProps["actions"];
};

type PromptOutput = {
  prompt: (args: PromptArgs) => void;
  successPrompt: (message: string) => void;
  errorPrompt: (message?: string) => void;
  close: () => void;
};

const PromptContext = createContext<PromptOutput>({
  prompt: () => {},
  successPrompt: () => {},
  errorPrompt: () => {},
  close: () => {},
});

export function PromptProvider({ children }: PropsWithChildren) {
  const [promptQueue, setPromptQueue] = useState<PromptArgs[]>([]);

  const prompt = useCallback((props: PromptArgs) => {
    setPromptQueue((promptQueue) => [...promptQueue, props]);
  }, []);

  const errorPrompt = useCallback(
    (message?: string) => {
      return prompt({
        icon: <WarningIcon />,
        message: message ?? "Something wrong happened.",
      });
    },
    [prompt]
  );

  const successPrompt = useCallback(
    (message: string) => {
      return prompt({
        icon: <SuccessCheckIcon />,
        message,
      });
    },
    [prompt]
  );

  const handleClose = useCallback(() => {
    setPromptQueue((promptQueue) => promptQueue.slice(1, promptQueue.length));
  }, []);

  const currentPrompt = promptQueue[0];

  return (
    <PromptContext.Provider
      value={{ prompt, close: handleClose, successPrompt, errorPrompt }}
    >
      {children}
      {currentPrompt && (
        <FeedbackModal {...currentPrompt} onClose={handleClose} />
      )}
    </PromptContext.Provider>
  );
}

export function usePrompt() {
  return useContext(PromptContext);
}
