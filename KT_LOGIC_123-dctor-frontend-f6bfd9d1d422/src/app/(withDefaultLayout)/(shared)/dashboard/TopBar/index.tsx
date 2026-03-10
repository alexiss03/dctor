import { SearchBar } from "@/components/SearchBar";
import { UserAvatar } from "@/components/UserAvatar";
import classNames from "classnames";

import { BaseDoctor } from "@/types/healthcare";
import { BasePatient } from "@/types/patient";
import { ClinicUser } from "@/types/user";
import { getNameWithTitle } from "@/utils/user";
import styles from "./style.module.css";

const typeTextMap: Record<string, string> = {
  patient: "Patient",
  doctor: "Doctor",
  clinicUser: "Clinic Admin",
};

type TopBarProps = {
  user: BaseDoctor | BasePatient | ClinicUser;
  search?: boolean;
};

export function TopBar({ user, search }: TopBarProps) {
  const name = getNameWithTitle(user);

  return (
    <div className={classNames(styles.container, "white-box")}>
      <div className={styles["searchbar-container"]}>
        {search && <SearchBar />}
      </div>
      <div className={styles["user-container"]}>
        <div className={styles["user-info-container"]}>
          <div className={styles["user-name"]}>{name}</div>
          <div
            className={classNames({
              [styles.doctor]:
                user.type === "doctor" || user.type === "clinicUser",
            })}
          >
            {typeTextMap[user.type]}
          </div>
        </div>
        <div className={styles["user-info-container"]}>
          <UserAvatar src={user.avatarUrl} circle name={user.displayName} />
        </div>
      </div>
    </div>
  );
}
