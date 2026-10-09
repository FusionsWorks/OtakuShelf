"use client";

import {
  ArrowDownAZ,
  ArrowDownUp,
  ArrowUpAZ,
  Heart,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

interface LibraryFiltersProps {
  search: string;
  status: string;
  type: "" | "ANIME" | "MANGA";
  favorite: boolean;
  sort: "updatedAt" | "addedAt" | "title" | "rating" | "progress";
  order: "asc" | "desc";

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onTypeChange: (value: "" | "ANIME" | "MANGA") => void;
  onFavoriteChange: (value: boolean) => void;
  onSortChange: (
    value: "updatedAt" | "addedAt" | "title" | "rating" | "progress",
  ) => void;
  onOrderChange: (value: "asc" | "desc") => void;
  onClear: () => void;
}

const statuses = [
  ["", "Todos los estados"],
  ["WATCHING", "Viendo"],
  ["READING", "Leyendo"],
  ["COMPLETED", "Completados"],
  ["PLAN_TO_WATCH", "Plan: ver"],
  ["PLAN_TO_READ", "Plan: leer"],
  ["ON_HOLD", "En pausa"],
  ["DROPPED", "Abandonados"],
];

export function LibraryFilters({
  search,
  status,
  type,
  favorite,
  sort,
  order,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onFavoriteChange,
  onSortChange,
  onOrderChange,
  onClear,
}: LibraryFiltersProps) {
  const hasFilters =
    search !== "" ||
    status !== "" ||
    type !== "" ||
    favorite;

  const sortLabel = {
    updatedAt: "Actualización",
    addedAt: "Añadidos",
    title: "Título",
    rating: "Rating",
    progress: "Progreso",
  }[sort];

  return (
    <section className="rounded-xl2 border border-ink-700 bg-ink-900 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-ember-500/10 p-2">
            <SlidersHorizontal className="h-4 w-4 text-ember-400" />
          </div>

          <div>
            <h2 className="font-display text-sm font-semibold text-mist-100">
              Filtrar biblioteca
            </h2>

            <p className="hidden text-xs text-mist-500 sm:block">
              Encuentra rápidamente lo que buscas.
            </p>
          </div>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-mist-500 transition hover:bg-ink-800 hover:text-ember-400"
          >
            <X className="h-3.5 w-3.5" />
            Limpiar
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <label className="relative block sm:col-span-2 lg:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500" />

          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por título..."
            aria-label="Buscar en biblioteca"
            className="h-11 w-full rounded-lg border border-ink-700 bg-ink-800 pl-10 pr-3 text-sm text-mist-100 outline-none transition placeholder:text-mist-500 focus:border-ember-500 focus:ring-1 focus:ring-ember-500/20"
          />
        </label>

        {/* Status */}
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          aria-label="Filtrar por estado"
          className="h-11 rounded-lg border border-ink-700 bg-ink-800 px-3 text-sm text-mist-100 outline-none transition focus:border-ember-500 focus:ring-1 focus:ring-ember-500/20"
        >
          {statuses.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        {/* Type */}
        <select
          value={type}
          onChange={(event) =>
            onTypeChange(
              event.target.value as "" | "ANIME" | "MANGA",
            )
          }
          aria-label="Filtrar por tipo"
          className="h-11 rounded-lg border border-ink-700 bg-ink-800 px-3 text-sm text-mist-100 outline-none transition focus:border-ember-500 focus:ring-1 focus:ring-ember-500/20"
        >
          <option value="">Anime + Manga</option>
          <option value="ANIME">Solo anime</option>
          <option value="MANGA">Solo manga</option>
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(event) =>
            onSortChange(
              event.target.value as
                | "updatedAt"
                | "addedAt"
                | "title"
                | "rating"
                | "progress",
            )
          }
          aria-label="Ordenar biblioteca"
          className="h-11 rounded-lg border border-ink-700 bg-ink-800 px-3 text-sm text-mist-100 outline-none transition focus:border-ember-500 focus:ring-1 focus:ring-ember-500/20"
        >
          <option value="updatedAt">Última actualización</option>
          <option value="addedAt">Más recientes</option>
          <option value="title">Título</option>
          <option value="rating">Rating</option>
          <option value="progress">Progreso</option>
        </select>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-ink-700 pt-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Favorite */}
        <button
          type="button"
          onClick={() => onFavoriteChange(!favorite)}
          aria-pressed={favorite}
          className={[
            "inline-flex w-fit items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition",
            favorite
              ? "border-ember-500/40 bg-ember-500/10 text-ember-400"
              : "border-ink-700 bg-ink-800 text-mist-300 hover:border-ink-600 hover:text-mist-100",
          ].join(" ")}
        >
          <Heart
            className="h-4 w-4"
            fill={favorite ? "currentColor" : "none"}
          />
          Solo favoritos
        </button>

        {/* Order */}
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-mist-500 sm:inline">
            Orden: {sortLabel}
          </span>

          <button
            type="button"
            onClick={() =>
              onOrderChange(order === "asc" ? "desc" : "asc")
            }
            aria-label={`Orden ${order === "asc" ? "ascendente" : "descendente"}. Cambiar orden`}
            className="inline-flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-800 px-3 py-2 text-xs font-medium text-mist-300 transition hover:border-ember-500/50 hover:text-mist-100"
          >
            {sort === "title" ? (
              order === "asc" ? (
                <ArrowDownAZ className="h-4 w-4" />
              ) : (
                <ArrowUpAZ className="h-4 w-4" />
              )
            ) : (
              <ArrowDownUp className="h-4 w-4" />
            )}

            {order === "asc" ? "Ascendente" : "Descendente"}
          </button>
        </div>
      </div>
    </section>
  );
}