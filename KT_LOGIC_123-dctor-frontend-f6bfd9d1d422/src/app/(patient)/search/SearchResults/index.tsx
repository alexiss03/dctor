"use client";

import { IconButton } from "@/components/IconButton";
import { SearchBar } from "@/components/SearchBar";
import { BackIcon } from "@/icons/back";
import { SearchResult as SearchResultType } from "@/types/search";
import classNames from "classnames";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchResult } from "./SearchResult";
import styles from "./style.module.css";

type SearchResultsProps = {
  data: SearchResultType[] | null;
  onSelect: (resultId: SearchResultType["id"]) => void;
  isLoading: boolean;
};

export function SearchResults({
  data,
  isLoading,
  onSelect,
}: SearchResultsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleBackButtonClick() {
    router.push("/dashboard");
  }

  function handleOnSelect(searchResult: SearchResultType) {
    onSelect(searchResult.id);
  }

  return (
    <div className={classNames(styles.container, "white-box")}>
      <div className={styles["back-button-container"]}>
        <IconButton type="button" onClick={handleBackButtonClick}>
          <BackIcon />
        </IconButton>
      </div>
      <div className="section">
        <SearchBar
          disabled={isLoading}
          defaultValue={searchParams.get("q") || ""}
          hasFilters
        />
      </div>
      {isLoading && (
        <p className={styles["results-text"]}>Searching in progress...</p>
      )}
      {!isLoading && data && (
        <>
          <div className={classNames(styles["results-text"], "section")}>
            We found <span className={styles.highlight}>{data.length}</span>{" "}
            doctor/clinic(s) you can book with.
          </div>
          <div className={styles["results-container"]}>
            {data.map((result) => (
              <SearchResult
                key={result.id}
                data={result}
                onSelect={handleOnSelect}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
