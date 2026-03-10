import classNames from "classnames";
import Image from "next/image";

import styles from "./style.module.css";

type EmptyResultsProps = {
  withPadding?: boolean;
};

export function EmptyResults({ withPadding }: EmptyResultsProps) {
  return (
    <div
      className={classNames(styles.container, {
        [styles["with-padding"]]: withPadding,
      })}
    >
      <Image src="/empty-results.png" width={302} height={302} alt="" />
      <p className={styles.text}>No Result Found</p>
    </div>
  );
}
