import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getTitleDetail } from "@/services/title.service";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 },
    );
  }

  const result = await getTitleDetail(
    session.user.id,
    params.id,
  );

  if (!result) {
    return NextResponse.json(
      { error: "Título no encontrado" },
      { status: 404 },
    );
  }

  return NextResponse.json(result);
}