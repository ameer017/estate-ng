import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-baseline gap-2 text-current", className)}>
      <span className="font-display text-2xl font-extrabold tracking-tight sm:text-[1.7rem]">
        Estate<span className="text-[var(--teal)]">NG</span>
      </span>
      {compact ? null : (
        <span className="hidden text-[10px] font-medium uppercase tracking-[0.28em] text-current/50 sm:inline">
          plot · let · title
        </span>
      )}
    </span>
  );
}
