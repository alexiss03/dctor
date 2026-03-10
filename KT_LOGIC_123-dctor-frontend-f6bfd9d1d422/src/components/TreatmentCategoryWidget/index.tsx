import { TreatmentCategory } from "@/types/healthcare";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import styles from "./style.module.css";

export type TreatmentCategoryWidgetProps = {
  category: TreatmentCategory;
};

export function TreatmentCategoryWidget({
  category,
}: TreatmentCategoryWidgetProps) {
  return (
    <Link
      href={`/search?q=&${new URLSearchParams(
        category.treatmentIds.map((id) => ["treatments", id])
      ).toString()}`}
    >
      <div
        className={classNames(styles.container, "white-box")}
        style={{ backgroundColor: category.backgroundColor }}
      >
        <div
          className={classNames(styles["icon-container"], {
            [styles["has-background"]]: category.cardType === "default",
          })}
        >
          <Image
            src={category.iconUrl}
            width={50}
            height={50}
            alt={category.name}
          />
        </div>
        <p
          className={styles.name}
          style={{
            color:
              category.backgroundColor === "#FFFFFF" ? "#4551FD" : "#FFFFFF",
          }}
        >
          {category.name}
        </p>
      </div>
    </Link>
  );
}
