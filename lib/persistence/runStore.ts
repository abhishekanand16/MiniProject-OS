import type { SimulationConfig, SimulationEvent, SimulationState } from "@/engine/types";

export type RunMetadata = {
  simulationId: string;
  mode: SimulationConfig["mode"];
  seed: number;
  startedAt: string;
  endedAt: string | null;
  terminalReason: string | null;
};

type RunRecord = {
  metadata: RunMetadata;
  latestState: SimulationState;
  events: SimulationEvent[];
};

class RunStore {
  private readonly records = new Map<string, RunRecord>();

  upsert(state: SimulationState): void {
    const existing = this.records.get(state.simulationId);
    const metadata: RunMetadata = existing?.metadata ?? {
      simulationId: state.simulationId,
      mode: state.mode,
      seed: state.seed,
      startedAt: new Date().toISOString(),
      endedAt: null,
      terminalReason: null,
    };

    if (!state.isRunning && state.terminalReason) {
      metadata.endedAt = new Date().toISOString();
      metadata.terminalReason = state.terminalReason;
    }

    this.records.set(state.simulationId, {
      metadata,
      latestState: state,
      events: state.events,
    });
  }

  getState(simulationId: string): SimulationState | null {
    return this.records.get(simulationId)?.latestState ?? null;
  }

  getEvents(simulationId: string): SimulationEvent[] {
    return this.records.get(simulationId)?.events ?? [];
  }
}

export const runStore = new RunStore();
