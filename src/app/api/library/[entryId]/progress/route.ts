import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { updateLibraryProgress } from "@/services/progress.service";

const progressSchema = z
  .object({
    delta: z.number().int().optional(),
    manualValue: z.number().int().min(0).optional(),
  })
  .refine(
    (data) =>
      data.delta !== undefined ||
      data.manualValue !== undefined,
    {
      message: "Debes indicar delta o manualValue.",
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

  const parsed = progressSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Datos de progreso inválidos.",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const result = await updateLibraryProgress({
      userId: session.user.id,
      entryId: params.entryId,
      delta: parsed.data.delta,
      manualValue: parsed.data.manualValue,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Entrada de biblioteca no encontrada."
    ) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 },
      );
    }

    console.error("Progress update error:", error);

    return NextResponse.json(
      { error: "No pudimos actualizar el progreso." },
      { status: 500 },
    );
  }
}