import type { SchedulingMode, SimulationConfigThread } from "@/engine/types";

export type InitSimulationPayload = {
  mode: SchedulingMode;
  seed: number;
  autoAdvanceTicksPerStep?: number;
  threads: SimulationConfigThread[];
};

export type StepSimulationPayload = {
  simulationId: string;
  tickDelta?: number;
  mode?: SchedulingMode;
};

export type RunSimulationPayload = {
  simulationId: string;
  ticks: number;
  mode?: SchedulingMode;
};

export type ResetSimulationPayload = {
  simulationId: string;
};
