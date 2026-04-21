import { NextResponse } from "next/server";

import { stepSimulation } from "@/lib/simulation/service";
import { validateStepPayload } from "@/lib/simulation/validators";

export async function POST(request: Request) {
  try {
    const payload = validateStepPayload(await request.json());
    const state = stepSimulation(payload);
    return NextResponse.json({ simulation: state });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to step simulation." },
      { status: 400 },
    );
  }
}
