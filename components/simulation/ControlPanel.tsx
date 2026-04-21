import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { cn } from "@/lib/cn";

import type { SimulatorMode, SpeedOption } from "./types";

type ControlPanelProps = {
  isRunning: boolean;
  mode: SimulatorMode;
  speed: SpeedOption;
  tick: number;
  onModeChange: (mode: SimulatorMode) => void;
  onSpeedChange: (speed: SpeedOption) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onStep: () => void;
  modeOptions: { value: SimulatorMode; label: string }[];
  speedOptions: SpeedOption[];
};

export function ControlPanel({
  isRunning,
  mode,
  speed,
  tick,
  onModeChange,
  onSpeedChange,
  onPause,
  onReset,
  onStart,
  onStep,
  modeOptions,
  speedOptions,
}: ControlPanelProps) {
  return (
    <Panel className="overflow-hidden">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200/80">
              Control deck
            </p>
            <h2 className="text-2xl font-bold text-white">Drive the visual prototype</h2>
            <p className="max-w-2xl text-sm text-slate-300">
              Buttons and selectors are intentionally UI-only. They preview states,
              hierarchy, and interaction feedback without wiring scheduling logic.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            <span className="text-slate-500">Current tick</span>
            <span className="ml-3 font-mono text-lg font-semibold text-white">
              {tick.toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-slate-200">Scheduling mode</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {modeOptions.map((option) => {
                const isSelected = option.value === mode;

                return (
                  <button
                    key={option.value}
                    aria-pressed={isSelected}
                    className={cn(
                      "min-h-14 rounded-2xl px-4 py-3 text-left text-sm transition duration-200 ease-out",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                      isSelected
                        ? "bg-sky-400/18 text-white ring-1 ring-sky-300/40"
                        : "bg-white/5 text-slate-300 ring-1 ring-white/10 hover:bg-white/10 hover:text-white active:scale-[0.99]",
                    )}
                    onClick={() => onModeChange(option.value)}
                    type="button"
                  >
                    <span className="block font-semibold">{option.label}</span>
                    <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-slate-500">
                      Visual select
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-slate-200">Speed preset</legend>
            <div className="grid grid-cols-4 gap-3">
              {speedOptions.map((option) => {
                const isSelected = option === speed;

                return (
                  <button
                    key={option}
                    aria-pressed={isSelected}
                    className={cn(
                      "min-h-11 rounded-2xl px-3 py-2 text-sm font-semibold transition duration-200 ease-out",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                      isSelected
                        ? "bg-white text-slate-950"
                        : "bg-white/5 text-slate-300 ring-1 ring-white/10 hover:bg-white/10 hover:text-white active:scale-[0.98]",
                    )}
                    onClick={() => onSpeedChange(option)}
                    type="button"
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button disabled={isRunning} onClick={onStart} variant="primary">
            Start preview
          </Button>
          <Button disabled={!isRunning} onClick={onPause}>
            Pause preview
          </Button>
          <Button onClick={onStep}>Step frame</Button>
          <Button onClick={onReset} variant="ghost">
            Reset view
          </Button>
        </div>
      </div>
    </Panel>
  );
}
