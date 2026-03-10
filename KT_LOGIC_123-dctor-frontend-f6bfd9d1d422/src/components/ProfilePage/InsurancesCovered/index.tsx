import { DoctorInsurance, Insurance } from "@/types/insurance";

import { getCurrentUser } from "@/backendServer/user";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import _ from "lodash";
import { Fragment } from "react";
import { InfoBox } from "../InfoBox";
import styles from "./style.module.css";

type InsuranceItemProps = {
  insurance: Insurance;
  covered?: boolean;
};

function InsuranceItem({ insurance, covered }: InsuranceItemProps) {
  return (
    <div
      className={classNames(styles["insurance-item"], {
        [styles.covered]: covered,
      })}
    >
      <div>{insurance.name}</div>
      {covered && (
        <div
          className={classNames(styles["covered-text"], {
            [styles.covered]: covered,
          })}
        >{`(you are covered here!)`}</div>
      )}
    </div>
  );
}

type InsurancesCoveredPropsDoctor = {
  type: "doctor";
  data: DoctorInsurance[];
};

type InsurancesCoveredPropsClinic = {
  type: "clinic";
  data: Insurance[];
};

export function InsurancesCovered({
  type,
  data,
}: InsurancesCoveredPropsDoctor | InsurancesCoveredPropsClinic) {
  const { data: currentUser } = useQuery(["currentUser"], {
    queryFn: () => getCurrentUser().then((response) => response.data),
  });

  function renderInsurances(insurances: Insurance[]) {
    return insurances.map((insurance) => {
      const covered =
        currentUser &&
        "insurances" in currentUser &&
        currentUser.insurances
          .map((insurance) => insurance.id)
          .includes(insurance.id);

      return (
        <InsuranceItem
          key={insurance.id}
          insurance={insurance}
          covered={!!covered}
        />
      );
    });
  }

  if (type === "clinic") {
    return (
      <InfoBox label="Insurances Covered">
        <div className={styles["insurance-item-container"]}>
          {renderInsurances(data)}
        </div>
      </InfoBox>
    );
  }

  const groups = _.groupBy(data, (data) => {
    return data.clinic.id;
  });

  return (
    <InfoBox label="Insurances Covered">
      <div className={styles["insurance-item-container"]}>
        {Object.values(groups).map((group) => (
          <Fragment key={group[0].clinic.id}>
            <p className={styles["clinic-name"]}>{group[0].clinic.name}</p>
            {renderInsurances(group.map((group) => group.insurance))}
          </Fragment>
        ))}
      </div>
    </InfoBox>
  );
}
