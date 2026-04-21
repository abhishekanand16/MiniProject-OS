import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/cn";

type PanelProps = PropsWithChildren<
  HTMLAttributes<HTMLElement> & {
    as?: "section" | "div" | "article";
  }
>;

export function Panel({
  as = "section",
  children,
  className,
  ...props
}: PanelProps) {
  const Component = as;

  return (
    <Component
      className={cn(
        "rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.88),rgba(2,6,23,0.92))] p-6 shadow-[0_18px_60px_rgba(2,6,23,0.55)] backdrop-blur",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
