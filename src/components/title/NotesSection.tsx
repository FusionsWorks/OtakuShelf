"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { useNotes } from "@/hooks/useNotes";

interface Note {
  id: string;
  content: string;
  createdAt: string;
}

interface NotesSectionProps {
  entryId: string;
  titleId: string;
  notes: Note[];
}

export function NotesSection({
  entryId,
  titleId,
  notes,
}: NotesSectionProps) {
  const [content, setContent] = useState("");

  const { create, remove } = useNotes(titleId);

  const handleCreate = () => {
    const trimmed = content.trim();

    if (!trimmed || create.isPending) {
      return;
    }

    create.mutate(
      {
        entryId,
        titleId,
        content: trimmed,
      },
      {
        onSuccess: () => {
          setContent("");
        },
      },
    );
  };

  return (
    <section className="mt-8 rounded-xl2 border border-ink-700 bg-ink-900 p-5">
      <h2 className="font-display text-lg font-semibold text-mist-100">
        Notas
      </h2>

      <div className="mt-4">
        <textarea
          value={content}
          onChange={(event) =>
            setContent(event.target.value)
          }
          maxLength={2000}
          rows={4}
          placeholder="Escribe una nota sobre este título..."
          className="w-full resize-y rounded-lg border border-ink-700 bg-ink-800 px-3 py-3 text-sm text-mist-100 outline-none transition placeholder:text-mist-500 focus:border-ember-500 focus:ring-1 focus:ring-ember-500/20"
        />

        <div className="mt-2 flex items-center justify-between gap-4">
          <span className="text-xs text-mist-500">
            {content.length}/2000
          </span>

          <button
            type="button"
            onClick={handleCreate}
            disabled={
              !content.trim() || create.isPending
            }
            className="rounded-lg bg-ember-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ember-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {create.isPending
              ? "Guardando..."
              : "Añadir nota"}
          </button>
        </div>
      </div>

      {create.isError && (
        <p className="mt-3 text-sm text-red-400">
          {create.error instanceof Error
            ? create.error.message
            : "No pudimos crear la nota."}
        </p>
      )}

      <div className="mt-6 divide-y divide-ink-700">
        {notes.length === 0 ? (
          <p className="py-2 text-sm text-mist-500">
            Todavía no tienes notas para este título.
          </p>
        ) : (
          notes.map((note) => (
            <article
              key={note.id}
              className="flex gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="min-w-0 flex-1">
                <p className="whitespace-pre-wrap text-sm leading-6 text-mist-300">
                  {note.content}
                </p>

                <p className="mt-2 text-xs text-mist-500">
                  {format(
                    new Date(note.createdAt),
                    "d 'de' MMMM 'de' yyyy, HH:mm",
                    { locale: es },
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  remove.mutate({
                    entryId,
                    titleId,
                    noteId: note.id,
                  })
                }
                disabled={remove.isPending}
                aria-label="Eliminar nota"
                title="Eliminar nota"
                className="shrink-0 rounded-lg p-2 text-mist-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </button>
            </article>
          ))
        )}
      </div>

      {remove.isError && (
        <p className="mt-3 text-sm text-red-400">
          {remove.error instanceof Error
            ? remove.error.message
            : "No pudimos eliminar la nota."}
        </p>
      )}
    </section>
  );
}