import { Badge } from "@/components/ui/Badge";
import { Panel } from "@/components/ui/Panel";
import { cn } from "@/lib/cn";

import type { LogEntryVisual, LogTone } from "./types";

type LogPanelProps = {
  activeFilter: LogTone | "all";
  logs: LogEntryVisual[];
  onFilterChange: (filter: LogTone | "all") => void;
};

const filterOptions: { label: string; value: LogTone | "all" }[] = [
  { label: "All", value: "all" },
  { label: "System", value: "system" },
  { label: "Reader", value: "reader" },
  { label: "Writer", value: "writer" },
  { label: "Warning", value: "warning" },
];

const toneMap = {
  system: "info" as const,
  reader: "reader" as const,
  writer: "writer" as const,
  warning: "warning" as const,
};

export function LogPanel({ activeFilter, logs, onFilterChange }: LogPanelProps) {
  return (
    <Panel className="min-h-full">
      <div className="flex h-full flex-col gap-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Event feed
            </p>
            <h2 className="text-2xl font-bold text-white">Narrated system timeline</h2>
            <p className="text-sm text-slate-300">
              Filter chips are UI-ready and intentionally decoupled from real event
              generation so they can receive future engine logs directly.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => {
              const isActive = filter.value === activeFilter;

              return (
                <button
                  aria-pressed={isActive}
                  className={cn(
                    "min-h-11 rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ease-out",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                    isActive
                      ? "bg-sky-400 text-slate-950"
                      : "bg-white/6 text-slate-300 ring-1 ring-white/10 hover:bg-white/10 hover:text-white active:scale-[0.98]",
                  )}
                  key={filter.value}
                  onClick={() => onFilterChange(filter.value)}
                  type="button"
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {logs.length > 0 ? (
          <div className="space-y-3">
            {logs.map((entry) => (
              <article
                className="rounded-3xl border border-white/10 bg-white/5 p-4 transition duration-200 hover:bg-white/8"
                key={entry.id}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge tone={toneMap[entry.tone]}>{entry.tone}</Badge>
                      <span className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                        {entry.tickLabel}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">{entry.title}</h3>
                      <p className="mt-1 text-sm text-slate-300">{entry.detail}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-[28px] border border-dashed border-white/12 bg-white/4 p-8 text-center">
            <div className="space-y-2">
              <p className="text-lg font-semibold text-white">No events in this filter</p>
              <p className="text-sm text-slate-400">
                The empty state preserves rhythm even when a future engine produces no
                matching entries.
              </p>
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}
