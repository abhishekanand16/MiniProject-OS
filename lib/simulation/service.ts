import { advanceSimulation, initializeSimulation } from "@/engine/simulationEngine";
import type { SchedulingMode, SimulationState } from "@/engine/types";
import { runStore } from "@/lib/persistence/runStore";
import type {
  InitSimulationPayload,
  ResetSimulationPayload,
  RunSimulationPayload,
  StepSimulationPayload,
} from "@/lib/simulation/contracts";

export function initSimulation(payload: InitSimulationPayload): SimulationState {
  const state = initializeSimulation({
    mode: payload.mode,
    seed: payload.seed,
    autoAdvanceTicksPerStep: payload.autoAdvanceTicksPerStep ?? 1,
    threads: payload.threads,
  });
  runStore.upsert(state);
  return state;
}

function getRequiredState(simulationId: string): SimulationState {
  const state = runStore.getState(simulationId);
  if (!state) {
    throw new Error(`Simulation ${simulationId} not found.`);
  }
  return state;
}

export function stepSimulation(payload: StepSimulationPayload): SimulationState {
  const state = getRequiredState(payload.simulationId);
  const mode: SchedulingMode = payload.mode ?? state.mode;
  const next = advanceSimulation(state, mode, payload.tickDelta ?? 1);
  runStore.upsert(next);
  return next;
}

export function runSimulation(payload: RunSimulationPayload): SimulationState {
  const state = getRequiredState(payload.simulationId);
  const mode: SchedulingMode = payload.mode ?? state.mode;
  const next = advanceSimulation(state, mode, payload.ticks);
  runStore.upsert(next);
  return next;
}

export function resetSimulation(payload: ResetSimulationPayload): SimulationState {
  const state = getRequiredState(payload.simulationId);
  const reset = initializeSimulation(
    {
      mode: state.mode,
      seed: state.seed,
      autoAdvanceTicksPerStep: 1,
      threads: state.threads.map((thread) => ({
        id: thread.id,
        role: thread.role,
        arrivalTick: thread.arrivalTick,
        duration: thread.duration,
      })),
    },
    state.simulationId,
  );
  runStore.upsert(reset);
  return reset;
}

export function getSnapshot(simulationId: string): SimulationState {
  return getRequiredState(simulationId);
}

export function getLogs(simulationId: string) {
  return runStore.getEvents(simulationId);
}
