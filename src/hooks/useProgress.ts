"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateProgressInput {
  entryId: string;
  delta?: number;
  manualValue?: number;
}

async function updateProgress({
  entryId,
  delta,
  manualValue,
}: UpdateProgressInput) {
  const response = await fetch(
    `/api/library/${entryId}/progress`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        delta,
        manualValue,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ?? "No pudimos actualizar el progreso.",
    );
  }

  return data;
}

export function useProgress(titleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProgress,

    onSuccess: () => {
  queryClient.invalidateQueries({
    queryKey: ["title", titleId],
  });

  queryClient.invalidateQueries({
    queryKey: ["library"],
  });

  queryClient.invalidateQueries({
    queryKey: ["dashboard"],
  });

  queryClient.invalidateQueries({
    queryKey: ["stats"],
  });
 },
  });
}