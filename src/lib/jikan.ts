const JIKAN_BASE = "https://api.jikan.moe/v4";

export interface ExternalTitleResult {
  externalId: number;
  type: "ANIME" | "MANGA";
  title: string;
  titleJapanese: string | null;
  coverUrl: string | null;
  synopsis: string | null;
  genres: string[];
  year: number | null;
  totalEpisodes: number | null;
  totalChapters: number | null;
  studioOrAuthor: string | null;
  externalScore: number | null;
}

// Jikan tiene rate limit (60 req/min, 3 req/s). En producción esto se
// debería envolver con una cola simple; para el alcance de este proyecto
// nos apoyamos en cachear resultados en la tabla Title y no repetir
// búsquedas idénticas en un corto periodo (ver services/library.service.ts).

export async function searchExternalTitles(
  query: string,
  type: "anime" | "manga"
): Promise<ExternalTitleResult[]> {
  const url = `${JIKAN_BASE}/${type}?q=${encodeURIComponent(query)}&limit=12&sfw=true`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Jikan search failed: ${res.status}`);
  }
  const json = await res.json();
  return json.data.map((item: any) => mapJikanItem(item, type));
}

export async function fetchExternalTitleById(
  externalId: number,
  type: "anime" | "manga"
): Promise<ExternalTitleResult> {
  const url = `${JIKAN_BASE}/${type}/${externalId}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Jikan fetch failed: ${res.status}`);
  }
  const json = await res.json();
  return mapJikanItem(json.data, type);
}

function mapJikanItem(item: any, type: "anime" | "manga"): ExternalTitleResult {
  const isAnime = type === "anime";
  return {
    externalId: item.mal_id,
    type: isAnime ? "ANIME" : "MANGA",
    title: item.title,
    titleJapanese: item.title_japanese ?? null,
    coverUrl: item.images?.jpg?.large_image_url ?? null,
    synopsis: item.synopsis ?? null,
    genres: (item.genres ?? []).map((g: any) => g.name),
    year: item.year ?? item.published?.prop?.from?.year ?? null,
    totalEpisodes: isAnime ? item.episodes ?? null : null,
    totalChapters: !isAnime ? item.chapters ?? null : null,
    studioOrAuthor: isAnime
      ? item.studios?.[0]?.name ?? null
      : item.authors?.[0]?.name ?? null,
    externalScore: item.score ?? null,
  };
}
