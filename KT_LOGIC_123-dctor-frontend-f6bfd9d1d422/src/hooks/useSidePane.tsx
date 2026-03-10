"use client";

import { SidePane } from "@/components/SidePane";
import {
  PropsWithChildren,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

type SidePaneOutput = {
  open: (args: ReactNode, title?: string) => void;
  close: () => void;
};

type NodeObject = {
  node: ReactNode;
  title?: string;
};

const SidePaneContext = createContext<SidePaneOutput>({
  open: () => {},
  close: () => {},
});

export function SidePaneProvider({ children }: PropsWithChildren) {
  const [currentNode, setCurrentNode] = useState<NodeObject | null>(null);

  const open = useCallback((node: ReactNode, title?: string) => {
    setCurrentNode({ node, title });
  }, []);

  function handleClose() {
    setCurrentNode(null);
  }

  return (
    <SidePaneContext.Provider value={{ open, close: handleClose }}>
      {children}
      {currentNode && (
        <SidePane onClose={handleClose} title={currentNode.title}>
          {currentNode.node}
        </SidePane>
      )}
    </SidePaneContext.Provider>
  );
}

export function useSidePane() {
  return useContext(SidePaneContext);
}
