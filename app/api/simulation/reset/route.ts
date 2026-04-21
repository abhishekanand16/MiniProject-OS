import { NextResponse } from "next/server";

import { resetSimulation } from "@/lib/simulation/service";
import { validateResetPayload } from "@/lib/simulation/validators";

export async function POST(request: Request) {
  try {
    const payload = validateResetPayload(await request.json());
    const state = resetSimulation(payload);
    return NextResponse.json({ simulation: state });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to reset simulation." },
      { status: 400 },
    );
  }
}
