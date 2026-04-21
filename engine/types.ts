export type ThreadRole = "reader" | "writer";
export type SchedulingMode = "readerPriority" | "writerPriority" | "fair";

export type ThreadLifecycleState =
  | "arriving"
  | "waiting"
  | "blocked"
  | "reading"
  | "writing"
  | "completed";

export type QueueReason =
  | "writerActive"
  | "readersActive"
  | "writerQueued"
  | "fairTurn";

export type SimulationThread = {
  id: string;
  role: ThreadRole;
  arrivalTick: number;
  duration: number;
  remaining: number;
  state: ThreadLifecycleState;
  queueIndex?: number;
  waitReason?: QueueReason;
  startedAtTick?: number;
  completedAtTick?: number;
};

export type SimulationLockState = {
  activeReaders: string[];
  activeWriter: string | null;
};

export type SimulationStats = {
  avgReaderWait: number;
  avgWriterWait: number;
  completedThreads: number;
  throughput: number;
  activeReaders: number;
  queueLength: number;
};

export type SimulationEventTone = "system" | "reader" | "writer" | "warning";

export type SimulationEvent = {
  id: string;
  tick: number;
  title: string;
  detail: string;
  tone: SimulationEventTone;
};

export type SimulationConfigThread = {
  id: string;
  role: ThreadRole;
  arrivalTick: number;
  duration: number;
};

export type SimulationConfig = {
  seed: number;
  mode: SchedulingMode;
  autoAdvanceTicksPerStep: number;
  threads: SimulationConfigThread[];
};

export type SimulationState = {
  simulationId: string;
  tick: number;
  mode: SchedulingMode;
  seed: number;
  queueOrder: string[];
  lock: SimulationLockState;
  threads: SimulationThread[];
  events: SimulationEvent[];
  stats: SimulationStats;
  isRunning: boolean;
  terminalReason: string | null;
};
