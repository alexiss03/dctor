"use client";

import { SearchResults } from "./SearchResults";
import { SelectedSearchPopup } from "./SelectedSearchPopup";

import { search } from "@/backendServer/search";
import { getCurrentUser } from "@/backendServer/user";
import { Map } from "@/components/Map";
import { usePrompt } from "@/hooks/usePrompt";
import { useSidePane } from "@/hooks/useSidePane";
import { AppointmentSetIcon } from "@/icons/appointmentSet";
import { BaseDoctor, DoctorProfile } from "@/types/healthcare";
import { SearchResult } from "@/types/search";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { AppointmentBooking } from "./AppointmentBooking";
import styles from "./style.module.css";

export default function SearchPage() {
  const { open, close: closeSidePane } = useSidePane();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { prompt, close: closePrompt } = usePrompt();

  const q = searchParams.get("q");
  const treatments = searchParams.getAll("treatments") || [];
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const insurances = searchParams.getAll("insurances") || [];
  const weekday = searchParams.get("weekday");
  const time = searchParams.get("time");
  const rating = searchParams.get("rating");

  const { data: currentUser } = useQuery(["currentUser"], {
    queryFn: () => getCurrentUser(),
  });

  const { data: searchResults, isLoading } = useQuery(
    [
      "search",
      q,
      treatments,
      minPrice,
      maxPrice,
      insurances,
      weekday,
      time,
      rating,
    ],
    {
      queryFn: async () => {
        if (q === null) {
          return undefined;
        }

        if (
          !treatments &&
          !minPrice &&
          !maxPrice &&
          !insurances &&
          !weekday &&
          !time &&
          !rating
        ) {
          return null;
        }

        return search({
          types: ["doctor"],
          q: q !== null ? q : undefined,
          treatmentIds: treatments,
          minPrice: minPrice !== null ? minPrice : undefined,
          maxPrice: maxPrice !== null ? maxPrice : undefined,
          insurances,
          weekday: weekday !== null ? weekday : undefined,
          time: time !== null ? time : undefined,
          rating: rating !== null ? rating : undefined,
        }).then((response) =>
          "error" in response ? [] : (response.data as SearchResult[])
        );
      },
    }
  );

  const [selectedSearchResultForDetails, setSelectedSearchResultForDetails] =
    useState<SearchResult | null>(null);

  function handleProfileView(doctorID: BaseDoctor["id"]) {
    router.push(`/doctors/${doctorID}`);
  }

  const handleSelectSearchResult = useCallback(
    (resultId: SearchResult["id"]) => {
      if (!currentUser) {
        prompt({
          icon: <AppointmentSetIcon />,
          message: "To book an appointment, sign up for an account.",
          actions: [
            {
              key: "signup",
              variant: "primary",
              children: "Create an account",
              onClick: () => {
                router.push("/signup");
                closePrompt();
              },
            },
            {
              key: "login",
              variant: "clear",
              children: "I already have an account",
              onClick: () => {
                router.push("/login");
                closePrompt();
              },
            },
            {
              key: "cancel",
              variant: "clear",
              children: "Not now",
              onClick: closePrompt,
            },
          ],
        });
      } else {
        const searchResult = searchResults?.find(
          (result) => result.id === resultId
        );

        if (searchResult) {
          setSelectedSearchResultForDetails(searchResult);
        }
      }
    },
    [closePrompt, currentUser, prompt, router, searchResults]
  );

  function handleSelectedSearchBook(doctor: DoctorProfile) {
    open(
      <AppointmentBooking data={doctor} onCancel={closeSidePane} />,
      "Book appointment"
    );
  }

  const markers = useMemo(
    () =>
      searchResults?.map((result) => ({
        id: result.id,
        lat: result.clinic.location.latitude,
        lng: result.clinic.location.longitude,
      })) ?? [],
    [searchResults]
  );
  const map = useMemo(
    () => (
      <Map
        id="map"
        markers={markers}
        onSelectMarker={handleSelectSearchResult}
      />
    ),
    [handleSelectSearchResult, markers]
  );

  return (
    <div className={styles.wrapper}>
      <SearchResults
        data={searchResults || null}
        onSelect={handleSelectSearchResult}
        isLoading={isLoading}
      />
      <div className={styles["map-container"]}>
        <div
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          {map}
        </div>
        {selectedSearchResultForDetails && (
          <div className={styles["map-overlay-container"]}>
            <SelectedSearchPopup
              doctorId={selectedSearchResultForDetails.doctor.id}
              onBook={handleSelectedSearchBook}
              onCancel={() => setSelectedSearchResultForDetails(null)}
              onView={handleProfileView}
            />
          </div>
        )}
      </div>
    </div>
  );
}
