import type { PolicyModule } from "@/engine/policies";
import type { SimulationState } from "@/engine/types";

export const fairPolicy: PolicyModule = {
  decide(state) {
    if (state.lock.activeWriter) {
      return { nextReaders: [], nextWriter: null };
    }

    const firstQueuedId = state.queueOrder[0];
    if (!firstQueuedId) {
      return { nextReaders: [], nextWriter: null };
    }

    const firstThread = state.threads.find((thread) => thread.id === firstQueuedId);
    if (!firstThread) {
      return { nextReaders: [], nextWriter: null };
    }

    if (firstThread.role === "writer") {
      if (state.lock.activeReaders.length > 0) {
        return { nextReaders: [], nextWriter: null };
      }

      return { nextReaders: [], nextWriter: firstThread.id };
    }

    const contiguousReaders: string[] = [];
    for (const id of state.queueOrder) {
      const thread = state.threads.find((item) => item.id === id);
      if (!thread || thread.role !== "reader") {
        break;
      }
      contiguousReaders.push(id);
    }

    return { nextReaders: contiguousReaders, nextWriter: null };
  },
};
