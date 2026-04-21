import { describe, expect, it } from "vitest";

import { getLogs, getSnapshot, initSimulation, resetSimulation, runSimulation, stepSimulation } from "@/lib/simulation/service";
import { validateInitPayload, validateRunPayload } from "@/lib/simulation/validators";

describe("simulation service contracts", () => {
  it("validates init payload and creates simulation", () => {
    const payload = validateInitPayload({
      mode: "fair",
      seed: 99,
      threads: [
        { id: "R1", role: "reader", arrivalTick: 1, duration: 2 },
        { id: "W1", role: "writer", arrivalTick: 2, duration: 2 },
      ],
    });
    const state = initSimulation(payload);
    expect(state.simulationId.length).toBeGreaterThan(0);
    expect(state.mode).toBe("fair");
  });

  it("steps and runs a simulation lifecycle", () => {
    const initialized = initSimulation(
      validateInitPayload({
        mode: "readerPriority",
        seed: 11,
        threads: [
          { id: "R1", role: "reader", arrivalTick: 1, duration: 1 },
          { id: "W1", role: "writer", arrivalTick: 2, duration: 1 },
        ],
      }),
    );

    const stepped = stepSimulation({ simulationId: initialized.simulationId, tickDelta: 1 });
    expect(stepped.tick).toBe(1);

    const ran = runSimulation(
      validateRunPayload({
        simulationId: initialized.simulationId,
        ticks: 5,
      }),
    );
    expect(ran.tick).toBeGreaterThanOrEqual(2);
    expect(getSnapshot(initialized.simulationId).simulationId).toBe(initialized.simulationId);
    expect(getLogs(initialized.simulationId).length).toBeGreaterThan(0);

    const reset = resetSimulation({ simulationId: initialized.simulationId });
    expect(reset.tick).toBe(0);
    expect(reset.threads.every((thread) => thread.state === "arriving")).toBe(true);
  });
});
