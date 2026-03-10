"use client";

import { TreatmentCategory } from "@/types/healthcare";
import classNames from "classnames";
import Link from "next/link";
import { TreatmentCategoryWidget } from "../TreatmentCategoryWidget";
import styles from "./style.module.css";

type TreatmentSectionGroupProps = {
  name: string;
  description?: string;
  categories: TreatmentCategory[];
  sectionId: string;
  showViewAll?: boolean;
};

export function TreatmentSectionGroup({
  name,
  description,
  categories,
  sectionId,
  showViewAll = true,
}: TreatmentSectionGroupProps) {
  return (
    <section className={classNames(styles.wrapper, "section")}>
      <div className={styles.toprow}>
        <h2 className={styles.name}>{name}</h2>
        {showViewAll && (
          <Link href={`/treatment-sections/${sectionId}`}>View all</Link>
        )}
      </div>
      {description && <p className={styles.description}>{description}</p>}
      <div className={styles["widgets-container"]}>
        {categories.map((category) => (
          <TreatmentCategoryWidget key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
