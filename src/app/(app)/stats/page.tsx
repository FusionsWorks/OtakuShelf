"use client";

import {
  CheckCircle2,
  Clock3,
  Heart,
  Library,
  PauseCircle,
  PlayCircle,
  Star,
  XCircle,
} from "lucide-react";

import { Skeleton } from "@/components/ui/Skeleton";
import { useStats } from "@/hooks/useStats";

export default function StatsPage() {
  const {
    data,
    isPending,
    isError,
    error,
  } = useStats();

  if (isPending) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-80" />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map(
            (_, index) => (
              <Skeleton
                key={index}
                className="h-32 rounded-xl2"
              />
            ),
          )}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl2 border border-red-500/20 bg-red-500/5 p-8 text-center">
          <h1 className="font-display text-xl font-semibold text-mist-100">
            No pudimos cargar tus estadísticas
          </h1>

          <p className="mt-2 text-sm text-mist-500">
            {error instanceof Error
              ? error.message
              : "Ocurrió un error inesperado."}
          </p>
        </div>
      </div>
    );
  }

  const { overview, media } = data;

  const cards = [
    {
      label: "Total",
      value: overview.total,
      icon: Library,
      description: "Títulos en tu biblioteca",
    },
    {
      label: "Completados",
      value: overview.completed,
      icon: CheckCircle2,
      description: "Títulos terminados",
    },
    {
      label: "En progreso",
      value: overview.inProgress,
      icon: PlayCircle,
      description: "Actualmente activos",
    },
    {
      label: "Pendientes",
      value: overview.planned,
      icon: Clock3,
      description: "Para ver o leer",
    },
    {
      label: "En pausa",
      value: overview.onHold,
      icon: PauseCircle,
      description: "Títulos pausados",
    },
    {
      label: "Abandonados",
      value: overview.dropped,
      icon: XCircle,
      description: "Títulos abandonados",
    },
    {
      label: "Favoritos",
      value: overview.favorites,
      icon: Heart,
      description: "Marcados como favoritos",
    },
    {
      label: "Anime + Manga",
      value: media.anime + media.manga,
      icon: Star,
      description: `${media.anime} anime · ${media.manga} manga`,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-ember-400">
          Tu biblioteca
        </p>

        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-mist-100 sm:text-4xl">
          Estadísticas
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-mist-500">
          Una vista general de todo lo que has visto,
          leído y guardado en OtakuShelf.
        </p>
      </header>

      <section
        aria-label="Resumen de estadísticas"
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.label}
              className="rounded-xl2 border border-ink-700 bg-ink-900 p-5 transition hover:border-ink-600"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-ink-800 p-2.5">
                  <Icon
                    className="h-5 w-5 text-ember-400"
                    aria-hidden="true"
                  />
                </div>

                <span className="font-display text-2xl font-bold text-mist-100">
                  {card.value}
                </span>
              </div>

              <h2 className="mt-5 text-sm font-semibold text-mist-100">
                {card.label}
              </h2>

              <p className="mt-1 text-xs text-mist-500">
                {card.description}
              </p>
            </article>
          );
        })}
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl2 border border-ink-700 bg-ink-900 p-5">
          <h2 className="font-display text-lg font-semibold text-mist-100">
            Distribución
          </h2>

          <p className="mt-1 text-sm text-mist-500">
            Anime y manga en tu biblioteca.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-mist-300">
                  Anime
                </span>

                <span className="font-medium text-mist-100">
                  {media.anime}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-ink-700">
                <div
                  className="h-full rounded-full bg-ember-500 transition-all"
                  style={{
                    width: `${
                      overview.total > 0
                        ? (media.anime /
                            overview.total) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-mist-300">
                  Manga
                </span>

                <span className="font-medium text-mist-100">
                  {media.manga}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-ink-700">
                <div
                  className="h-full rounded-full bg-ember-400 transition-all"
                  style={{
                    width: `${
                      overview.total > 0
                        ? (media.manga /
                            overview.total) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-xl2 border border-ink-700 bg-ink-900 p-5">
          <h2 className="font-display text-lg font-semibold text-mist-100">
            Estados
          </h2>

          <p className="mt-1 text-sm text-mist-500">
            Cómo está distribuida actualmente tu
            biblioteca.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-ink-800 p-4">
              <p className="text-xs text-mist-500">
                Completados
              </p>
              <p className="mt-1 text-xl font-bold text-mist-100">
                {overview.completed}
              </p>
            </div>

            <div className="rounded-lg bg-ink-800 p-4">
              <p className="text-xs text-mist-500">
                En progreso
              </p>
              <p className="mt-1 text-xl font-bold text-mist-100">
                {overview.inProgress}
              </p>
            </div>

            <div className="rounded-lg bg-ink-800 p-4">
              <p className="text-xs text-mist-500">
                Pendientes
              </p>
              <p className="mt-1 text-xl font-bold text-mist-100">
                {overview.planned}
              </p>
            </div>

            <div className="rounded-lg bg-ink-800 p-4">
              <p className="text-xs text-mist-500">
                Favoritos
              </p>
              <p className="mt-1 text-xl font-bold text-mist-100">
                {overview.favorites}
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}