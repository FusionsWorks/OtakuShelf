"use client";

import {
  BookOpen,
  CheckCircle2,
  Heart,
  Play,
} from "lucide-react";

import { StatCard } from "@/components/dashboard/StatCard";
import { ContinueCard } from "@/components/dashboard/ContinueCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="h-10 w-64 animate-pulse rounded bg-ink-800" />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-xl2 bg-ink-900"
            />
          ))}
        </div>

        <div className="mt-8 h-64 animate-pulse rounded-xl2 bg-ink-900" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-xl2 border border-red-900/50 bg-ink-900 p-8">
          <h1 className="font-display text-xl font-semibold text-white">
            No pudimos cargar tu dashboard
          </h1>

          <p className="mt-2 text-sm text-mist-300">
            Comprueba que hayas iniciado sesión y vuelve a intentarlo.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-10">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-ember-400">
          OtakuShelf
        </p>

        <h1 className="font-display text-4xl font-bold text-white">
          Tu biblioteca
        </h1>

        <p className="mt-3 max-w-2xl text-mist-300">
          Lleva el control de tus animes y mangas, descubre qué
          continuar y mantén organizada tu colección.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="En biblioteca"
          value={data.stats.total}
          icon={BookOpen}
        />

        <StatCard
          label="En progreso"
          value={data.stats.inProgress}
          icon={Play}
        />

        <StatCard
          label="Completados"
          value={data.stats.completed}
          icon={CheckCircle2}
        />

        <StatCard
          label="Favoritos"
          value={data.stats.favorites}
          icon={Heart}
        />
      </section>

      <section className="mt-10">
        <div className="mb-4">
          <h2 className="font-display text-xl font-semibold text-white">
            Continuar
          </h2>

          <p className="mt-1 text-sm text-mist-500">
            Retoma tus últimos animes y mangas.
          </p>
        </div>

        {data.continueWatching.length === 0 ? (
          <div className="rounded-xl2 border border-ink-700 bg-ink-900 p-8 text-sm text-mist-500">
            No tienes títulos en progreso todavía.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.continueWatching.map((item) => (
              <ContinueCard
                key={item.id}
                title={item.title.title}
                coverUrl={item.title.coverUrl}
                progress={item.progress}
                total={
                  item.title.type === "ANIME"
                    ? item.title.totalEpisodes
                    : item.title.totalChapters
                }
                type={item.title.type}
                status={item.status}
              />
            ))}
          </div>
        )}
      </section>

      <div className="mt-10">
        <RecentActivity activities={data.recentActivity} />
      </div>
    </main>
  );
}