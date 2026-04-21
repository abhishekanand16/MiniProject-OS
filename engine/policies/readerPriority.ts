import type { PolicyModule } from "@/engine/policies";
import type { SimulationState } from "@/engine/types";

function waitingReaders(state: SimulationState): string[] {
  return state.queueOrder.filter((id) => {
    const thread = state.threads.find((item) => item.id === id);
    return thread?.role === "reader";
  });
}

function waitingWriters(state: SimulationState): string[] {
  return state.queueOrder.filter((id) => {
    const thread = state.threads.find((item) => item.id === id);
    return thread?.role === "writer";
  });
}

export const readerPriorityPolicy: PolicyModule = {
  decide(state) {
    if (state.lock.activeWriter) {
      return { nextReaders: [], nextWriter: null };
    }

    const readers = waitingReaders(state);
    if (readers.length > 0) {
      return { nextReaders: readers, nextWriter: null };
    }

    const [writer] = waitingWriters(state);
    return { nextReaders: [], nextWriter: writer ?? null };
  },
};
