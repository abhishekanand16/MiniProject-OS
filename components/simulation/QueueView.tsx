import { Badge } from "@/components/ui/Badge";
import { Panel } from "@/components/ui/Panel";

import type { ThreadVisual } from "./types";

type QueueViewProps = {
  queue: ThreadVisual[];
};

const reasonLabels = {
  writerActive: "writer active",
  readersActive: "readers active",
  writerQueued: "writer queued",
  fairTurn: "fair turn",
};

export function QueueView({ queue }: QueueViewProps) {
  return (
    <Panel>
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Queue</h2>
          <p className="mt-1 text-sm text-slate-400">Threads waiting for the lock.</p>
        </div>

        {queue.length > 0 ? (
          <ol className="space-y-2">
            {queue.map((thread) => (
              <li
                className="rounded-xl border border-white/10 bg-white/5 p-3"
                key={thread.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-white">
                        #{thread.queueIndex}
                      </span>
                      <Badge tone={thread.role === "reader" ? "reader" : "writer"}>
                        {thread.role}
                      </Badge>
                      <Badge tone={thread.state === "blocked" ? "warning" : "neutral"}>
                        {thread.state}
                      </Badge>
                    </div>
                    <p className="font-mono text-sm text-white">{thread.id}</p>
                    <p className="text-xs text-slate-400">
                      Arrived tick {thread.arrivalTick} · {thread.durationLabel}
                    </p>
                  </div>
                  {thread.waitReason ? (
                    <Badge tone="warning">{reasonLabels[thread.waitReason]}</Badge>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-center text-sm text-slate-400">
            Queue is empty.
          </div>
        )}
      </div>
    </Panel>
  );
}
