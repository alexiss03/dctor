import Image from "next/image";

import classNames from "classnames";
import styles from "./style.module.css";

type UserAvatarProps = {
  src: string;
  circle?: boolean;
  size?: "small" | "normal" | "large";
  className?: string;
  name?: string;
};

export function UserAvatar({
  src,
  circle,
  size,
  className,
  name,
}: UserAvatarProps) {
  const initial = (name ?? "").trim().charAt(0).toUpperCase() || "?";

  if (!src) {
    return (
      <div
        className={classNames(
          styles.avatar,
          styles.placeholder,
          {
            [styles.small]: size === "small",
            [styles.large]: size === "large",
          },
          className
        )}
      >
        {initial}
      </div>
    );
  }

  return (
    <Image
      className={classNames(
        styles.avatar,
        {
          [styles.circle]: circle,
          [styles.small]: size === "small",
          [styles.large]: size === "large",
        },
        "user-avatar",
        className
      )}
      src={src}
      width={512}
      height={512}
      alt="DUMMY AVATAR"
    />
  );
}
