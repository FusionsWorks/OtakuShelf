import { prisma } from "@/lib/prisma";

export async function getStatsData(userId: string) {
  const [
    totalEntries,
    completedEntries,
    inProgressEntries,
    plannedEntries,
    onHoldEntries,
    droppedEntries,
    favoriteEntries,
    animeEntries,
    mangaEntries,
    ratingDistribution,
    history,
  ] = await Promise.all([
    prisma.userLibraryEntry.count({
      where: { userId },
    }),

    prisma.userLibraryEntry.count({
      where: {
        userId,
        status: "COMPLETED",
      },
    }),

    prisma.userLibraryEntry.count({
      where: {
        userId,
        status: {
          in: ["WATCHING", "READING"],
        },
      },
    }),

    prisma.userLibraryEntry.count({
      where: {
        userId,
        status: {
          in: ["PLAN_TO_WATCH", "PLAN_TO_READ"],
        },
      },
    }),

    prisma.userLibraryEntry.count({
      where: {
        userId,
        status: "ON_HOLD",
      },
    }),

    prisma.userLibraryEntry.count({
      where: {
        userId,
        status: "DROPPED",
      },
    }),

    prisma.userLibraryEntry.count({
      where: {
        userId,
        isFavorite: true,
      },
    }),

    prisma.userLibraryEntry.count({
      where: {
        userId,
        title: {
          type: "ANIME",
        },
      },
    }),

    prisma.userLibraryEntry.count({
      where: {
        userId,
        title: {
          type: "MANGA",
        },
      },
    }),

    prisma.userLibraryEntry.groupBy({
      by: ["rating"],
      where: {
        userId,
        rating: {
          not: null,
        },
      },
      _count: {
        rating: true,
      },
      orderBy: {
        rating: "asc",
      },
    }),

    prisma.progressHistory.findMany({
      where: {
        entry: {
          userId,
        },
      },
      orderBy: {
        recordedAt: "asc",
      },
      select: {
        progress: true,
        recordedAt: true,
        entry: {
          select: {
            title: {
              select: {
                title: true,
                type: true,
              },
            },
          },
        },
      },
    }),
  ]);

  return {
    overview: {
      total: totalEntries,
      completed: completedEntries,
      inProgress: inProgressEntries,
      planned: plannedEntries,
      onHold: onHoldEntries,
      dropped: droppedEntries,
      favorites: favoriteEntries,
    },

    media: {
      anime: animeEntries,
      manga: mangaEntries,
    },

    ratings: ratingDistribution.map((item) => ({
      rating: item.rating,
      count: item._count.rating,
    })),

    history,
  };
}