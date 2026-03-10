import { HealthcareField } from "@/components/HealthcareField";
import { ClinicProfile, DoctorProfile } from "@/types/healthcare";
import { PatientProfile } from "@/types/patient";
import styles from "./style.module.css";

type AccountSectionProps = {
  user: PatientProfile | DoctorProfile | ClinicProfile;
  edit?: boolean;
};

export function AccountSection({ user, edit }: AccountSectionProps) {
  return (
    <>
      <div className={styles["top-fields-container"]}>
        <div className={styles["fields-container"]}>
          <HealthcareField data={user} field="firstName" label edit={edit} />
          <HealthcareField data={user} field="lastName" label edit={edit} />
          <HealthcareField data={user} field="birthday" label edit={edit} />
          <HealthcareField data={user} field="gender" label edit={edit} />
        </div>
        <div>
          <HealthcareField data={user} field="photo" label edit={edit} />
        </div>
        <div>
          <HealthcareField data={user} field="insurance" label edit={edit} />
        </div>
      </div>
    </>
  );
}
