"use client";

import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

export interface LibraryFilters {
  status?: string;
  type?: "ANIME" | "MANGA";
  favorite?: boolean;
  search?: string;
  sort?: "updatedAt" | "addedAt" | "title" | "rating" | "progress";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

async function fetchLibrary(filters: LibraryFilters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const response = await fetch(`/api/library?${params.toString()}`);

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new Error(
      body?.error ?? "No se pudo cargar la biblioteca",
    );
  }

  return response.json();
}

export function useLibrary(filters: LibraryFilters = {}) {
  return useQuery({
    queryKey: ["library", filters],
    queryFn: () => fetchLibrary(filters),
    placeholderData: keepPreviousData,
  });
}