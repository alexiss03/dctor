"use client";

import classNames from "classnames";
import { PropsWithChildren } from "react";
import { useKey } from "react-use";

import { Overlay } from "../Overlay";

import { BackIcon } from "@/icons/back";
import { IconButton } from "../IconButton";
import styles from "./style.module.css";

type SidePaneProps = {
  title?: string;
  onClose: () => void;
};

export function SidePane({
  title,
  children,
  onClose,
}: PropsWithChildren<SidePaneProps>) {
  useKey("Escape", onClose);

  return (
    <Overlay containerId="sidepane-container">
      <div className={classNames(styles["sidepane-container"], "white-box")}>
        {title && (
          <div className={classNames(styles["top-bar"], "section")}>
            <div className={styles["back-button-container"]}>
              <IconButton type="button" onClick={onClose}>
                <BackIcon />
              </IconButton>
            </div>
            <h2 className={styles.title}>{title}</h2>
          </div>
        )}
        <div className={styles["content-container"]}>{children}</div>
      </div>
    </Overlay>
  );
}
