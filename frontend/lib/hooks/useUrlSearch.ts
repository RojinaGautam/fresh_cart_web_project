"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

/**
 * Keeps an admin table's search box in sync with a `?search=` query param.
 *
 * The global header search deep-links into admin pages with `?search=`, which
 * may target the page the admin is already on. In that case the component is
 * not remounted, so the value is re-synced during render (React's documented
 * "adjusting state when a prop changes" pattern) rather than in an effect.
 */
export function useUrlSearch() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(urlSearch);
  const [syncedFrom, setSyncedFrom] = useState(urlSearch);

  if (urlSearch !== syncedFrom) {
    setSyncedFrom(urlSearch);
    setSearch(urlSearch);
  }

  return [search, setSearch] as const;
}
