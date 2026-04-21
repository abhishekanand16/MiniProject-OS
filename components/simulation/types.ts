export type SimulatorMode = "readerPriority" | "writerPriority" | "fair";
export type SpeedOption = "0.5x" | "1x" | "2x" | "4x";

export type ThreadRole = "reader" | "writer";
export type ThreadState =
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

export type ThreadVisual = {
  id: string;
  role: ThreadRole;
  state: ThreadState;
  arrivalTick: number;
  durationLabel: string;
  remainingLabel: string;
  queueIndex?: number;
  waitReason?: QueueReason;
};

export type LogTone = "system" | "reader" | "writer" | "warning";

export type LogEntryVisual = {
  id: string;
  tickLabel: string;
  title: string;
  detail: string;
  tone: LogTone;
};

export type StatCard = {
  label: string;
  value: string;
  trend: string;
  helper: string;
};

export type DatabaseVisualState = {
  status: "idle" | "reading" | "writing";
  readerCount: number;
  writerLabel: string | null;
  note: string;
};
