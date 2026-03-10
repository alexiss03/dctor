"use client";

import { Button } from "@/components/Button";
import { HealthcareBox } from "@/components/HealthcareBox";
import { Page } from "@/components/Page";

import { EmptyResults } from "@/components/EmptyResults";
import { IconButton } from "@/components/IconButton";
import { Input } from "@/components/Input";
import { FilterIcon } from "@/icons/filter";
import { SearchBarIcon } from "@/icons/searchbar";
import { PatientProfile } from "@/types/patient";
import { useRouter, useSearchParams } from "next/navigation";

import { getPatients } from "@/backendServer/patient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "react-use";
import searchStyles from "../style.module.css";

export function SearchUsers() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const [rawQuery, setRawQuery] = useState(searchParams.get("q") ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(rawQuery);

  const { data, isLoading } = useQuery(["getPatients", debouncedQuery], {
    queryFn: () =>
      getPatients(debouncedQuery).then((response) =>
        "error" in response ? [] : response.data
      ),
  });

  const router = useRouter();

  function handleViewUser(userId: PatientProfile["id"]) {
    router.push(`/users/${userId}`);
  }

  function updateDebouncedQuery() {
    if (rawQuery === debouncedQuery) {
      return;
    }

    queryClient.invalidateQueries(["getPatients", rawQuery]);

    setDebouncedQuery(rawQuery);

    router.push(
      `/search/user?${new URLSearchParams({
        q: rawQuery,
      }).toString()}`
    );
  }

  function prefetchProfiles() {
    data?.forEach((data) => {
      router.prefetch(`/users/${data.id}`);
    });
  }

  useDebounce(updateDebouncedQuery, 250, [rawQuery]);
  useEffect(prefetchProfiles, [data, router]);

  const items = data ?? [];

  return (
    <Page title="User Search">
      <div className={searchStyles.container}>
        <div className={searchStyles["search-bar-container"]}>
          <Input
            type="text"
            placeholder="Search users"
            prefixElement={
              <div style={{ padding: "0.5rem" }}>
                <SearchBarIcon />
              </div>
            }
            suffixElement={
              <IconButton>
                <FilterIcon />
              </IconButton>
            }
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setRawQuery(e.target.value)
            }
          />
        </div>
        {isLoading ? (
          <p className={searchStyles["results-text"]}>Searching...</p>
        ) : (
          <p className={searchStyles["results-text"]}>
            We found{" "}
            <strong className={searchStyles["results-number"]}>
              {items.length}
            </strong>{" "}
            user{items.length === 1 ? "" : "s"} you can view.
          </p>
        )}
        {!isLoading &&
          (items.length > 0 ? (
            items.map((patient) => (
              <HealthcareBox
                key={patient.id}
                data={patient}
                fields={[
                  {
                    name: "photo",
                  },
                  {
                    name: "name",
                  },
                  {
                    name: "gender",
                    label: true,
                  },
                  {
                    name: "insurance",
                    label: true,
                  },
                ]}
                actions={[
                  <Button
                    key="view"
                    variant="primary"
                    size="large"
                    onClick={() => handleViewUser(patient.id)}
                  >
                    View
                  </Button>,
                ]}
              />
            ))
          ) : (
            <div>
              <EmptyResults withPadding />
            </div>
          ))}
      </div>
    </Page>
  );
}
