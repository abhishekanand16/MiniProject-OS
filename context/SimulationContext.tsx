"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type {
  SimulationConfigThread,
  SimulationEvent,
  SimulationState,
} from "@/engine/types";
import type {
  DatabaseVisualState,
  LogEntryVisual,
  LogTone,
  SimulatorMode,
  SpeedOption,
  StatCard,
  ThreadVisual,
} from "@/components/simulation/types";

const defaultThreads: SimulationConfigThread[] = [
  { id: "R-01", role: "reader", arrivalTick: 1, duration: 4 },
  { id: "R-02", role: "reader", arrivalTick: 2, duration: 5 },
  { id: "W-01", role: "writer", arrivalTick: 3, duration: 4 },
  { id: "R-03", role: "reader", arrivalTick: 4, duration: 3 },
  { id: "W-02", role: "writer", arrivalTick: 6, duration: 5 },
  { id: "R-04", role: "reader", arrivalTick: 7, duration: 2 },
];

const modeOptions: { value: SimulatorMode; label: string }[] = [
  { value: "readerPriority", label: "Readers first" },
  { value: "writerPriority", label: "Writers first" },
  { value: "fair", label: "Fair" },
];

const speedOptions: SpeedOption[] = ["0.5x", "1x", "2x", "4x"];
const speedToMs: Record<SpeedOption, number> = { "0.5x": 1600, "1x": 900, "2x": 450, "4x": 200 };

type SimulationContextValue = {
  mode: SimulatorMode;
  speed: SpeedOption;
  isRunning: boolean;
  isReady: boolean;
  tick: number;
  activeFilter: LogTone | "all";
  modeOptions: { value: SimulatorMode; label: string }[];
  speedOptions: SpeedOption[];
  queueThreads: ThreadVisual[];
  databaseState: DatabaseVisualState;
  threads: ThreadVisual[];
  statCards: StatCard[];
  filteredLogs: LogEntryVisual[];
  heroMetrics: { label: string; value: string }[];
  setMode: (mode: SimulatorMode) => Promise<void>;
  setSpeed: (speed: SpeedOption) => void;
  setActiveFilter: (filter: LogTone | "all") => void;
  step: () => Promise<void>;
  start: () => void;
  pause: () => void;
  reset: () => Promise<void>;
};

const SimulationContext = createContext<SimulationContextValue | null>(null);

function toThreadVisual(state: SimulationState): ThreadVisual[] {
  return state.threads.map((thread) => ({
    id: thread.id,
    role: thread.role,
    state: thread.state,
    arrivalTick: thread.arrivalTick,
    durationLabel: `${thread.duration} ticks`,
    remainingLabel: thread.state === "completed" ? "done" : `${thread.remaining} left`,
    queueIndex: thread.queueIndex,
    waitReason: thread.waitReason,
  }));
}

function toDatabaseVisual(state: SimulationState): DatabaseVisualState {
  if (state.lock.activeWriter) {
    return {
      status: "writing",
      readerCount: 0,
      writerLabel: state.lock.activeWriter,
      note: "Exclusive access is held by a writer.",
    };
  }
  if (state.lock.activeReaders.length > 0) {
    return {
      status: "reading",
      readerCount: state.lock.activeReaders.length,
      writerLabel: null,
      note: "Shared access is currently open for active readers.",
    };
  }
  return {
    status: "idle",
    readerCount: 0,
    writerLabel: null,
    note: "No active thread is currently holding the resource.",
  };
}

