import type { HTMLAttributes } from "react";

export function Card({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "rounded-xl2 border border-ink-700 bg-ink-900",
        className,
      ].join(" ")}
      {...props}
    />
  );
}