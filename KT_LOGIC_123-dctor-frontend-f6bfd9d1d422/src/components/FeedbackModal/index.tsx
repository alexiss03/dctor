import { ReactNode } from "react";
import { Modal, ModalProps } from "../Modal";

import styles from "./style.module.css";

export type FeedbackModalProps = {
  icon?: ReactNode;
  message: ReactNode;
  description?: ReactNode;
  onClose: () => void;
  actions?: ModalProps["actions"];
};

export function FeedbackModal({
  icon,
  message,
  description,
  onClose,
  actions,
}: FeedbackModalProps) {
  return (
    <Modal onClose={onClose} actions={actions}>
      <div className={styles.wrapper}>
        {icon && <div>{icon}</div>}
        <div className={styles.message}>{message}</div>
        {description && <div className={styles.description}>{description}</div>}
      </div>
    </Modal>
  );
}
