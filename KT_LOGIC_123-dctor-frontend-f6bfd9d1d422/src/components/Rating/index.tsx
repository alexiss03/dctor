import { RatingIcon } from "@/icons/rating";

import { Button } from "../Button";
import styles from "./style.module.css";

type RatingProps = {
  score: number;
  reviewsCount?: number;
};

export function Rating({ score, reviewsCount }: RatingProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles["rating-wrapper"]}>
        <RatingIcon /> <p>{score.toFixed(1)}</p>
      </div>
      {reviewsCount !== undefined && (
        <Button className={styles["reviews-count-button"]}>
          {reviewsCount} Reviews
        </Button>
      )}
    </div>
  );
}
