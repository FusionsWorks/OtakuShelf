"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchStats() {
  const response = await fetch("/api/stats");

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ??
        "No pudimos cargar tus estadísticas.",
    );
  }

  return data;
}

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
  });
}