import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { cn } from "@/lib/cn";

import type { SimulatorMode, SpeedOption } from "./types";

type ControlPanelProps = {
  isRunning: boolean;
  isReady: boolean;
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
  isReady,
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
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-slate-300">Playback</p>
          <p className="font-mono text-sm text-slate-500">
            Tick <span className="text-white">{tick.toString().padStart(2, "0")}</span>
          </p>
        </div>

        <div
          className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center"
          role="group"
          aria-label="Simulation controls"
        >
          <div className="flex flex-wrap gap-2">
            {modeOptions.map((option) => {
              const selected = option.value === mode;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                    selected
                      ? "border-sky-400/60 bg-sky-500/20 text-white"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10",
                  )}
                  onClick={() => onModeChange(option.value)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div
            className="hidden h-8 w-px bg-white/10 sm:block"
            aria-hidden
          />

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500">Speed</span>
            {speedOptions.map((option) => {
              const selected = option === speed;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selected}
                  className={cn(
                    "min-w-[3rem] rounded-lg border px-2.5 py-1.5 text-sm font-medium tabular-nums",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                    selected
                      ? "border-white bg-white text-slate-950"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10",
                  )}
                  onClick={() => onSpeedChange(option)}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="flex flex-1 flex-wrap gap-2 sm:justify-end">
            <Button disabled={!isReady || isRunning} onClick={onStart} variant="primary">
              Run
            </Button>
            <Button disabled={!isReady || !isRunning} onClick={onPause}>
              Pause
            </Button>
            <Button disabled={!isReady} onClick={onStep}>
              Step
            </Button>
            <Button onClick={onReset} variant="ghost">
              Reset
            </Button>
          </div>
        </div>
      </div>
    </Panel>
  );
}
