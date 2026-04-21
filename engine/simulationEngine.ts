import { selectPolicy } from "@/engine/policies";
import {
  type QueueReason,
  type SchedulingMode,
  type SimulationConfig,
  type SimulationState,
  type SimulationStats,
  type SimulationThread,
} from "@/engine/types";
import { nextEventId, seededShuffle } from "@/engine/utils";

function cloneState(state: SimulationState): SimulationState {
  return {
    ...state,
    lock: {
      activeReaders: [...state.lock.activeReaders],
      activeWriter: state.lock.activeWriter,
    },
    queueOrder: [...state.queueOrder],
    threads: state.threads.map((thread) => ({ ...thread })),
    events: [...state.events],
    stats: { ...state.stats },
  };
}

function computeWaitReason(thread: SimulationThread, state: SimulationState): QueueReason {
  if (state.lock.activeWriter) {
    return "writerActive";
  }
  if (thread.role === "writer" && state.lock.activeReaders.length > 0) {
    return "readersActive";
  }
  if (
    state.mode === "writerPriority" &&
    thread.role === "reader" &&
    state.queueOrder.some((id) => state.threads.find((item) => item.id === id)?.role === "writer")
  ) {
    return "writerQueued";
  }
  return "fairTurn";
}

function transitionOneTick(input: SimulationState): SimulationState {
  const state = cloneState(input);
  state.tick += 1;

  for (const thread of state.threads) {
    if (thread.arrivalTick === state.tick && thread.state === "arriving") {
      thread.state = "waiting";
      state.queueOrder.push(thread.id);
      state.events.push({
        id: nextEventId(),
        tick: state.tick,
        title: `${thread.role === "reader" ? "Reader" : "Writer"} arrived`,
        detail: `${thread.id} entered the waiting queue.`,
        tone: thread.role,
      });
    }
  }

  for (const readerId of [...state.lock.activeReaders]) {
    const thread = state.threads.find((item) => item.id === readerId);
    if (!thread) {
      continue;
    }
    thread.remaining -= 1;
    if (thread.remaining <= 0) {
      thread.state = "completed";
      thread.completedAtTick = state.tick;
      state.lock.activeReaders = state.lock.activeReaders.filter((id) => id !== thread.id);
      state.events.push({
        id: nextEventId(),
        tick: state.tick,
        title: "Reader completed",
        detail: `${thread.id} released shared access.`,
        tone: "reader",
      });
    }
  }

  if (state.lock.activeWriter) {
    const writer = state.threads.find((item) => item.id === state.lock.activeWriter);
    if (writer) {
      writer.remaining -= 1;
      if (writer.remaining <= 0) {
        writer.state = "completed";
        writer.completedAtTick = state.tick;
        state.events.push({
          id: nextEventId(),
          tick: state.tick,
          title: "Writer completed",
          detail: `${writer.id} released exclusive access.`,
          tone: "writer",
        });
        state.lock.activeWriter = null;
      }
    } else {
      state.lock.activeWriter = null;
    }
  }

  const policy = selectPolicy(state.mode);
  const decision = policy.decide(state);

  if (!state.lock.activeWriter && state.lock.activeReaders.length === 0 && decision.nextWriter) {
    const writer = state.threads.find((item) => item.id === decision.nextWriter);
    if (writer && (writer.state === "waiting" || writer.state === "blocked")) {
      writer.state = "writing";
      writer.startedAtTick ??= state.tick;
      state.lock.activeWriter = writer.id;
      state.queueOrder = state.queueOrder.filter((id) => id !== writer.id);
      state.events.push({
        id: nextEventId(),
        tick: state.tick,
        title: "Writer admitted",
        detail: `${writer.id} acquired exclusive access.`,
        tone: "writer",
      });
    }
  } else if (!state.lock.activeWriter && decision.nextReaders.length > 0) {
    for (const readerId of decision.nextReaders) {
      const reader = state.threads.find((item) => item.id === readerId);
      if (!reader || (reader.state !== "waiting" && reader.state !== "blocked")) {
        continue;
      }
      reader.state = "reading";
      reader.startedAtTick ??= state.tick;
      state.lock.activeReaders.push(reader.id);
      state.queueOrder = state.queueOrder.filter((id) => id !== reader.id);
    }
    if (decision.nextReaders.length > 0) {
      state.events.push({
        id: nextEventId(),
        tick: state.tick,
        title: "Reader batch admitted",
        detail: `${decision.nextReaders.length} reader(s) joined shared access.`,
        tone: "reader",
      });
    }
  }

  for (const queuedId of state.queueOrder) {
    const thread = state.threads.find((item) => item.id === queuedId);
    if (!thread) {
      continue;
    }
    thread.state = "blocked";
    thread.waitReason = computeWaitReason(thread, state);
  }

  for (const thread of state.threads) {
    if (thread.state === "arriving" || thread.state === "completed") {
      continue;
    }
    if (!state.queueOrder.includes(thread.id) && thread.state !== "reading" && thread.state !== "writing") {
      thread.state = "waiting";
      delete thread.waitReason;
      delete thread.queueIndex;
    }
  }

  state.queueOrder.forEach((id, idx) => {
    const thread = state.threads.find((item) => item.id === id);
    if (thread) {
      thread.queueIndex = idx + 1;
    }
  });

  state.stats = deriveStats(state);
  if (state.threads.every((thread) => thread.state === "completed")) {
    state.isRunning = false;
    state.terminalReason = "all_threads_completed";
  }

  enforceInvariants(state);
  return state;
}

