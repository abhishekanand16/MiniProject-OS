import type { PolicyModule } from "@/engine/policies";
import type { SimulationState } from "@/engine/types";

export const writerPriorityPolicy: PolicyModule = {
  decide(state) {
    if (state.lock.activeWriter) {
      return { nextReaders: [], nextWriter: null };
    }

    const queue = state.queueOrder
      .map((id) => state.threads.find((item) => item.id === id))
      .filter((item) => Boolean(item));

    const firstWriter = queue.find((thread) => thread?.role === "writer");
    if (firstWriter) {
      if (state.lock.activeReaders.length > 0) {
        return { nextReaders: [], nextWriter: null };
      }

      return { nextReaders: [], nextWriter: firstWriter.id };
    }

    const readers = queue.filter((thread) => thread?.role === "reader").map((thread) => thread!.id);
    return { nextReaders: readers, nextWriter: null };
  },
};
