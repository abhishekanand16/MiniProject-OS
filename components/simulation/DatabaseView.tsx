import { Badge } from "@/components/ui/Badge";
import { Panel } from "@/components/ui/Panel";
import { cn } from "@/lib/cn";

import type { DatabaseVisualState } from "./types";

type DatabaseViewProps = {
  state: DatabaseVisualState;
};

const statusStyles = {
  idle: {
    aura: "from-slate-400/15 to-white/0",
    core: "bg-slate-500/40 ring-slate-300/15",
    badge: "neutral" as const,
  },
  reading: {
    aura: "from-cyan-400/25 to-white/0",
    core: "bg-cyan-400/45 ring-cyan-300/25",
    badge: "reader" as const,
  },
  writing: {
    aura: "from-orange-400/28 to-white/0",
    core: "bg-orange-400/45 ring-orange-200/30",
    badge: "writer" as const,
  },
};

export function DatabaseView({ state }: DatabaseViewProps) {
  const styles = statusStyles[state.status];

  return (
    <Panel>
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Shared resource</h2>
            <p className="mt-1 text-sm text-slate-400">Current lock: reads, write, or idle.</p>
          </div>
          <Badge tone={styles.badge}>{state.status}</Badge>
        </div>

        <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 p-6">
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-b opacity-90 transition duration-300",
              styles.aura,
            )}
          />
          <div className="relative flex flex-col items-center gap-4 text-center">
            <div
              className={cn(
                "flex h-32 w-32 items-center justify-center rounded-full border border-white/10 ring-1 transition duration-300",
                styles.core,
              )}
            >
              <span className="font-mono text-sm uppercase tracking-[0.4em] text-white/80">
                DB
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-white">
                {state.status === "idle" && "Resource is idle"}
                {state.status === "reading" &&
                  `${state.readerCount} readers currently sharing access`}
                {state.status === "writing" &&
                  `${state.writerLabel ?? "Writer"} has exclusive control`}
              </p>
              <p className="mx-auto max-w-sm text-sm text-slate-300">{state.note}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Active readers
            </p>
            <p className="mt-2 font-mono text-3xl font-bold text-white">{state.readerCount}</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Writer slot
            </p>
            <p className="mt-2 font-mono text-3xl font-bold text-white">
              {state.writerLabel ?? "--"}
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
}
