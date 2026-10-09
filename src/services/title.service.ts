import { prisma } from "@/lib/prisma";

export async function getTitleDetail(userId: string, titleId: string) {
  const title = await prisma.title.findUnique({
    where: { id: titleId },
    include: {
      libraryEntries: {
        where: { userId },
        include: {
          history: {
            orderBy: { recordedAt: "desc" },
            take: 20,
          },
          notes: {
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!title) {
    return null;
  }

  const libraryEntry = title.libraryEntries[0] ?? null;

  return {
    title,
    libraryEntry,
  };
}