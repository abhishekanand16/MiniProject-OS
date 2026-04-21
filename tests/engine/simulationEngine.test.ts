import { describe, expect, it } from "vitest";

import { advanceSimulation, initializeSimulation } from "@/engine/simulationEngine";

describe("simulation engine policies", () => {
  it("readerPriority allows reader batches first", () => {
    const base = initializeSimulation({
      mode: "readerPriority",
      seed: 1,
      autoAdvanceTicksPerStep: 1,
      threads: [
        { id: "R1", role: "reader", arrivalTick: 1, duration: 2 },
        { id: "W1", role: "writer", arrivalTick: 1, duration: 2 },
      ],
    });

    const next = advanceSimulation(base, "readerPriority", 1);
    expect(next.lock.activeReaders).toContain("R1");
    expect(next.lock.activeWriter).toBeNull();
  });

  it("writerPriority blocks readers when a writer is queued", () => {
    const base = initializeSimulation({
      mode: "writerPriority",
      seed: 2,
      autoAdvanceTicksPerStep: 1,
      threads: [
        { id: "R1", role: "reader", arrivalTick: 1, duration: 5 },
        { id: "W1", role: "writer", arrivalTick: 2, duration: 1 },
        { id: "R2", role: "reader", arrivalTick: 2, duration: 3 },
      ],
    });
    const afterTwo = advanceSimulation(base, "writerPriority", 2);
    const r2 = afterTwo.threads.find((thread) => thread.id === "R2");
    expect(r2?.state).toBe("blocked");
  });

  it("fair policy completes without starvation threshold errors", () => {
    const base = initializeSimulation({
      mode: "fair",
      seed: 3,
      autoAdvanceTicksPerStep: 1,
      threads: [
        { id: "R1", role: "reader", arrivalTick: 1, duration: 1 },
        { id: "W1", role: "writer", arrivalTick: 2, duration: 1 },
        { id: "R2", role: "reader", arrivalTick: 3, duration: 1 },
        { id: "W2", role: "writer", arrivalTick: 4, duration: 1 },
      ],
    });
    const completed = advanceSimulation(base, "fair", 10);
    expect(completed.threads.every((thread) => thread.state === "completed")).toBe(true);
  });
});
