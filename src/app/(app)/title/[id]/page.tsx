"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProgressControls } from "@/components/title/ProgressControls";
import { ProgressHistory } from "@/components/title/ProgressHistory";
import { LibraryEntryControls } from "@/components/title/LibraryEntryControls";
import { NotesSection } from "@/components/title/NotesSection";
import { Skeleton } from "@/components/ui/Skeleton";
import { useTitle } from "@/hooks/useTitle";

interface TitlePageProps {
  params: {
    id: string;
  };
}

export default function TitlePage({
  params,
}: TitlePageProps) {
  const { data, isPending, isError, error } = useTitle(
    params.id,
  );

  if (isPending) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-8 h-6 w-32" />

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <Skeleton className="aspect-[2/3] w-full rounded-xl2" />

          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/library"
          className="inline-flex items-center gap-2 text-sm text-mist-500 hover:text-mist-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a biblioteca
        </Link>

        <div className="mt-8 rounded-xl2 border border-red-500/20 bg-red-500/5 p-8 text-center">
          <h1 className="font-display text-xl font-semibold text-mist-100">
            No pudimos cargar este título
          </h1>

          <p className="mt-2 text-sm text-mist-500">
            {error instanceof Error
              ? error.message
              : "El título no existe."}
          </p>
        </div>
      </div>
    );
  }

  const { title, libraryEntry } = data;

  const total =
    title.type === "ANIME"
      ? title.totalEpisodes
      : title.totalChapters;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/library"
        className="inline-flex items-center gap-2 text-sm text-mist-500 transition hover:text-mist-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a biblioteca
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <div>
          <div className="overflow-hidden rounded-xl2 border border-ink-700 bg-ink-900">
            {title.coverUrl ? (
              <img
                src={title.coverUrl}
                alt={`Portada de ${title.title}`}
                className="aspect-[2/3] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[2/3] items-center justify-center text-sm text-mist-500">
                Sin portada
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-ember-500/10 px-3 py-1 text-xs font-medium text-ember-400">
              {title.type === "ANIME" ? "Anime" : "Manga"}
            </span>

            {title.year && (
              <span className="text-sm text-mist-500">
                {title.year}
              </span>
            )}

            {title.externalScore !== null && (
              <span className="text-sm font-semibold text-mist-100">
                ★ {title.externalScore.toFixed(1)}
              </span>
            )}
          </div>

          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-mist-100">
            {title.title}
          </h1>

          {title.titleJapanese && (
            <p className="mt-2 text-sm text-mist-500">
              {title.titleJapanese}
            </p>
          )}

          {title.synopsis && (
            <p className="mt-6 max-w-3xl text-sm leading-7 text-mist-300">
              {title.synopsis}
            </p>
          )}

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {total !== null && (
              <div className="rounded-xl border border-ink-700 bg-ink-900 p-4">
                <p className="text-xs text-mist-500">
                  {title.type === "ANIME"
                    ? "Episodios"
                    : "Capítulos"}
                </p>

                <p className="mt-1 text-xl font-semibold text-mist-100">
                  {total}
                </p>
              </div>
            )}

            {title.studioOrAuthor && (
              <div className="rounded-xl border border-ink-700 bg-ink-900 p-4">
                <p className="text-xs text-mist-500">
                  {title.type === "ANIME"
                    ? "Estudio"
                    : "Autor"}
                </p>

                <p className="mt-1 text-sm font-semibold text-mist-100">
                  {title.studioOrAuthor}
                </p>
              </div>
            )}

            {title.genres.length > 0 && (
              <div className="rounded-xl border border-ink-700 bg-ink-900 p-4 sm:col-span-2 lg:col-span-1">
                <p className="text-xs text-mist-500">
                  Géneros
                </p>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {title.genres
                    .slice(0, 4)
                    .map((genre: string) => (
                      <span
                        key={genre}
                        className="rounded-md bg-ink-800 px-2 py-1 text-xs text-mist-300"
                      >
                        {genre}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 rounded-xl2 border border-ink-700 bg-ink-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-mist-500">
                  Tu biblioteca
                </p>

                <p className="mt-1 font-display text-lg font-semibold text-mist-100">
                  {libraryEntry
                    ? `${libraryEntry.progress}${
                        total !== null
                          ? ` / ${total}`
                          : ""
                      }`
                    : "No añadido"}
                </p>
              </div>

              {libraryEntry?.rating !== null &&
                libraryEntry?.rating !== undefined && (
                  <div className="text-right">
                    <p className="text-xs text-mist-500">
                      Tu rating
                    </p>

                    <p className="mt-1 text-lg font-semibold text-ember-400">
                      ★ {libraryEntry.rating}
                    </p>
                  </div>
                )}
            </div>

            {libraryEntry && total !== null && (
              <>
                <div className="mt-4">
                  <div className="h-2 overflow-hidden rounded-full bg-ink-700">
                    <div
                      className="h-full rounded-full bg-ember-500 transition-all"
                      style={{
                        width: `${Math.min(
                          (libraryEntry.progress / total) *
                            100,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <ProgressControls
                  entryId={libraryEntry.id}
                  titleId={title.id}
                  currentProgress={libraryEntry.progress}
                  total={total}
                  
                  unit={
                    title.type === "ANIME"
                      ? "episodio"
                      : "capítulo"
                  }
                  
                />
                <LibraryEntryControls
                    entryId={libraryEntry.id}
                    titleId={title.id}
                    rating={libraryEntry.rating}
                    isFavorite={libraryEntry.isFavorite}
                />
                
              </>
            )}
          </div>

          <ProgressHistory
            items={libraryEntry?.history ?? []}
            unit={
              title.type === "ANIME"
                ? "episodio"
                : "capítulo"
            }
          />
          {libraryEntry && (
            <NotesSection
                entryId={libraryEntry.id}
                titleId={title.id}
                notes={libraryEntry.notes}
          />
)}
        </div>
      </div>
    </div>
  );
}