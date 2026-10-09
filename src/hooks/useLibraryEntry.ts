"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

interface UpdateLibraryEntryInput {
  entryId: string;
  titleId: string;
  rating?: number | null;
  isFavorite?: boolean;
}

async function updateLibraryEntry({
  entryId,
  rating,
  isFavorite,
}: UpdateLibraryEntryInput) {
  const response = await fetch(
    `/api/library/${entryId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating,
        isFavorite,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ??
        "No pudimos actualizar la entrada.",
    );
  }

  return data;
}

export function useLibraryEntry(titleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLibraryEntry,

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