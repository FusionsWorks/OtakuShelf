import type { LibraryStatus, MediaType } from "@prisma/client";

/** Vista simplificada de una entrada de biblioteca para el motor de reglas. */
export interface LibraryEntryForRecs {
  titleId: string;
  title: string;
  type: MediaType;
  genres: string[];
  status: LibraryStatus;
  rating: number | null;
  totalEpisodes: number | null;
  totalChapters: number | null;
  progress: number;
  addedAt: Date;
}

export interface Recommendation {
  titleId: string;
  title: string;
  score: number;
  reason: string;
}

const HIGH_RATING_THRESHOLD = 8;

/**
 * Calcula, a partir del historial puntuado del usuario, qué géneros
 * prefiere. Solo se consideran títulos completados y puntuados alto,
 * para no sesgar por cosas que aún no ha terminado de valorar.
 */
export function getFavoriteGenres(entries: LibraryEntryForRecs[]): string[] {
  const genreScores = new Map<string, { total: number; count: number }>();

  for (const entry of entries) {
    if (entry.status !== "COMPLETED" || entry.rating === null) continue;
    for (const genre of entry.genres) {
      const current = genreScores.get(genre) ?? { total: 0, count: 0 };
      current.total += entry.rating;
      current.count += 1;
      genreScores.set(genre, current);
    }
  }

  return [...genreScores.entries()]
    .map(([genre, { total, count }]) => ({ genre, avg: total / count }))
    .filter((g) => g.avg >= HIGH_RATING_THRESHOLD)
    .sort((a, b) => b.avg - a.avg)
    .map((g) => g.genre);
}

/**
 * Genera recomendaciones a partir de "plan to watch/read" pendientes,
 * priorizando los que comparten género con lo que el usuario más disfrutó.
 * Reglas usadas (en orden de peso):
 *  1. Coincidencia de género favorito (+3 por género compartido).
 *  2. Duración corta si el usuario tiende a dejar títulos largos sin acabar (+1).
 *  3. Progreso ya iniciado, para fomentar terminar lo empezado (+2).
 *  4. Antigüedad en la lista: cuanto más tiempo pendiente, más prioridad (+0.01/día).
 */
export function generateRecommendations(
  entries: LibraryEntryForRecs[],
  limit = 5
): Recommendation[] {
  const favoriteGenres = new Set(getFavoriteGenres(entries));
  const droppedLongSeries = entries.some(
    (e) => e.status === "DROPPED" && (e.totalEpisodes ?? 0) > 24
  );

  const pending = entries.filter(
    (e) => e.status === "PLAN_TO_WATCH" || e.status === "PLAN_TO_READ" || e.status === "ON_HOLD"
  );

  const scored: Recommendation[] = pending.map((entry) => {
    let score = 0;
    const reasons: string[] = [];

    const sharedGenres = entry.genres.filter((g) => favoriteGenres.has(g));
    if (sharedGenres.length > 0) {
      score += sharedGenres.length * 3;
      reasons.push(
        `has puntuado muy alto otros títulos de ${sharedGenres.slice(0, 2).join(" y ")}`
      );
    }

    const totalLength = entry.totalEpisodes ?? entry.totalChapters ?? 0;
    if (droppedLongSeries && totalLength > 0 && totalLength <= 13) {
      score += 1;
      reasons.push("es corto, y sueles abandonar series largas");
    }

    if (entry.progress > 0) {
      score += 2;
      reasons.push("ya lo empezaste, así que está a mitad de camino");
    }

    const daysPending = Math.floor(
      (Date.now() - entry.addedAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    score += daysPending * 0.01;

    return {
      titleId: entry.titleId,
      title: entry.title,
      score,
      reason: reasons.length > 0 ? reasons.join(", ") : "está en tu lista de pendientes",
    };
  });

  return scored
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
