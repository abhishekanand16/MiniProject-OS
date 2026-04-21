import { Panel } from "@/components/ui/Panel";

import { ThreadCard } from "./ThreadCard";
import type { ThreadState, ThreadVisual } from "./types";

type ThreadListProps = {
  threads: ThreadVisual[];
};

const stateSections: { title: string; states: ThreadState[] }[] = [
  { title: "Active access", states: ["reading", "writing"] },
  { title: "Queued and blocked", states: ["waiting", "blocked", "arriving"] },
  { title: "Completed", states: ["completed"] },
];

export function ThreadList({ threads }: ThreadListProps) {
  return (
    <Panel className="min-h-full">
      <div className="flex h-full flex-col gap-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Thread surfaces
          </p>
          <h2 className="text-2xl font-bold text-white">Reader and writer cards</h2>
          <p className="text-sm text-slate-300">
            Cards are organized by visible lifecycle state so the future simulation layer
            only needs to swap in real data and transitions.
          </p>
        </div>

        <div className="space-y-6">
          {stateSections.map((section) => {
            const items = threads.filter((thread) => section.states.includes(thread.state));

            return (
              <section className="space-y-4" key={section.title}>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                  <span className="font-mono text-sm text-slate-400">
                    {items.length.toString().padStart(2, "0")} items
                  </span>
                </div>

                {items.length > 0 ? (
                  <div className="grid gap-4 xl:grid-cols-2">
                    {items.map((thread) => (
                      <ThreadCard key={thread.id} thread={thread} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-white/12 bg-white/4 p-6 text-sm text-slate-400">
                    No threads in this lane yet.
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}
