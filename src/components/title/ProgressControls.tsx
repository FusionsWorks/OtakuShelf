"use client";

import { Minus, Plus, Save } from "lucide-react";
import { useState } from "react";

import { useProgress } from "@/hooks/useProgress";

interface ProgressControlsProps {
  entryId: string;
  titleId: string;
  currentProgress: number;
  total: number | null;
  unit: "episodio" | "capítulo";
}

export function ProgressControls({
  entryId,
  titleId,
  currentProgress,
  total,
  unit,
}: ProgressControlsProps) {
  const [manualValue, setManualValue] = useState(
    String(currentProgress),
  );

  const mutation = useProgress(titleId);

  const update = (delta: number) => {
    mutation.mutate({
      entryId,
      delta,
    });
  };

  const saveManualProgress = () => {
    const value = Number(manualValue);

    if (!Number.isInteger(value) || value < 0) {
      return;
    }

    mutation.mutate({
      entryId,
      manualValue: value,
    });
  };

  const canDecrease = currentProgress > 0;
  const canIncrease =
    total === null || currentProgress < total;

  return (
    <div className="mt-5 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={!canDecrease || mutation.isPending}
          onClick={() => update(-1)}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-ink-700 bg-ink-800 px-4 text-sm font-medium text-mist-300 transition hover:border-ink-600 hover:text-mist-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
          1 {unit} menos
        </button>

        <button
          type="button"
          disabled={!canIncrease || mutation.isPending}
          onClick={() => update(1)}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-ember-500 px-4 text-sm font-semibold text-white transition hover:bg-ember-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
          1 {unit} más
        </button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">
            Progreso manual
          </span>

          <input
            type="number"
            min={0}
            max={total ?? undefined}
            value={manualValue}
            onChange={(event) =>
              setManualValue(event.target.value)
            }
            className="h-10 w-full rounded-lg border border-ink-700 bg-ink-800 px-3 text-sm text-mist-100 outline-none transition placeholder:text-mist-500 focus:border-ember-500 focus:ring-1 focus:ring-ember-500/20"
            placeholder="Progreso"
          />
        </label>

        <button
          type="button"
          disabled={mutation.isPending}
          onClick={saveManualProgress}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-ink-700 bg-ink-800 px-4 text-sm font-medium text-mist-300 transition hover:border-ember-500/50 hover:text-mist-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Save className="h-4 w-4" />
          Guardar
        </button>
      </div>

      {mutation.isError && (
        <p className="text-sm text-red-400">
          {mutation.error instanceof Error
            ? mutation.error.message
            : "No pudimos actualizar el progreso."}
        </p>
      )}

      {mutation.isSuccess && (
        <p className="text-sm text-emerald-400">
          Progreso actualizado correctamente.
        </p>
      )}
    </div>
  );
}