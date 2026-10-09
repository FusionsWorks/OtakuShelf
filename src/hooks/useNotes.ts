"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

interface CreateNoteInput {
  entryId: string;
  titleId: string;
  content: string;
}

interface DeleteNoteInput {
  entryId: string;
  titleId: string;
  noteId: string;
}

async function createNote({
  entryId,
  content,
}: CreateNoteInput) {
  const response = await fetch(
    `/api/library/${entryId}/notes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ?? "No pudimos crear la nota.",
    );
  }

  return data;
}

async function deleteNote({
  entryId,
  noteId,
}: DeleteNoteInput) {
  const response = await fetch(
    `/api/library/${entryId}/notes?noteId=${encodeURIComponent(
      noteId,
    )}`,
    {
      method: "DELETE",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ?? "No pudimos eliminar la nota.",
    );
  }

  return data;
}

export function useNotes(titleId: string) {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createNote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["title", titleId],
      });
    },
  });

  const remove = useMutation({
    mutationFn: deleteNote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["title", titleId],
      });
    },
  });

  return {
    create,
    remove,
  };
}