export function initializeSimulation(config: SimulationConfig, simulationId = crypto.randomUUID()): SimulationState {
  const shuffled = seededShuffle(config.threads, config.seed);
  const threads: SimulationThread[] = shuffled.map((thread) => ({
    id: thread.id,
    role: thread.role,
    arrivalTick: thread.arrivalTick,
    duration: thread.duration,
    remaining: thread.duration,
    state: "arriving",
  }));

  const initial: SimulationState = {
    simulationId,
    tick: 0,
    mode: config.mode,
    seed: config.seed,
    queueOrder: [],
    lock: { activeReaders: [], activeWriter: null },
    threads,
    events: [
      {
        id: nextEventId(),
        tick: 0,
        title: "Simulation initialized",
        detail: `Mode: ${config.mode}, seed: ${config.seed}.`,
        tone: "system",
      },
    ],
    stats: {
      avgReaderWait: 0,
      avgWriterWait: 0,
      completedThreads: 0,
      throughput: 0,
      activeReaders: 0,
      queueLength: 0,
    },
    isRunning: false,
    terminalReason: null,
  };

  return initial;
}

export function advanceSimulation(
  state: SimulationState,
  mode: SchedulingMode,
  tickDelta: number,
): SimulationState {
  let next = cloneState({ ...state, mode });
  next.isRunning = true;
  for (let i = 0; i < tickDelta; i += 1) {
    next = transitionOneTick(next);
    if (!next.isRunning) {
      break;
    }
  }
  next.stats = deriveStats(next);
  return next;
}

export function deriveStats(state: SimulationState): SimulationStats {
  const readers = state.threads.filter((thread) => thread.role === "reader");
  const writers = state.threads.filter((thread) => thread.role === "writer");
  const readerWaits = readers
    .filter((thread) => thread.startedAtTick !== undefined)
    .map((thread) => (thread.startedAtTick ?? 0) - thread.arrivalTick);
  const writerWaits = writers
    .filter((thread) => thread.startedAtTick !== undefined)
    .map((thread) => (thread.startedAtTick ?? 0) - thread.arrivalTick);
  const completedThreads = state.threads.filter((thread) => thread.state === "completed").length;
  return {
    avgReaderWait: readerWaits.length ? readerWaits.reduce((a, b) => a + b, 0) / readerWaits.length : 0,
    avgWriterWait: writerWaits.length ? writerWaits.reduce((a, b) => a + b, 0) / writerWaits.length : 0,
    completedThreads,
    throughput: state.tick > 0 ? completedThreads / state.tick : 0,
    activeReaders: state.lock.activeReaders.length,
    queueLength: state.queueOrder.length,
  };
}

export function enforceInvariants(state: SimulationState): void {
  if (state.lock.activeWriter && state.lock.activeReaders.length > 0) {
    throw new Error("Invariant violated: writer cannot be active with readers.");
  }

  const activeWriters = state.threads.filter((thread) => thread.state === "writing");
  if (activeWriters.length > 1) {
    throw new Error("Invariant violated: concurrent writers are not allowed.");
  }

  if (state.mode === "fair") {
    const maxFairWait = 25;
    const starvationDetected = state.threads.some((thread) => {
      if (thread.state !== "blocked") {
        return false;
      }
      return state.tick - thread.arrivalTick > maxFairWait;
    });
    if (starvationDetected) {
      throw new Error("Invariant violated: fair policy starvation threshold exceeded.");
    }
  }
}
