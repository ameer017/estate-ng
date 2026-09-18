import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-sm border border-[var(--line)] bg-[var(--panel)] px-3.5 text-sm text-[var(--ink)] outline-none ring-[var(--teal)] placeholder:text-[var(--muted)] focus:ring-2",
        className,
      )}
      {...props}
    />
  );
}
