import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo1234", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@otakushelf.dev" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@otakushelf.dev",
      passwordHash,
      avatarUrl: null,
    },
  });

  const titles = [
    {
      externalId: 21,
      type: "ANIME" as const,
      title: "One Piece",
      titleJapanese: "ワンピース",
      coverUrl: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
      synopsis: "Monkey D. Luffy busca convertirse en el Rey de los Piratas.",
      genres: ["Action", "Adventure", "Fantasy"],
      year: 1999,
      totalEpisodes: null,
      totalChapters: null,
      studioOrAuthor: "Toei Animation",
      externalScore: 8.7,
    },
    {
      externalId: 37991,
      type: "ANIME" as const,
      title: "Vinland Saga",
      titleJapanese: "ヴィンランド・サガ",
      coverUrl: "https://cdn.myanimelist.net/images/anime/1500/103005.jpg",
      synopsis: "Un joven vikingo busca venganza en la Inglaterra del siglo XI.",
      genres: ["Action", "Drama", "Historical"],
      year: 2019,
      totalEpisodes: 24,
      totalChapters: null,
      studioOrAuthor: "Wit Studio",
      externalScore: 8.75,
    },
    {
      externalId: 52991,
      type: "ANIME" as const,
      title: "Frieren: Beyond Journey's End",
      titleJapanese: "葬送のフリーレン",
      coverUrl: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg",
      synopsis: "Una elfa maga reflexiona sobre el tiempo tras la muerte de sus compañeros.",
      genres: ["Adventure", "Drama", "Fantasy"],
      year: 2023,
      totalEpisodes: 28,
      totalChapters: null,
      studioOrAuthor: "Madhouse",
      externalScore: 9.3,
    },
    {
      externalId: 44511,
      type: "ANIME" as const,
      title: "Chainsaw Man",
      titleJapanese: "チェンソーマン",
      coverUrl: "https://cdn.myanimelist.net/images/anime/1806/126216.jpg",
      synopsis: "Denji fusiona su destino con un demonio motosierra.",
      genres: ["Action", "Horror"],
      year: 2022,
      totalEpisodes: 12,
      totalChapters: null,
      studioOrAuthor: "MAPPA",
      externalScore: 8.5,
    },
    {
      externalId: 2,
      type: "MANGA" as const,
      title: "Berserk",
      titleJapanese: "ベルセルク",
      coverUrl: "https://cdn.myanimelist.net/images/manga/1/157897.jpg",
      synopsis: "Guts, un guerrero solitario, lucha contra su destino maldito.",
      genres: ["Action", "Drama", "Psychological"],
      year: 1989,
      totalEpisodes: null,
      totalChapters: 364,
      studioOrAuthor: "Kentaro Miura",
      externalScore: 9.5,
    },
    {
      externalId: 656,
      type: "MANGA" as const,
      title: "Oyasumi Punpun",
      titleJapanese: "おやすみプンプン",
      coverUrl: "https://cdn.myanimelist.net/images/manga/3/70199.jpg",
      synopsis: "La vida de Punpun, contada con crudeza y simbolismo visual único.",
      genres: ["Drama", "Psychological", "Slice of Life"],
      year: 2007,
      totalEpisodes: null,
      totalChapters: 147,
      studioOrAuthor: "Inio Asano",
      externalScore: 8.6,
    },
  ];

  const createdTitles = [];
  for (const t of titles) {
    const created = await prisma.title.upsert({
      where: { externalId: t.externalId },
      update: {},
      create: t,
    });
    createdTitles.push(created);
  }

  const [onePiece, vinland, frieren, chainsaw, berserk, punpun] = createdTitles;

  const entries: { titleId: string; status: any; progress: number; rating: number | null; isFavorite: boolean }[] = [
    { titleId: onePiece.id, status: "WATCHING", progress: 1089, rating: null, isFavorite: true },
    { titleId: vinland.id, status: "PLAN_TO_WATCH", progress: 0, rating: null, isFavorite: false },
    { titleId: frieren.id, status: "COMPLETED", progress: 28, rating: 10, isFavorite: true },
    { titleId: chainsaw.id, status: "COMPLETED", progress: 12, rating: 9, isFavorite: false },
    { titleId: berserk.id, status: "READING", progress: 84, rating: null, isFavorite: true },
    { titleId: punpun.id, status: "PLAN_TO_READ", progress: 0, rating: null, isFavorite: false },
  ];

  for (const e of entries) {
    const entry = await prisma.userLibraryEntry.upsert({
      where: { userId_titleId: { userId: user.id, titleId: e.titleId } },
      update: {},
      create: { userId: user.id, ...e },
    });

    await prisma.progressHistory.create({
      data: { entryId: entry.id, progress: e.progress },
    });
  }

  console.log("Seed completado. Usuario demo: demo@otakushelf.dev / demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
