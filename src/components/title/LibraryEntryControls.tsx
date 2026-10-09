"use client";

import { Heart, Star } from "lucide-react";
import { useState } from "react";

import { useLibraryEntry } from "@/hooks/useLibraryEntry";

interface LibraryEntryControlsProps {
  entryId: string;
  titleId: string;
  rating: number | null;
  isFavorite: boolean;
}

export function LibraryEntryControls({
  entryId,
  titleId,
  rating,
  isFavorite,
}: LibraryEntryControlsProps) {
  const [selectedRating, setSelectedRating] =
    useState<string>(
      rating !== null ? String(rating) : "",
    );

  const mutation = useLibraryEntry(titleId);

  const toggleFavorite = () => {
    mutation.mutate({
      entryId,
      titleId,
      isFavorite: !isFavorite,
    });
  };

  const saveRating = () => {
    if (!selectedRating) {
      mutation.mutate({
        entryId,
        titleId,
        rating: null,
      });

      return;
    }

    mutation.mutate({
      entryId,
      titleId,
      rating: Number(selectedRating),
    });
  };

  return (
    <div className="mt-5 border-t border-ink-700 pt-5">
      <div className="flex flex-wrap items-end gap-4">
        <button
          type="button"
          onClick={toggleFavorite}
          disabled={mutation.isPending}
          aria-pressed={isFavorite}
          className={[
            "inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition",
            isFavorite
              ? "border-ember-500/50 bg-ember-500/10 text-ember-400"
              : "border-ink-700 bg-ink-800 text-mist-300 hover:border-ink-600 hover:text-mist-100",
            "disabled:cursor-not-allowed disabled:opacity-40",
          ].join(" ")}
        >
          <Heart
            className="h-4 w-4"
            fill={isFavorite ? "currentColor" : "none"}
          />

          {isFavorite
            ? "En favoritos"
            : "Añadir a favoritos"}
        </button>

        <div className="flex items-end gap-2">
          <label className="block">
            <span className="mb-1 block text-xs text-mist-500">
              Tu rating
            </span>

            <div className="relative">
              <Star
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ember-400"
                aria-hidden="true"
              />

              <select
                value={selectedRating}
                onChange={(event) =>
                  setSelectedRating(event.target.value)
                }
                disabled={mutation.isPending}
                className="h-10 rounded-lg border border-ink-700 bg-ink-800 pl-9 pr-8 text-sm text-mist-100 outline-none transition focus:border-ember-500 focus:ring-1 focus:ring-ember-500/20 disabled:opacity-40"
              >
                <option value="">Sin rating</option>

                {Array.from(
                  { length: 10 },
                  (_, index) => index + 1,
                ).map((value) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {value}/10
                  </option>
                ))}
              </select>
            </div>
          </label>

          <button
            type="button"
            onClick={saveRating}
            disabled={mutation.isPending}
            className="h-10 rounded-lg bg-ink-800 px-4 text-sm font-medium text-mist-300 transition hover:border-ember-500/50 hover:text-mist-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Guardar
          </button>
        </div>
      </div>

      {mutation.isError && (
        <p className="mt-3 text-sm text-red-400">
          {mutation.error instanceof Error
            ? mutation.error.message
            : "No pudimos actualizar los datos."}
        </p>
      )}

      {mutation.isSuccess && (
        <p className="mt-3 text-sm text-emerald-400">
          Datos actualizados correctamente.
        </p>
      )}
    </div>
  );
}