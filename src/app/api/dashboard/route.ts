import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getDashboardData } from "@/services/dashboard.service";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 },
    );
  }

  try {
    const data = await getDashboardData(session.user.id);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Dashboard error:", error);

    return NextResponse.json(
      { error: "No se pudo cargar el dashboard" },
      { status: 500 },
    );
  }
}