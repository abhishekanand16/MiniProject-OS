import { NextResponse } from "next/server";

import { getLogs, getSnapshot } from "@/lib/simulation/service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    getSnapshot(id);
    return NextResponse.json({ logs: getLogs(id) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load logs." },
      { status: 404 },
    );
  }
}
