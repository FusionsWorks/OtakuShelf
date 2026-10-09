import type { LibraryStatus, MediaType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { LibraryQuery } from "@/schemas/library.schema";

export async function getUserLibrary(
  userId: string,
  query: LibraryQuery,
) {
  const {
    status,
    type,
    favorite,
    search,
    sort,
    order,
    page,
    limit,
  } = query;

  const titleWhere = {
  ...(type && {
    type: type as MediaType,
  }),

  ...(search && {
    OR: [
      {
        title: {
          contains: search,
          mode: "insensitive" as const,
        },
      },
      {
        titleJapanese: {
          contains: search,
          mode: "insensitive" as const,
        },
      },
    ],
  }),
};

const where = {
  userId,

  ...(status && {
    status: status as LibraryStatus,
  }),

  ...(favorite !== undefined && {
    isFavorite: favorite,
  }),

  ...(Object.keys(titleWhere).length > 0 && {
    title: titleWhere,
  }),
};

  const orderBy = (() => {
    switch (sort) {
      case "title":
        return {
          title: {
            title: order,
          },
        };

      case "rating":
        return {
          rating: order,
        };

      case "progress":
        return {
          progress: order,
        };

      case "addedAt":
        return {
          addedAt: order,
        };

      case "updatedAt":
      default:
        return {
          updatedAt: order,
        };
    }
  })();

  const [entries, total] = await prisma.$transaction([
    prisma.userLibraryEntry.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,

      select: {
        id: true,
        status: true,
        progress: true,
        rating: true,
        isFavorite: true,
        startedAt: true,
        finishedAt: true,
        addedAt: true,
        updatedAt: true,

        title: {
          select: {
            id: true,
            externalId: true,
            type: true,
            title: true,
            titleJapanese: true,
            coverUrl: true,
            year: true,
            totalEpisodes: true,
            totalChapters: true,
            externalScore: true,
          },
        },
      },
    }),

    prisma.userLibraryEntry.count({
      where,
    }),
  ]);

  return {
    entries,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
}