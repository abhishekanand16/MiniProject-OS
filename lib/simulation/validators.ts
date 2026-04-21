import type { SchedulingMode, SimulationConfigThread } from "@/engine/types";
import type {
  InitSimulationPayload,
  ResetSimulationPayload,
  RunSimulationPayload,
  StepSimulationPayload,
} from "@/lib/simulation/contracts";

const modes: SchedulingMode[] = ["readerPriority", "writerPriority", "fair"];

function assertMode(mode: unknown): asserts mode is SchedulingMode {
  if (!modes.includes(mode as SchedulingMode)) {
    throw new Error("Invalid mode. Expected readerPriority, writerPriority, or fair.");
  }
}

function assertThread(thread: unknown): asserts thread is SimulationConfigThread {
  if (typeof thread !== "object" || thread === null) {
    throw new Error("Thread item must be an object.");
  }
  const candidate = thread as Record<string, unknown>;
  if (typeof candidate.id !== "string" || candidate.id.length === 0) {
    throw new Error("Thread id must be a non-empty string.");
  }
  if (candidate.role !== "reader" && candidate.role !== "writer") {
    throw new Error("Thread role must be reader or writer.");
  }
  if (typeof candidate.arrivalTick !== "number" || candidate.arrivalTick < 0) {
    throw new Error("Thread arrivalTick must be a non-negative number.");
  }
  if (typeof candidate.duration !== "number" || candidate.duration <= 0) {
    throw new Error("Thread duration must be a positive number.");
  }
}

export function validateInitPayload(payload: unknown): InitSimulationPayload {
  if (typeof payload !== "object" || payload === null) {
    throw new Error("Payload must be an object.");
  }
  const candidate = payload as Record<string, unknown>;
  assertMode(candidate.mode);
  if (typeof candidate.seed !== "number") {
    throw new Error("Seed must be a number.");
  }
  if (!Array.isArray(candidate.threads) || candidate.threads.length === 0) {
    throw new Error("Threads must be a non-empty array.");
  }
  candidate.threads.forEach(assertThread);
  if (
    candidate.autoAdvanceTicksPerStep !== undefined &&
    (typeof candidate.autoAdvanceTicksPerStep !== "number" || candidate.autoAdvanceTicksPerStep <= 0)
  ) {
    throw new Error("autoAdvanceTicksPerStep must be a positive number when provided.");
  }
  return {
    mode: candidate.mode,
    seed: candidate.seed,
    autoAdvanceTicksPerStep: candidate.autoAdvanceTicksPerStep as number | undefined,
    threads: candidate.threads,
  };
}

export function validateStepPayload(payload: unknown): StepSimulationPayload {
  if (typeof payload !== "object" || payload === null) {
    throw new Error("Payload must be an object.");
  }
  const candidate = payload as Record<string, unknown>;
  if (typeof candidate.simulationId !== "string" || candidate.simulationId.length === 0) {
    throw new Error("simulationId is required.");
  }
  if (candidate.tickDelta !== undefined && (typeof candidate.tickDelta !== "number" || candidate.tickDelta <= 0)) {
    throw new Error("tickDelta must be a positive number.");
  }
  if (candidate.mode !== undefined) {
    assertMode(candidate.mode);
  }
  return {
    simulationId: candidate.simulationId,
    tickDelta: candidate.tickDelta as number | undefined,
    mode: candidate.mode as SchedulingMode | undefined,
  };
}

export function validateRunPayload(payload: unknown): RunSimulationPayload {
  if (typeof payload !== "object" || payload === null) {
    throw new Error("Payload must be an object.");
  }
  const candidate = payload as Record<string, unknown>;
  if (typeof candidate.simulationId !== "string" || candidate.simulationId.length === 0) {
    throw new Error("simulationId is required.");
  }
  if (typeof candidate.ticks !== "number" || candidate.ticks <= 0) {
    throw new Error("ticks must be a positive number.");
  }
  if (candidate.mode !== undefined) {
    assertMode(candidate.mode);
  }
  return {
    simulationId: candidate.simulationId,
    ticks: candidate.ticks,
    mode: candidate.mode as SchedulingMode | undefined,
  };
}

export function validateResetPayload(payload: unknown): ResetSimulationPayload {
  if (typeof payload !== "object" || payload === null) {
    throw new Error("Payload must be an object.");
  }
  const candidate = payload as Record<string, unknown>;
  if (typeof candidate.simulationId !== "string" || candidate.simulationId.length === 0) {
    throw new Error("simulationId is required.");
  }
  return { simulationId: candidate.simulationId };
}
