import { PropsWithChildren, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import styles from "./style.module.css";

type OverlayProps = {
  containerId: string;
};

export function Overlay({
  children,
  containerId,
}: PropsWithChildren<OverlayProps>) {
  const container = document.createElement("div");
  const wrapper = useRef(container);

  useEffect(() => {
    const current = wrapper.current as HTMLElement;

    current.setAttribute("id", containerId);
    document.body.appendChild(current);

    return () => {
      if (document.body.contains(current)) {
        document.body.removeChild(current);
      }
    };
  }, [containerId]);

  if (!wrapper.current) {
    return null;
  }

  return createPortal(
    <div className={styles.overlay}>{children}</div>,
    wrapper.current
  );
}
