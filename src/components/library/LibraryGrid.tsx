import { TitleCard } from "./TitleCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface LibraryEntry {
  id: string;
  status: string;
  progress: number;
  rating: number | null;
  isFavorite: boolean;
  title: {
    id: string;
    type: "ANIME" | "MANGA";
    title: string;
    coverUrl: string | null;
    year: number | null;
    totalEpisodes: number | null;
    totalChapters: number | null;
    externalScore: number | null;
  };
}

interface LibraryGridProps {
  entries: LibraryEntry[];
}

export function LibraryGrid({ entries }: LibraryGridProps) {
  if (entries.length === 0) {
    return (
      <EmptyState
        title="Tu biblioteca está vacía"
        description="No encontramos títulos que coincidan con los filtros actuales."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {entries.map((entry) => (
        <TitleCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}