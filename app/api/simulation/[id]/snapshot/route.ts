import { NextResponse } from "next/server";

import { getSnapshot } from "@/lib/simulation/service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    return NextResponse.json({ simulation: getSnapshot(id) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load snapshot." },
      { status: 404 },
    );
  }
}
