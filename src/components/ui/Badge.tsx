import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "accent" | "muted" | "success";
}

const variants = {
  default: "bg-ink-700 text-mist-100",
  accent: "bg-ember-500/15 text-ember-400",
  muted: "bg-mist-500/10 text-mist-300",
  success: "bg-emerald-500/15 text-emerald-400",
};

export function Badge({
  children,
  variant = "default",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}