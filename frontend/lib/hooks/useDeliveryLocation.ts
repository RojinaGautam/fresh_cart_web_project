"use client";

import { useCallback, useEffect, useState } from "react";

export type DeliveryLocation = {
  city: string;
  country: string;
};

type LocationStatus = "idle" | "loading" | "granted" | "denied" | "error";

const FALLBACK_LOCATION: DeliveryLocation = {
  city: "New York",
  country: "United States",
};

async function reverseGeocode(latitude: number, longitude: number): Promise<DeliveryLocation> {
  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
  );

  if (!response.ok) {
    throw new Error("Reverse geocoding failed");
  }

  const data = await response.json();
  const city = data.city || data.locality || data.principalSubdivision;
  const country = data.countryName;

  if (!city || !country) {
    throw new Error("Incomplete location data");
  }

  return { city, country };
}

export function useDeliveryLocation() {
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [location, setLocation] = useState<DeliveryLocation>(FALLBACK_LOCATION);

  const requestLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const resolved = await reverseGeocode(
            position.coords.latitude,
            position.coords.longitude,
          );
          setLocation(resolved);
          setStatus("granted");
        } catch {
          setStatus("error");
        }
      },
      () => {
        setStatus("denied");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10 * 60 * 1000 },
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return { location, status, requestLocation };
}
