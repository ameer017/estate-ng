import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-sm text-xs font-semibold uppercase tracking-[0.16em] transition disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-[var(--teal)] text-white hover:bg-[var(--teal-dark)]",
        navy: "bg-[var(--ink)] text-[var(--mint)] hover:bg-[var(--ink-2)]",
        gold: "bg-[var(--gold)] text-[var(--ink)] hover:bg-[#b08a2e]",
        outline: "border border-[var(--ink)] bg-transparent text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white",
        ghost: "text-current hover:bg-white/10",
        danger: "bg-[#b44a4a] text-white hover:bg-[#8f2f2f]",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-5",
        lg: "h-12 px-7 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export { buttonVariants };
