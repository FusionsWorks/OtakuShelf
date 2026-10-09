"use client";

import { useQuery } from "@tanstack/react-query";

export interface DashboardData {
  stats: {
    total: number;
    completed: number;
    favorites: number;
    inProgress: number;
  };

  continueWatching: Array<{
    id: string;
    progress: number;
    status: "WATCHING" | "READING" | "COMPLETED" | "PLAN_TO_WATCH" | "PLAN_TO_READ" | "ON_HOLD" | "DROPPED";
    updatedAt: string;
    title: {
      id: string;
      title: string;
      coverUrl: string | null;
      type: "ANIME" | "MANGA";
      totalEpisodes: number | null;
      totalChapters: number | null;
    };
  }>;

  recentActivity: Array<{
    id: string;
    progress: number;
    recordedAt: string;
    entry: {
      id: string;
      status: string;
      title: {
        title: string;
        coverUrl: string | null;
        type: "ANIME" | "MANGA";
      };
    };
  }>;
}

async function fetchDashboard(): Promise<DashboardData> {
  const response = await fetch("/api/dashboard");

  if (!response.ok) {
    throw new Error("No se pudo cargar el dashboard");
  }

  return response.json();
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });
}