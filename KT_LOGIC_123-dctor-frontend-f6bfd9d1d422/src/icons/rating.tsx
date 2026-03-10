type RatingIconProps = {
  active?: boolean;
};

export function RatingIcon({ active = true }: RatingIconProps) {
  return (
    <svg
      width="0.875em"
      height="1em"
      viewBox="0 0 14 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.11766 12.2927L11.2985 15.1637L10.189 9.75275L13.8828 6.11211L9.01866 5.6426L7.11766 0.539551L5.21666 5.6426L0.352539 6.11211L4.04629 9.75275L2.93681 15.1637L7.11766 12.2927Z"
        fill={active ? "#EFB33E" : "#D9D9D9"}
      />
    </svg>
  );
}
