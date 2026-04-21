"use client";

import { MotionConfig, motion } from "framer-motion";

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
    heroMetrics,
  } = useSimulationContext();

  return (
    <MotionConfig reducedMotion="user">
      <main className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <motion.header
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(2,6,23,0.95))] p-8 shadow-[0_24px_80px_rgba(2,6,23,0.5)]"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.2),transparent_58%)] lg:block" />
        <div className="relative grid gap-8 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <Badge tone="info">OS lab dashboard</Badge>
              <Badge tone={isRunning ? "success" : "warning"}>
                {isRunning ? "simulation running" : "simulation paused"}
              </Badge>
              <Badge tone="neutral">backend connected</Badge>
            </div>

            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.26em] text-slate-400">
                Readers-Writers visual simulator
              </p>
              <div className="max-w-4xl space-y-3">
                <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  Industrial teaching UI for explaining lock contention and access flow.
                </h1>
                <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
                  The interface now streams deterministic scheduling state from the simulation
                  engine while preserving the original UI/UX design for teaching, demos, and
                  visual clarity.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
            {heroMetrics.map((metric) => (
              <article
                className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur"
                key={metric.label}
              >
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  {metric.label}
                </p>
                <p className="mt-4 text-lg font-semibold text-white">{metric.value}</p>
              </article>
            ))}
          </div>
        </div>
      </motion.header>

      <motion.section
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
      >
        <ControlPanel
          isRunning={isRunning}
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
      </motion.section>

      <section className="grid items-start gap-6 xl:grid-cols-[0.9fr_1.1fr_1.4fr]">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35, delay: 0.14, ease: "easeOut" }}
        >
          <QueueView queue={queueThreads} />
        </motion.div>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
        >
          <DatabaseView state={databaseState} />
        </motion.div>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35, delay: 0.26, ease: "easeOut" }}
        >
          <ThreadList threads={threads} />
        </motion.div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35, delay: 0.32, ease: "easeOut" }}
        >
          <LogPanel
            activeFilter={activeFilter}
            logs={filteredLogs}
            onFilterChange={setActiveFilter}
          />
        </motion.div>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35, delay: 0.38, ease: "easeOut" }}
        >
          <StatsPanel stats={statCards} />
        </motion.div>
      </section>
      </main>
    </MotionConfig>
  );
}
