import { HealthcareField } from "@/components/HealthcareField";
import { DoctorProfile } from "@/types/healthcare";
import styles from "./style.module.css";

type DoctorSectionProps = {
  user: DoctorProfile;
  edit?: boolean;
};

export function DoctorSection({ user, edit }: DoctorSectionProps) {
  return (
    <>
      <div className={styles["top-fields-container"]}>
        <div className={styles["fields-container"]}>
          <HealthcareField data={user} field="clinics" label edit={edit} />
          <HealthcareField data={user} field="category" label edit={edit} />
        </div>
      </div>
    </>
  );
}