function toLogVisual(events: SimulationEvent[]): LogEntryVisual[] {
  return [...events]
    .reverse()
    .slice(0, 50)
    .map((entry) => ({
      id: entry.id,
      tickLabel: `tick ${entry.tick.toString().padStart(2, "0")}`,
      title: entry.title,
      detail: entry.detail,
      tone: entry.tone,
    }));
}

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SimulationState | null>(null);
  const [mode, setModeState] = useState<SimulatorMode>("fair");
  const [speed, setSpeed] = useState<SpeedOption>("1x");
  const [isRunning, setIsRunning] = useState(false);
  const [activeFilter, setActiveFilter] = useState<LogTone | "all">("all");
  const timerRef = useRef<number | null>(null);
  const stateRef = useRef<SimulationState | null>(null);
  const modeRef = useRef<SimulatorMode>(mode);
  const stepInFlightRef = useRef(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      const response = await fetch("/api/simulation/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "fair", seed: 42, autoAdvanceTicksPerStep: 1, threads: defaultThreads }),
      });
      const payload = (await response.json()) as { simulation: SimulationState };
      if (!cancelled) {
        setState(payload.simulation);
      }
    };

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const step = useCallback(async () => {
    const snapshot = stateRef.current;
    if (!snapshot || stepInFlightRef.current) {
      return;
    }
    stepInFlightRef.current = true;
    try {
      const response = await fetch("/api/simulation/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simulationId: snapshot.simulationId,
          tickDelta: 1,
          mode: modeRef.current,
        }),
      });
      const payload = (await response.json()) as { simulation: SimulationState };
      setState(payload.simulation);
      if (!payload.simulation.isRunning) {
        setIsRunning(false);
      }
    } finally {
      stepInFlightRef.current = false;
    }
  }, []);

  const reset = useCallback(async () => {
    const snapshot = stateRef.current;
    if (!snapshot) {
      const response = await fetch("/api/simulation/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: modeRef.current, seed: 42, autoAdvanceTicksPerStep: 1, threads: defaultThreads }),
      });
      const payload = (await response.json()) as { simulation: SimulationState };
      setState(payload.simulation);
      setIsRunning(false);
      return;
    }
    const response = await fetch("/api/simulation/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ simulationId: snapshot.simulationId }),
    });
    const payload = (await response.json()) as { simulation: SimulationState };
    setState(payload.simulation);
    setIsRunning(false);
    setActiveFilter("all");
  }, []);

  const setMode = useCallback(async (nextMode: SimulatorMode) => {
    setModeState(nextMode);
    modeRef.current = nextMode;
    const snapshot = stateRef.current;
    if (!snapshot) {
      return;
    }
    const response = await fetch("/api/simulation/step", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ simulationId: snapshot.simulationId, tickDelta: 0, mode: nextMode }),
    });
    if (response.ok) {
      const payload = (await response.json()) as { simulation: SimulationState };
      setState(payload.simulation);
    }
  }, []);

  const start = useCallback(() => {
    if (!stateRef.current) {
      return;
    }
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const intervalMs = speedToMs[speed];
    timerRef.current = window.setInterval(() => {
      void step();
    }, intervalMs);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, speed, step]);

  const visualThreads = useMemo(() => (state ? toThreadVisual(state) : []), [state]);
  const queueThreads = useMemo(
    () =>
      visualThreads
        .filter((thread) => thread.queueIndex !== undefined)
        .sort((a, b) => (a.queueIndex ?? 0) - (b.queueIndex ?? 0)),
    [visualThreads],
  );
  const logs = useMemo(() => (state ? toLogVisual(state.events) : []), [state]);
  const filteredLogs = useMemo(() => {
    if (activeFilter === "all") {
      return logs;
    }
    return logs.filter((entry) => entry.tone === activeFilter);
  }, [activeFilter, logs]);

  const value = useMemo<SimulationContextValue>(
    () => ({
      mode,
      speed,
      isRunning,
      isReady: state !== null,
      tick: state?.tick ?? 0,
      activeFilter,
      modeOptions,
      speedOptions,
      queueThreads,
      databaseState: state ? toDatabaseVisual(state) : toDatabaseVisual({
        simulationId: "empty",
        tick: 0,
        mode,
        seed: 0,
        queueOrder: [],
        lock: { activeReaders: [], activeWriter: null },
        threads: [],
        events: [],
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
      }),
      threads: visualThreads,
      statCards: [
        {
          label: "Average reader wait",
          value: `${(state?.stats.avgReaderWait ?? 0).toFixed(1)} ticks`,
          trend: `${state?.stats.activeReaders ?? 0} active`,
          helper: "Mean wait from arrival to first read access",
        },
        {
          label: "Average writer wait",
          value: `${(state?.stats.avgWriterWait ?? 0).toFixed(1)} ticks`,
          trend: `${state?.stats.queueLength ?? 0} queued`,
          helper: "Mean wait from arrival to exclusive lock acquisition",
        },
        {
          label: "Completed threads",
          value: `${state?.stats.completedThreads ?? 0}`,
          trend: `${((state?.stats.throughput ?? 0) * 100).toFixed(1)}%/tick`,
          helper: "Completion progress and throughput across the run",
        },
      ],
      filteredLogs,
      heroMetrics: [
        { label: "session", value: state?.simulationId.slice(0, 8) ?? "initializing" },
        { label: "view mode", value: mode },
        { label: "focus", value: "live scheduling" },
      ],
      setMode,
      setSpeed,
      setActiveFilter,
      step,
      start,
      pause,
      reset,
    }),
    [activeFilter, filteredLogs, isRunning, mode, pause, queueThreads, reset, setMode, speed, start, state, step, visualThreads],
  );

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

export function useSimulationContext(): SimulationContextValue {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error("useSimulationContext must be used within SimulationProvider.");
  }
  return context;
}
