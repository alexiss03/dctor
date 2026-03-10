import { ReactNode } from "react";

import Image from "next/image";
import styles from "./style.module.css";

type SessionLayoutProps = {
  children: ReactNode;
};

export default function SessionLayout({ children }: SessionLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles["background-container"]}>
        <Image src="/background/pattern.png" width={1715} height={857} alt="" />
        <Image
          className={styles["background-doctor"]}
          src="/background/doctor.svg"
          width={618}
          height={445}
          alt=""
          priority
        />
        <Image
          className={styles["background-stethoscope"]}
          src="/background/stethoscope.png"
          width={378}
          height={378}
          alt=""
        />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
