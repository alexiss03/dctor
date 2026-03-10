"use client";

import { SearchResult } from "@/types/search";
import { Loader } from "@googlemaps/js-api-loader";
import _ from "lodash";

import { useLayoutEffect, useRef } from "react";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

const loader = new Loader({
  apiKey,
  version: "weekly",
});

type Marker = {
  id: SearchResult["id"];
  lat: number;
  lng: number;
};

type MapProps = {
  id: string;
  markers: Marker[];
  initialZoom?: number;
  onSelectMarker?: (resultId: SearchResult["id"]) => void;
};

export function Map({
  id,
  markers,
  initialZoom = 6,
  onSelectMarker,
}: MapProps) {
  const googleMap = useRef<google.maps.Map | null>(null);
  const googleMarkers = useRef<
    { id: SearchResult["id"]; marker: google.maps.Marker }[]
  >([]);

  function initializeMap() {
    if (!!googleMap.current) {
      return;
    }

    loader
      .load()
      .then((google) => {
        const initialLocation = {
          lat: 0,
          lng: 0,
        };

        const map = new google.maps.Map(
          document.getElementById(id) as HTMLElement,
          {
            zoom: initialZoom,
            center: initialLocation,
          }
        );

        googleMap.current = map;
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function renderMarkers() {
    if (!googleMap.current) {
      return;
    }

    const markersToAdd: Marker[] = _.differenceBy(
      markers,
      googleMarkers.current,
      "id"
    );
    const markersToRemove: {
      id: SearchResult["id"];
      marker: google.maps.Marker;
    }[] = _.differenceBy(googleMarkers.current, markers, "id");

    markersToAdd.forEach((marker) => {
      const googleMarker = new google.maps.Marker({
        position: {
          lat: marker.lat,
          lng: marker.lng,
        },
        map: googleMap.current,
      });

      googleMarker.addListener("click", () => {
        onSelectMarker?.(marker.id);
      });

      googleMarkers.current.push({
        id: marker.id,
        marker: googleMarker,
      });
    });

    markersToRemove.forEach((marker) => {
      marker.marker.setMap(null);

      googleMarkers.current = googleMarkers.current.filter(
        (_marker) => marker.id !== _marker.id
      );
    });

    if ((markersToAdd.length || markersToRemove.length) && markers.length) {
      googleMap.current.setCenter({
        lat: markers[0].lat,
        lng: markers[0].lng,
      });
    }
  }

  useLayoutEffect(initializeMap, [id, initialZoom]);
  useLayoutEffect(renderMarkers, [markers, onSelectMarker]);

  return <div id={id} style={{ width: "100%", height: "100vh" }}></div>;
}
