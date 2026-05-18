"use client";

import { useMemo } from "react";

import { Badge } from "@/components/ui/Badge";
import { useSimulationContext } from "@/context/SimulationContext";

import { ControlPanel } from "./ControlPanel";
import { DatabaseView } from "./DatabaseView";
import { LogPanel } from "./LogPanel";
import { QueueView } from "./QueueView";
import { StatsPanel } from "./StatsPanel";
import { ThreadList } from "./ThreadList";

export function SimulationDashboard() {
  const {
    mode,
    speed,
    isRunning,
    isReady,
    tick,
    activeFilter,
    setMode,
    setSpeed,
    setActiveFilter,
    start,
    pause,
    reset,
    step,
    modeOptions,
    speedOptions,
    queueThreads,
    databaseState,
    threads,
    filteredLogs,
    statCards,
  } = useSimulationContext();

  const policyLabel = useMemo(() => {
    const match = modeOptions.find((option) => option.value === mode);
    return match?.label ?? mode;
  }, [mode, modeOptions]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:py-10">
      <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Readers–writers lab
          </h1>
          <p className="mt-1 max-w-xl text-sm text-slate-400">
            Step through a deterministic schedule: queue, lock, and threads update together.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={isRunning ? "success" : "warning"}>
            {isRunning ? "Running" : "Paused"}
          </Badge>
          <Badge tone="neutral">Tick {tick}</Badge>
          <Badge tone="info">{policyLabel}</Badge>
        </div>
      </header>

      <ControlPanel
        isRunning={isRunning}
        isReady={isReady}
        mode={mode}
        modeOptions={modeOptions}
        onModeChange={setMode}
        onPause={pause}
        onReset={() => void reset()}
        onSpeedChange={setSpeed}
        onStart={start}
        onStep={() => void step()}
        speed={speed}
        speedOptions={speedOptions}
        tick={tick}
      />

      <section className="grid items-start gap-6 lg:grid-cols-3">
        <QueueView queue={queueThreads} />
        <DatabaseView state={databaseState} />
        <ThreadList threads={threads} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <LogPanel
          activeFilter={activeFilter}
          logs={filteredLogs}
          onFilterChange={setActiveFilter}
        />
        <StatsPanel stats={statCards} />
      </section>
    </main>
  );
}
