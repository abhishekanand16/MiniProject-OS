import type { SimulationState } from "@/engine/types";

export type PolicyDecision = {
  nextReaders: string[];
  nextWriter: string | null;
};

export type PolicyModule = {
  decide(state: SimulationState): PolicyDecision;
};

import { fairPolicy } from "./fair";
import { readerPriorityPolicy } from "./readerPriority";
import { writerPriorityPolicy } from "./writerPriority";

const policyMap = {
  readerPriority: readerPriorityPolicy,
  writerPriority: writerPriorityPolicy,
  fair: fairPolicy,
} satisfies Record<SimulationState["mode"], PolicyModule>;

export function selectPolicy(mode: SimulationState["mode"]): PolicyModule {
  return policyMap[mode];
}
