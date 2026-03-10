"use client";

import { DoctorProfile } from "@/types/healthcare";
import classNames from "classnames";
import { Page } from "../Page";

import { getReviews } from "@/backendServer/healthcare";
import { getUser } from "@/backendServer/user";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "../Button";
import { HealthcareBox } from "../HealthcareBox";
import { ReviewItem } from "../ProfilePage/ReviewItem";
import styles from "./style.module.css";

type ReviewsPageProps = {
  id: string;
};

export function ReviewsPage({ id }: ReviewsPageProps) {
  const router = useRouter();

  const { data } = useQuery(["user", id], {
    queryFn: () =>
      getUser<DoctorProfile>(id).then((response) =>
        "error" in response ? null : response.data
      ),
  });

  const { data: reviews } = useQuery(["reviews", id], {
    queryFn: () =>
      getReviews(id).then((response) =>
        "error" in response ? [] : response.data
      ),
  });

  if (!data || !reviews) {
    return <Page />;
  }

  function handleBackToProfile() {
    if (!data) {
      return;
    }

    // @TODO: handle clinics
    // router.push(
    //   `/${data.type === "clinic" ? "clinics" : "doctors"}/${data.id}`
    // );
    router.push(`/doctors/${data.id}`);
  }
  const title = `${
    data.type === "doctor" ? "Doctor" : "Clinic"
  }'s Profile > Reviews`;

  return (
    <Page title={title}>
      <div className={classNames(styles.container, "white-box")}>
        <HealthcareBox
          data={data}
          fields={[
            {
              name: "photo",
            },
            {
              name: "name",
            },
          ]}
          hasContainer={false}
          actions={[
            <Button key="back" variant="clear" onClick={handleBackToProfile}>
              Back to profile
            </Button>,
          ]}
        />
        <div>
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>
      </div>
    </Page>
  );
}
