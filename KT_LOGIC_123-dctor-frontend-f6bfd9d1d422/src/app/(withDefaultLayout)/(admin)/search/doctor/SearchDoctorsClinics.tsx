"use client";

import { Button } from "@/components/Button";
import { HealthcareBox } from "@/components/HealthcareBox";
import { Page } from "@/components/Page";

import { EmptyResults } from "@/components/EmptyResults";
import { Input } from "@/components/Input";
import { SearchBarIcon } from "@/icons/searchbar";
import { useRouter, useSearchParams } from "next/navigation";

import { getDoctorsClinics } from "@/backendServer/healthcare";
import { getCurrentUser } from "@/backendServer/user";
import { BaseClinic } from "@/types/healthcare";
import { SearchResult } from "@/types/search";
import { ClinicUser, User } from "@/types/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "react-use";
import searchStyles from "../style.module.css";

export function SearchDoctorsClinics() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const [rawQuery, setRawQuery] = useState(searchParams.get("q") ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(rawQuery);

  const { data: currentUser } = useQuery(["currentUser"], {
    queryFn: () =>
      getCurrentUser().then((response) => response.data as ClinicUser | User),
  });

  const { data, isLoading } = useQuery(
    ["getDoctorsClinics", currentUser, debouncedQuery],
    {
      queryFn: () => {
        if (!currentUser) {
          return undefined;
        }

        return getDoctorsClinics(debouncedQuery, {
          clinicId: "clinic" in currentUser ? currentUser.clinic.id : undefined,
        }).then((response) => ("error" in response ? [] : response.data));
      },
    }
  );

  const router = useRouter();

  function handleViewDoctorClinic(data: SearchResult | BaseClinic) {
    router.push(getProfileUrl(data));
  }

  function updateDebouncedQuery() {
    if (rawQuery === debouncedQuery) {
      return;
    }

    queryClient.invalidateQueries(["getDoctorsClinics", rawQuery]);

    setDebouncedQuery(rawQuery);

    router.push(
      `/search/doctor?${new URLSearchParams({
        q: rawQuery,
      }).toString()}`
    );
  }

  function prefetchProfiles() {
    data?.forEach((data) => {
      router.prefetch(getProfileUrl(data));
    });
  }

  useDebounce(updateDebouncedQuery, 250, [rawQuery]);
  useEffect(prefetchProfiles, [data, router]);

  const items = data ?? [];

  const title =
    currentUser?.type === "clinicUser"
      ? "Affiliated Doctors"
      : "Doctor/Clinic Search";

  return (
    <Page title={title}>
      <div className={searchStyles.container}>
        <div className={searchStyles["search-bar-container"]}>
          <Input
            type="text"
            placeholder="Search doctors or clinics"
            prefixElement={
              <div style={{ padding: "0.5rem" }}>
                <SearchBarIcon />
              </div>
            }
            value={rawQuery}
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
            items.map((data) => (
              <HealthcareBox
                key={data.id}
                data={data}
                fields={[
                  {
                    name: "photo",
                  },
                  {
                    name: "name",
                  },
                  {
                    name: "category",
                  },
                  {
                    name: "location",
                    icon: true,
                  },
                  {
                    name: "availabilityToday",
                    icon: true,
                  },
                  {
                    name: "rating",
                  },
                ]}
                actions={[
                  <Button
                    key="view"
                    variant="primary"
                    size="large"
                    onClick={() => handleViewDoctorClinic(data)}
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

function getProfileUrl(data: SearchResult | BaseClinic) {
  const id = data.type === "clinic" ? data.id : data.doctor.id;

  return `/${data.type === "doctor" ? "doctors" : "clinics"}/${id}`;
}
