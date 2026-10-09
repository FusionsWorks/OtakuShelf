import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Activity {
  id: string;
  progress: number;
  recordedAt: string;
  entry: {
    title: {
      title: string;
      type: "ANIME" | "MANGA";
    };
  };
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({
  activities,
}: RecentActivityProps) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="font-display text-xl font-semibold text-white">
          Actividad reciente
        </h2>

        <p className="mt-1 text-sm text-mist-500">
          Tus últimos avances.
        </p>
      </div>

      <div className="space-y-3">
        {activities.length === 0 ? (
          <div className="rounded-xl2 border border-ink-700 bg-ink-900 p-6 text-sm text-mist-500">
            Todavía no tienes actividad registrada.
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between rounded-xl2 border border-ink-700 bg-ink-900 p-4"
            >
              <div>
                <p className="font-medium text-white">
                  {activity.entry.title.title}
                </p>

                <p className="mt-1 text-sm text-mist-500">
                  {activity.entry.title.type === "ANIME"
                    ? "Anime"
                    : "Manga"}{" "}
                  · progreso {activity.progress}
                </p>
              </div>

              <span className="text-xs text-mist-500">
                {formatDistanceToNow(
                  new Date(activity.recordedAt),
                  {
                    addSuffix: true,
                    locale: es,
                  },
                )}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}