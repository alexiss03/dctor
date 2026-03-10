import { Input } from "../Input";
import { InputLabel } from "../InputLabel";
import { Select } from "../Select";

import { getTreatments } from "@/backendServer/healthcare";
import { getInsurances } from "@/backendServer/insurance";
import { useSidePane } from "@/hooks/useSidePane";
import { RatingIcon } from "@/icons/rating";
import { TIME_OPTIONS } from "@/utils/date";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { usePathname, useRouter } from "next/navigation";
import { ActionButtons } from "../ActionButtons";
import { Button } from "../Button";
import styles from "./style.module.css";

const weekdayOptions = Array.from(new Array(7)).map((_, i) => ({
  value: `${i}`,
  label: dayjs().day(i).format("dddd"),
}));

const ratingOptions = [
  {
    value: "all",
    label: (
      <>
        {RatingIcon}
        <span>All</span>
      </>
    ),
  },
  ...Array.from(new Array(4)).map((_, i) => ({
    value: `${5 - i * 0.5}`,
    label: (
      <>
        {RatingIcon}
        <span>{5 - i * 0.5}</span>
      </>
    ),
  })),
];

type FiltersSidePaneProps = {
  q?: string;
};

export function FiltersSidePane({ q }: FiltersSidePaneProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { close } = useSidePane();

  const { data: treatments } = useQuery(["treatments"], {
    queryFn: () =>
      getTreatments().then((response) =>
        "error" in response ? [] : response.data
      ),
    initialData: [],
  });

  const { data: insurances } = useQuery(["insurances"], {
    queryFn: () =>
      getInsurances().then((response) =>
        "error" in response ? [] : response.data
      ),
    initialData: [],
  });

  function handleSubmit(formData: FormData) {
    const treatments = formData.getAll("treatments").filter((d) => !!d);
    const minPrice = formData.get("minPrice");
    const maxPrice = formData.get("maxPrice");
    const insurances = formData.getAll("insurances").filter((d) => !!d);
    const weekday = formData.get("weekday");
    const time = formData.get("time");
    const rating = formData.get("rating");

    const searchParams = new URLSearchParams();

    if (q) {
      searchParams.append("q", q);
    }

    if (treatments.length) {
      treatments.forEach((treatment) => {
        searchParams.append("treatments", treatment as string);
      });
    }

    if (minPrice) {
      searchParams.append("minPrice", minPrice as string);
    }

    if (maxPrice) {
      searchParams.append("maxPrice", maxPrice as string);
    }

    if (insurances.length) {
      insurances.forEach((insurance) => {
        searchParams.append("insurances", insurance as string);
      });
    }

    if (weekday) {
      searchParams.append("weekday", weekday as string);
    }

    if (time) {
      searchParams.append("time", time as string);
    }

    if (rating) {
      searchParams.append("rating", rating as string);
    }

    router.push(pathname + "?" + searchParams.toString());

    close();
  }

  return (
    <form action={handleSubmit}>
      <div className={styles.wrapper}>
        <div style={{ marginBottom: "2rem" }}>
          <InputLabel>Treatment</InputLabel>
          <Select
            name="treatments"
            options={treatments.map((treatment) => ({
              value: treatment.id,
              label: treatment.name,
            }))}
            isMulti
          />
          <div className="two-column">
            <div>
              <InputLabel>Min Price</InputLabel>
              <Input name="minPrice" type="currency" />
            </div>
            <div>
              <InputLabel>Max Price</InputLabel>
              <Input name="maxPrice" type="currency" />
            </div>
          </div>
          <InputLabel>Insurance</InputLabel>
          <Select
            name="insurances"
            options={insurances.map((insurance) => ({
              value: insurance.id,
              label: insurance.name,
            }))}
            isMulti
          />
          <InputLabel>Select Day and Time</InputLabel>
          <div className="two-column">
            <div>
              <Select name="weekday" options={weekdayOptions} />
            </div>
            <div>
              <Select name="time" options={TIME_OPTIONS} />
            </div>
          </div>
          <InputLabel>Rating</InputLabel>
          <Select
            name="rating"
            options={ratingOptions}
            defaultValue={ratingOptions[0]}
          />
        </div>
        <ActionButtons
          actions={[
            <Button key="clear" variant="secondary" full size="large">
              Clear Filter
            </Button>,
            <Button
              key="apply"
              variant="primary"
              full
              size="large"
              type="submit"
            >
              Apply Filter
            </Button>,
          ]}
        />
      </div>
    </form>
  );
}
