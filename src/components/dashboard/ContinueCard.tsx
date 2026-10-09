interface ContinueCardProps {
  title: string;
  coverUrl: string | null;
  progress: number;
  total: number | null;
  type: "ANIME" | "MANGA";
  status: string;
}

export function ContinueCard({
  title,
  coverUrl,
  progress,
  total,
  type,
  status,
}: ContinueCardProps) {
  const percentage =
    total && total > 0
      ? Math.min((progress / total) * 100, 100)
      : 0;

  const progressLabel =
    type === "ANIME"
      ? `Episodio ${progress}${total ? ` / ${total}` : ""}`
      : `Capítulo ${progress}${total ? ` / ${total}` : ""}`;

  return (
    <article className="overflow-hidden rounded-xl2 border border-ink-700 bg-ink-900">
      <div className="flex gap-4 p-4">
        <div className="h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-800">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-mist-500">
              Sin portada
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-white">
            {title}
          </p>

          <p className="mt-1 text-xs text-mist-500">
            {type === "ANIME" ? "Anime" : "Manga"} · {status}
          </p>

          <p className="mt-4 text-sm text-mist-300">
            {progressLabel}
          </p>

          {total && (
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-700">
              <div
                className="h-full rounded-full bg-ember-500 transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}