import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getUserLibrary } from "@/services/library.service";
import { libraryQuerySchema } from "@/schemas/library.schema";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 },
      );
    }

    const params = Object.fromEntries(
      request.nextUrl.searchParams.entries(),
    );

    const parsed = libraryQuerySchema.safeParse(params);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Parámetros inválidos",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await getUserLibrary(
      session.user.id,
      parsed.data,
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/library", error);

    return NextResponse.json(
      { error: "No se pudo cargar la biblioteca" },
      { status: 500 },
    );
  }
}