import { prisma } from "@/lib/prisma";

export async function getDashboardData(userId: string) {
  const [
    totalEntries,
    completedEntries,
    favoriteEntries,
    inProgressEntries,
    continueEntries,
    recentActivity,
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
        isFavorite: true,
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

    prisma.userLibraryEntry.findMany({
      where: {
        userId,
        status: {
          in: ["WATCHING", "READING"],
        },
        progress: {
          gt: 0,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 6,
      select: {
        id: true,
        progress: true,
        status: true,
        updatedAt: true,
        title: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
            type: true,
            totalEpisodes: true,
            totalChapters: true,
          },
        },
      },
    }),

    prisma.progressHistory.findMany({
      where: {
        entry: {
          userId,
        },
      },
      orderBy: {
        recordedAt: "desc",
      },
      take: 8,
      select: {
        id: true,
        progress: true,
        recordedAt: true,
        entry: {
          select: {
            id: true,
            status: true,
            title: {
              select: {
                title: true,
                coverUrl: true,
                type: true,
              },
            },
          },
        },
      },
    }),
  ]);

  return {
    stats: {
      total: totalEntries,
      completed: completedEntries,
      favorites: favoriteEntries,
      inProgress: inProgressEntries,
    },
    continueWatching: continueEntries,
    recentActivity,
  };
}