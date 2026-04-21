import { Panel } from "@/components/ui/Panel";

import type { StatCard } from "./types";

type StatsPanelProps = {
  stats: StatCard[];
};

export function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <Panel className="min-h-full">
      <div className="flex h-full flex-col gap-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Teaching KPIs
          </p>
          <h2 className="text-2xl font-bold text-white">Stats and learning cues</h2>
          <p className="text-sm text-slate-300">
            Placeholder numbers keep the card rhythm realistic now and provide future
            slots for measured throughput and wait-time metrics.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <article className="rounded-3xl bg-white/5 p-5" key={stat.label}>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{stat.label}</p>
              <p className="mt-3 font-mono text-3xl font-bold text-white">{stat.value}</p>
              <p className="mt-2 text-sm font-semibold text-emerald-300">{stat.trend}</p>
              <p className="mt-4 text-sm text-slate-400">{stat.helper}</p>
            </article>
          ))}
        </div>
      </div>
    </Panel>
  );
}
