import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

import type { ThreadVisual } from "./types";

type ThreadCardProps = {
  thread: ThreadVisual;
};

const stateTone = {
  arriving: "neutral",
  waiting: "warning",
  blocked: "danger",
  reading: "reader",
  writing: "writer",
  completed: "success",
} as const;

const cardAccent = {
  arriving: "from-slate-400/18 to-transparent",
  waiting: "from-amber-400/18 to-transparent",
  blocked: "from-rose-400/18 to-transparent",
  reading: "from-cyan-400/18 to-transparent",
  writing: "from-orange-400/18 to-transparent",
  completed: "from-emerald-400/18 to-transparent",
} as const;

export function ThreadCard({ thread }: ThreadCardProps) {
  return (
    <article
      className={cn(
        "rounded-3xl border border-white/10 bg-gradient-to-br p-4 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-white/8",
        cardAccent[thread.state],
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={thread.role === "reader" ? "reader" : "writer"}>
              {thread.role}
            </Badge>
            <Badge tone={stateTone[thread.state]}>{thread.state}</Badge>
          </div>
          <div>
            <h3 className="font-mono text-lg font-semibold text-white">{thread.id}</h3>
            <p className="text-sm text-slate-300">
              Arrived at tick {thread.arrivalTick} and needs {thread.durationLabel}.
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-black/20 px-3 py-2 text-right">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Remaining</p>
          <p className="mt-1 font-mono text-sm font-semibold text-white">
            {thread.remainingLabel}
          </p>
        </div>
      </div>

      {thread.waitReason ? (
        <div className="mt-4 rounded-2xl bg-black/15 px-3 py-2 text-sm text-slate-300">
          Waiting reason: <span className="text-white">{thread.waitReason}</span>
        </div>
      ) : null}
    </article>
  );
}
