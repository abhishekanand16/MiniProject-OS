import { motion } from "framer-motion";

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
    <Panel className="min-h-full">
      <div className="flex h-full flex-col gap-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Waiting lane
          </p>
          <h2 className="text-2xl font-bold text-white">Queue orchestration</h2>
          <p className="text-sm text-slate-300">
            Each card keeps its place in line so the future engine can bind live queue
            order into the same surface.
          </p>
        </div>

        {queue.length > 0 ? (
          <ol className="space-y-3">
            {queue.map((thread, index) => (
              <motion.li
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-4"
                initial={{ opacity: 0, y: 16 }}
                key={thread.id}
                transition={{ duration: 0.24, delay: index * 0.06, ease: "easeOut" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-lg font-semibold text-white">
                        #{thread.queueIndex}
                      </span>
                      <Badge tone={thread.role === "reader" ? "reader" : "writer"}>
                        {thread.role}
                      </Badge>
                      <Badge tone={thread.state === "blocked" ? "warning" : "neutral"}>
                        {thread.state}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">{thread.id}</p>
                      <p className="text-sm text-slate-300">
                        Arrived at tick {thread.arrivalTick} with {thread.durationLabel}.
                      </p>
                    </div>
                  </div>
                  {thread.waitReason ? (
                    <Badge tone="warning">{reasonLabels[thread.waitReason]}</Badge>
                  ) : null}
                </div>
              </motion.li>
            ))}
          </ol>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-[28px] border border-dashed border-white/12 bg-white/4 p-8 text-center">
            <div className="space-y-2">
              <p className="text-lg font-semibold text-white">Queue is clear</p>
              <p className="mx-auto max-w-sm text-sm text-slate-400">
                This empty state is intentionally styled for future scenarios where no
                threads are blocked or waiting.
              </p>
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}
