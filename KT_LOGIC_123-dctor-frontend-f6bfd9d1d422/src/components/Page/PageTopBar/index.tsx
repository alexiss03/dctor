import { BackButton } from "@/components/BackButton";
import classNames from "classnames";
import { ReactNode } from "react";
import styles from "./style.module.css";

type PageTopBarProps = {
  title?: string;
  render?: ReactNode;
  backUrl?: string | -1;
};

export function PageTopBar({ title, render, backUrl }: PageTopBarProps) {
  return (
    <div className={classNames(styles.container, "white-box")}>
      {backUrl && <BackButton href={backUrl} />}
      {title && <h1>{title}</h1>}
      {render}
    </div>
  );
}
