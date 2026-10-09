import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateLibraryEntrySchema = z
  .object({
    rating: z
      .number()
      .int()
      .min(1)
      .max(10)
      .nullable()
      .optional(),

    isFavorite: z
      .boolean()
      .optional(),
  })
  .refine(
    (data) =>
      data.rating !== undefined ||
      data.isFavorite !== undefined,
    {
      message: "No hay cambios para actualizar.",
    },
  );

interface RouteContext {
  params: {
    entryId: string;
  };
}

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);

  const parsed =
    updateLibraryEntrySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Datos inválidos.",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const entry =
    await prisma.userLibraryEntry.findFirst({
      where: {
        id: params.entryId,
        userId: session.user.id,
      },
    });

  if (!entry) {
    return NextResponse.json(
      { error: "Entrada de biblioteca no encontrada." },
      { status: 404 },
    );
  }

  const updatedEntry =
    await prisma.userLibraryEntry.update({
      where: {
        id: entry.id,
      },
      data: {
        ...(parsed.data.rating !== undefined && {
          rating: parsed.data.rating,
        }),

        ...(parsed.data.isFavorite !== undefined && {
          isFavorite: parsed.data.isFavorite,
        }),
      },
    });

  return NextResponse.json({
    entry: updatedEntry,
  });
}