import type {
  DatabaseVisualState,
  LogEntryVisual,
  SimulatorMode,
  SpeedOption,
  StatCard,
  ThreadVisual,
} from "@/components/simulation/types";

// UI-only mock data. Engine integration should replace this file later.
export const modeOptions: { value: SimulatorMode; label: string }[] = [
  { value: "readerPriority", label: "Reader priority" },
  { value: "writerPriority", label: "Writer priority" },
  { value: "fair", label: "Fair FIFO" },
];

export const speedOptions: SpeedOption[] = ["0.5x", "1x", "2x", "4x"];

export const heroMetrics = [
  { label: "session", value: "lab demo / static" },
  { label: "view mode", value: "UI prototype" },
  { label: "focus", value: "queue behavior" },
];

export const databaseState: DatabaseVisualState = {
  status: "reading",
  readerCount: 3,
  writerLabel: null,
  note: "Shared resource is open to concurrent readers in this mock state.",
};

export const threads: ThreadVisual[] = [
  {
    id: "R-01",
    role: "reader",
    state: "reading",
    arrivalTick: 3,
    durationLabel: "6 ticks",
    remainingLabel: "2 left",
  },
  {
    id: "R-02",
    role: "reader",
    state: "reading",
    arrivalTick: 4,
    durationLabel: "5 ticks",
    remainingLabel: "3 left",
  },
  {
    id: "R-03",
    role: "reader",
    state: "waiting",
    arrivalTick: 7,
    durationLabel: "4 ticks",
    remainingLabel: "4 left",
    queueIndex: 2,
  },
  {
    id: "W-01",
    role: "writer",
    state: "blocked",
    arrivalTick: 5,
    durationLabel: "8 ticks",
    remainingLabel: "8 left",
    queueIndex: 1,
    waitReason: "readersActive",
  },
  {
    id: "W-02",
    role: "writer",
    state: "arriving",
    arrivalTick: 9,
    durationLabel: "7 ticks",
    remainingLabel: "7 left",
  },
  {
    id: "R-00",
    role: "reader",
    state: "completed",
    arrivalTick: 1,
    durationLabel: "3 ticks",
    remainingLabel: "done",
  },
];

export const queueThreads = threads
  .filter((thread) => thread.queueIndex)
  .sort((left, right) => (left.queueIndex ?? 0) - (right.queueIndex ?? 0));

export const logEntries: LogEntryVisual[] = [
  {
    id: "log-01",
    tickLabel: "tick 09",
    title: "Writer blocked",
    detail: "W-01 remains queued until all active readers release the resource.",
    tone: "warning",
  },
  {
    id: "log-02",
    tickLabel: "tick 08",
    title: "Reader admitted",
    detail: "R-02 joined the active reader batch with no writer holding the lock.",
    tone: "reader",
  },
  {
    id: "log-03",
    tickLabel: "tick 07",
    title: "Reader batch active",
    detail: "Shared database switched to read mode and now shows three concurrent readers.",
    tone: "system",
  },
  {
    id: "log-04",
    tickLabel: "tick 05",
    title: "Writer arrived",
    detail: "W-01 requested exclusive access and entered the waiting lane.",
    tone: "writer",
  },
];

export const statCards: StatCard[] = [
  {
    label: "Average reader wait",
    value: "1.4 ticks",
    trend: "+0.2",
    helper: "Mock KPI for future engine hookup",
  },
  {
    label: "Average writer wait",
    value: "3.8 ticks",
    trend: "-0.5",
    helper: "Styled to highlight queue pressure",
  },
  {
    label: "Completed threads",
    value: "12",
    trend: "+4",
    helper: "Static sample data for layout validation",
  },
];
