import { NextResponse } from "next/server";

import { initSimulation } from "@/lib/simulation/service";
import { validateInitPayload } from "@/lib/simulation/validators";

export async function POST(request: Request) {
  try {
    const payload = validateInitPayload(await request.json());
    const state = initSimulation(payload);
    return NextResponse.json({ simulation: state });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to initialize simulation." },
      { status: 400 },
    );
  }
}
