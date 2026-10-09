import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createNoteSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "La nota no puede estar vacía.")
    .max(2000, "La nota es demasiado larga."),
});

interface RouteContext {
  params: {
    entryId: string;
  };
}

export async function POST(
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

  const parsed = createNoteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Datos de nota inválidos.",
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
      select: {
        id: true,
      },
    });

  if (!entry) {
    return NextResponse.json(
      {
        error:
          "Entrada de biblioteca no encontrada.",
      },
      { status: 404 },
    );
  }

  const note = await prisma.note.create({
    data: {
      userId: session.user.id,
      entryId: entry.id,
      content: parsed.data.content,
    },
  });

  return NextResponse.json(
    { note },
    { status: 201 },
  );
}

export async function DELETE(
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

  const url = new URL(request.url);
  const noteId = url.searchParams.get("noteId");

  if (!noteId) {
    return NextResponse.json(
      { error: "Falta el ID de la nota." },
      { status: 400 },
    );
  }

  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      entryId: params.entryId,
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!note) {
    return NextResponse.json(
      { error: "Nota no encontrada." },
      { status: 404 },
    );
  }

  await prisma.note.delete({
    where: {
      id: note.id,
    },
  });

  return NextResponse.json({
    success: true,
  });
}