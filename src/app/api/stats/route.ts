import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getStatsData } from "@/services/stats.service";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 },
    );
  }

  try {
    const stats = await getStatsData(
      session.user.id,
    );

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Stats error:", error);

    return NextResponse.json(
      {
        error:
          "No pudimos cargar tus estadísticas.",
      },
      { status: 500 },
    );
  }
}