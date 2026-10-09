import type { LibraryStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export interface ProgressUpdateInput {
  currentProgress: number;
  total: number | null;
  delta?: number;
  manualValue?: number;
  currentStatus: LibraryStatus;
  mediaKind: "ANIME" | "MANGA";
}

export interface ProgressUpdateResult {
  newProgress: number;
  newStatus: LibraryStatus;
  justCompleted: boolean;
}

export function computeProgressUpdate(
  input: ProgressUpdateInput,
): ProgressUpdateResult {
  const {
    currentProgress,
    total,
    delta,
    manualValue,
    currentStatus,
    mediaKind,
  } = input;

  let newProgress =
    manualValue !== undefined
      ? manualValue
      : currentProgress + (delta ?? 0);

  if (newProgress < 0) {
    newProgress = 0;
  }

  if (total !== null && newProgress > total) {
    newProgress = total;
  }

  const reachedTotal =
    total !== null &&
    total > 0 &&
    newProgress >= total;

  const wasAlreadyCompleted =
    currentStatus === "COMPLETED";

  const justCompleted =
    reachedTotal && !wasAlreadyCompleted;

  let newStatus: LibraryStatus = currentStatus;

  if (justCompleted) {
    newStatus = "COMPLETED";
  } else if (
    newProgress > 0 &&
    (
      currentStatus === "PLAN_TO_WATCH" ||
      currentStatus === "PLAN_TO_READ"
    )
  ) {
    newStatus =
      mediaKind === "ANIME"
        ? "WATCHING"
        : "READING";
  }

  return {
    newProgress,
    newStatus,
    justCompleted,
  };
}

interface UpdateProgressParams {
  userId: string;
  entryId: string;
  delta?: number;
  manualValue?: number;
}

export async function updateLibraryProgress({
  userId,
  entryId,
  delta,
  manualValue,
}: UpdateProgressParams) {
  const entry =
    await prisma.userLibraryEntry.findFirst({
      where: {
        id: entryId,
        userId,
      },
      include: {
        title: {
          select: {
            type: true,
            totalEpisodes: true,
            totalChapters: true,
          },
        },
      },
    });

  if (!entry) {
    throw new Error(
      "Entrada de biblioteca no encontrada.",
    );
  }

  const total =
    entry.title.type === "ANIME"
      ? entry.title.totalEpisodes
      : entry.title.totalChapters;

  const result = computeProgressUpdate({
    currentProgress: entry.progress,
    total,
    delta,
    manualValue,
    currentStatus: entry.status,
    mediaKind: entry.title.type,
  });

  const updatedEntry =
    await prisma.$transaction(async (tx) => {
      const updated =
        await tx.userLibraryEntry.update({
          where: {
            id: entry.id,
          },
          data: {
            progress: result.newProgress,
            status: result.newStatus,
            ...(result.justCompleted && {
              finishedAt: new Date(),
            }),
          },
        });

      await tx.progressHistory.create({
        data: {
          entryId: entry.id,
          progress: result.newProgress,
        },
      });

      return updated;
    });

  return {
    entry: updatedEntry,
    ...result,
  };
}