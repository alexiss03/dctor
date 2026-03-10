"use client";

import classNames from "classnames";
import { ComponentProps, PropsWithChildren } from "react";
import { useKey } from "react-use";

import { Button } from "../Button";
import { Overlay } from "../Overlay";

import styles from "./style.module.css";

export type ModalProps = {
  actions?: (ComponentProps<typeof Button> & { key: string })[];
  onClose: () => void;
};

export function Modal({
  children,
  actions,
  onClose,
}: PropsWithChildren<ModalProps>) {
  useKey("Escape", onClose);

  const actionsToRender: typeof actions = actions
    ? actions.map((action) => ({
        ...action,
        full: true,
        size: "large",
        style: { maxWidth: "275px" },
      }))
    : [
        {
          key: "ok",
          children: "Okay",
          variant: "primary",
          onClick: onClose,
          full: true,
          size: "large",
          style: {
            maxWidth: "275px",
          },
        },
      ];

  return (
    <Overlay containerId="prompt-container">
      <div className={classNames(styles["modal-container"], "white-box")}>
        {children}
        <div className={styles["actions-container"]}>
          {actionsToRender.map((action) => (
            <Button {...action} key={action.key} />
          ))}
        </div>
      </div>
    </Overlay>
  );
}
