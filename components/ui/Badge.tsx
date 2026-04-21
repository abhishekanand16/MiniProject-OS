import type { PropsWithChildren } from "react";

import { cn } from "@/lib/cn";

type BadgeTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "reader"
  | "writer";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-white/8 text-slate-300 ring-1 ring-white/10",
  info: "bg-sky-500/12 text-sky-200 ring-1 ring-sky-400/20",
  success: "bg-emerald-500/12 text-emerald-200 ring-1 ring-emerald-400/20",
  warning: "bg-amber-500/12 text-amber-200 ring-1 ring-amber-400/20",
  danger: "bg-rose-500/12 text-rose-200 ring-1 ring-rose-400/20",
  reader: "bg-cyan-400/12 text-cyan-200 ring-1 ring-cyan-300/20",
  writer: "bg-orange-400/12 text-orange-200 ring-1 ring-orange-300/20",
};

type BadgeProps = PropsWithChildren<{
  tone?: BadgeTone;
  className?: string;
}>;

export function Badge({ children, className, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
