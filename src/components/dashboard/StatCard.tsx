import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
}

export function StatCard({
  label,
  value,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="rounded-xl2 border border-ink-700 bg-ink-900 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-mist-500">{label}</p>

          <p className="mt-2 font-display text-3xl font-bold text-white">
            {value}
          </p>
        </div>

        <div className="rounded-lg bg-ink-800 p-2 text-ember-400">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}