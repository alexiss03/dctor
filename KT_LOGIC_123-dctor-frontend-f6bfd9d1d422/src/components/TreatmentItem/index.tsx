import { HealthcareTreatment } from "@/types/healthcare";
import Image from "next/image";
import styles from "./style.module.css";

const treatmentIconMap: Record<string, string> = {
  cardiology: "/categories/heart-no-bg.png",
  pediatrics: "/categories/pedia-no-bg.png",
};

type TreatmentItemProps = {
  treatment: HealthcareTreatment;
};

export function TreatmentItem({ treatment }: TreatmentItemProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles["icon-name-container"]}>
        <div className={styles["icon-container"]}>
          {treatmentIconMap[treatment.id] && (
            <Image
              src={treatmentIconMap[treatment.id]}
              width={25}
              height={25}
              alt={treatment.name}
            />
          )}
        </div>
        <div>{treatment.name}</div>
      </div>
      <div>
        <strong>$USD {formatCurrency(treatment.price)}</strong>
      </div>
    </div>
  );
}

function formatCurrency(value: number): string {
  return value.toFixed(2);
}
