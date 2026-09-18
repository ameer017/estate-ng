import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "ink",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "ink" | "teal" | "gold" | "muted" | "danger";
}) {
  const tones = {
    ink: "bg-[var(--ink)] text-[var(--mint)]",
    teal: "bg-[var(--teal)] text-white",
    gold: "bg-[var(--gold-soft)] text-amber-900",
    muted: "border border-[var(--line)] bg-transparent text-[var(--muted)]",
    danger: "bg-rose-100 text-rose-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
