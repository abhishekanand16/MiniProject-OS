import { NextResponse } from "next/server";

import { runSimulation } from "@/lib/simulation/service";
import { validateRunPayload } from "@/lib/simulation/validators";

export async function POST(request: Request) {
  try {
    const payload = validateRunPayload(await request.json());
    const state = runSimulation(payload);
    return NextResponse.json({ simulation: state });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to run simulation." },
      { status: 400 },
    );
  }
}
