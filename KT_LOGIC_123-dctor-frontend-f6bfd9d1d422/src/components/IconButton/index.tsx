import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

import classNames from "classnames";
import styles from "./style.module.css";

export function IconButton(
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  return (
    <button
      type="button"
      {...props}
      className={classNames(styles["icon-button"], props.className)}
    />
  );
}
