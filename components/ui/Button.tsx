import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
  }
>;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-primary)] text-slate-950 shadow-[0_16px_40px_rgba(65,163,255,0.2)] hover:bg-[var(--color-primary-strong)] active:scale-[0.98]",
  secondary:
    "bg-white/6 text-slate-100 ring-1 ring-white/10 hover:bg-white/10 active:scale-[0.98]",
  ghost:
    "bg-transparent text-slate-300 hover:bg-white/8 hover:text-white active:scale-[0.98]",
  danger:
    "bg-rose-500/90 text-white hover:bg-rose-400 active:scale-[0.98]",
};

export function Button({
  children,
  className,
  type = "button",
  variant = "secondary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
