"use client";

import Link from "next/link";
import { Heart, Star } from "lucide-react";

import { Badge } from "@/components/ui/Badge";

interface TitleCardProps {
  entry: {
    id: string;
    status: string;
    progress: number;
    rating: number | null;
    isFavorite: boolean;

    title: {
      id: string;
      type: "ANIME" | "MANGA";
      title: string;
      coverUrl: string | null;
      year: number | null;
      totalEpisodes: number | null;
      totalChapters: number | null;
      externalScore: number | null;
    };
  };
}

const statusLabels: Record<string, string> = {
  WATCHING: "Viendo",
  READING: "Leyendo",
  COMPLETED: "Completado",
  PLAN_TO_WATCH: "Pendiente",
  PLAN_TO_READ: "Pendiente",
  ON_HOLD: "En pausa",
  DROPPED: "Abandonado",
};

export function TitleCard({ entry }: TitleCardProps) {
  const total =
    entry.title.type === "ANIME"
      ? entry.title.totalEpisodes
      : entry.title.totalChapters;

  const progressPercentage =
    total && total > 0
      ? Math.min((entry.progress / total) * 100, 100)
      : 0;

  const progressUnit =
    entry.title.type === "ANIME" ? "episodios" : "capítulos";

  return (
    <Link
      href={`/title/${entry.title.id}`}
      className="group block"
      aria-label={`Ver detalles de ${entry.title.title}`}
    >
      <article className="overflow-hidden rounded-xl2 border border-ink-700 bg-ink-900 transition duration-200 hover:-translate-y-1 hover:border-ember-500/50 hover:shadow-lg hover:shadow-black/20">
        <div className="relative aspect-[2/3] overflow-hidden bg-ink-800">
          {entry.title.coverUrl ? (
            <img
              src={entry.title.coverUrl}
              alt={`Portada de ${entry.title.title}`}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-mist-500">
              Sin portada
            </div>
          )}

          <div className="absolute left-3 top-3">
            <Badge variant="accent">
              {statusLabels[entry.status] ?? entry.status}
            </Badge>
          </div>

          {entry.isFavorite && (
            <div
              className="absolute right-3 top-3 rounded-full bg-ink-950/85 p-2 backdrop-blur"
              title="Favorito"
            >
              <Heart
                className="h-4 w-4 fill-current text-ember-400"
                aria-hidden="true"
              />
              <span className="sr-only">Favorito</span>
            </div>
          )}

          {(entry.rating !== null ||
            entry.title.externalScore !== null) && (
            <div className="absolute bottom-3 left-3 flex gap-2">
              {entry.rating !== null && (
                <div
                  className="flex items-center gap-1 rounded-full bg-ink-950/90 px-2.5 py-1 text-xs font-semibold text-mist-100 backdrop-blur"
                  title="Tu valoración"
                >
                  <Star
                    className="h-3.5 w-3.5 fill-current text-ember-400"
                    aria-hidden="true"
                  />
                  {entry.rating}
                </div>
              )}

              {entry.title.externalScore !== null && (
                <div
                  className="rounded-full bg-ink-950/90 px-2.5 py-1 text-xs font-semibold text-mist-100 backdrop-blur"
                  title="Puntuación externa"
                >
                  ★ {entry.title.externalScore.toFixed(1)}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="line-clamp-2 min-h-[3rem] font-display text-sm font-semibold text-mist-100">
            {entry.title.title}
          </h3>

          <div className="mt-2 flex items-center gap-2 text-xs text-mist-500">
            <span>
              {entry.title.type === "ANIME" ? "Anime" : "Manga"}
            </span>

            {entry.title.year && (
              <>
                <span aria-hidden="true">•</span>
                <span>{entry.title.year}</span>
              </>
            )}
          </div>

          {total !== null && (
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-mist-500">
                <span>Progreso</span>

                <span>
                  {entry.progress}/{total}
                </span>
              </div>

              <div
                className="h-1.5 overflow-hidden rounded-full bg-ink-700"
                role="progressbar"
                aria-label={`Progreso de ${entry.title.title}`}
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={Math.min(entry.progress, total)}
              >
                <div
                  className="h-full rounded-full bg-ember-500 transition-all"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                />
              </div>

              <p className="mt-1.5 text-[11px] text-mist-500">
                {progressPercentage.toFixed(0)}% · {progressUnit}
              </p>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}