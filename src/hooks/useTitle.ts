"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchTitle(titleId: string) {
  const response = await fetch(`/api/titles/${titleId}`);

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.error ?? "No pudimos cargar el título.",
    );
  }

  return response.json();
}

export function useTitle(titleId: string) {
  return useQuery({
    queryKey: ["title", titleId],
    queryFn: () => fetchTitle(titleId),
    enabled: Boolean(titleId),
  });
}