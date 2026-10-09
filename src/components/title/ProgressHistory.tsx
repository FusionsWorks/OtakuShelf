"use client";

import { History } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ProgressHistoryItem {
  id: string;
  progress: number;
  recordedAt: string;
}

interface ProgressHistoryProps {
  items: ProgressHistoryItem[];
  unit: "episodio" | "capítulo";
}

export function ProgressHistory({
  items,
  unit,
}: ProgressHistoryProps) {
  if (items.length === 0) {
    return (
      <section className="mt-8 rounded-xl2 border border-ink-700 bg-ink-900 p-5">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-mist-500" />

          <h2 className="font-display text-lg font-semibold text-mist-100">
            Historial de progreso
          </h2>
        </div>

        <p className="mt-4 text-sm text-mist-500">
          Todavía no hay registros de progreso.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-xl2 border border-ink-700 bg-ink-900 p-5">
      <div className="flex items-center gap-2">
        <History className="h-5 w-5 text-ember-400" />

        <h2 className="font-display text-lg font-semibold text-mist-100">
          Historial de progreso
        </h2>
      </div>

      <div className="mt-5 divide-y divide-ink-700">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div>
              <p className="text-sm font-medium text-mist-100">
                {item.progress} {unit}
                {item.progress !== 1 ? "s" : ""}
              </p>

              <p className="mt-1 text-xs text-mist-500">
                {format(
                  new Date(item.recordedAt),
                  "d 'de' MMMM, HH:mm",
                  { locale: es },
                )}
              </p>
            </div>

            <span className="rounded-full bg-ink-800 px-2.5 py-1 text-xs text-mist-500">
              Actualización
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}