"use client";

import classNames from "classnames";
import { Input } from "../Input";

import { useSidePane } from "@/hooks/useSidePane";
import { FilterIcon } from "@/icons/filter";
import { SearchBarIcon } from "@/icons/searchbar";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { FiltersSidePane } from "../FiltersSidePane";
import { IconButton } from "../IconButton";
import styles from "./style.module.css";

type SearchBarProps = {
  disabled?: boolean;
  defaultValue?: string;
  hasFilters?: boolean;
};

export function SearchBar({
  disabled,
  defaultValue,
  hasFilters,
}: SearchBarProps) {
  const router = useRouter();
  const { open } = useSidePane();

  const [input, setInput] = useState(defaultValue);

  function handleFormSubmit(formData: FormData) {
    const q = formData.get("search-query") as string;

    if (!q) {
      return;
    }

    router.push(`/search?q=${q}`);
  }

  function handleOpenFilters() {
    open(<FiltersSidePane q={input} />, "Filters");
  }

  return (
    <form action={handleFormSubmit} style={{ width: "100%" }}>
      <Input
        name="search-query"
        className={classNames(styles.container, "white-box")}
        type="text"
        placeholder="Search Doctor's name, Specialist, Procedures"
        disabled={disabled}
        full
        prefixElement={<SearchBarIcon />}
        suffixElement={
          hasFilters ? (
            <IconButton
              onClick={handleOpenFilters}
              style={{ fontSize: "0.7rem" }}
            >
              <FilterIcon />
            </IconButton>
          ) : undefined
        }
        value={input}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setInput(e.target.value)
        }
      />
    </form>
  );
}
