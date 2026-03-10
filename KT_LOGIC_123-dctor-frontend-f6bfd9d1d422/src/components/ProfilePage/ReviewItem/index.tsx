"use client";

import classNames from "classnames";

import { UserAvatar } from "@/components/UserAvatar";
import { RatingIcon } from "@/icons/rating";
import { Review } from "@/types/healthcare";
import Link from "next/link";
import { useState } from "react";
import styles from "./style.module.css";

const TRUNCATED_REVIEW_CHARACTER_LIMIT = 250;

type ReviewItemProps = {
  review: Review;
  withDoctor?: boolean;
};

export function ReviewItem({ review, withDoctor }: ReviewItemProps) {
  const [descriptionIsRevealed, setDescriptionIsRevealed] = useState(false);
  const truncatedDescription = review.comment.substring(
    0,
    TRUNCATED_REVIEW_CHARACTER_LIMIT
  );

  const reviewOverCharacterLimit =
    review.comment.length > TRUNCATED_REVIEW_CHARACTER_LIMIT;

  const description = descriptionIsRevealed
    ? review.comment
    : truncatedDescription;

  return (
    <div className={classNames(styles.container, "white-box")}>
      <div className={styles["user-info-container"]}>
        <div className={styles["avatar-container"]}>
          <UserAvatar
            src={review.patient.avatarUrl}
            size="small"
            circle
            name="Patient"
          />
        </div>
        <div className={styles["name-date-container"]}>
          <p className={styles.name}>{review.patient.displayName}</p>
          <div className={styles["date-doctor-container"]}>
            <p className={styles.date}>January 1, 2023</p>
            {/* @TODO: handle */}
            {withDoctor && (
              <Link href="/doctors/123123">Dr. Ramon Dela Cruz</Link>
            )}
          </div>
        </div>
      </div>
      <div className={styles["rating-score-container"]}>
        {Array.from(new Array(5)).map((__, i) => (
          <RatingIcon key={i} active={i + 1 <= review.rating} />
        ))}
      </div>
      <p className={styles["review-text"]}>
        {description}
        {reviewOverCharacterLimit && !descriptionIsRevealed && (
          <>
            {"... "}
            <Link
              href="#"
              scroll={false}
              onClick={() => setDescriptionIsRevealed(true)}
            >
              Read more
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
