import { LibraryBig } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl2 border border-dashed border-ink-700 px-6 text-center">
      <div className="mb-4 rounded-full bg-ink-800 p-4">
        <LibraryBig className="h-6 w-6 text-mist-300" />
      </div>

      <h3 className="font-display text-lg font-semibold text-mist-100">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm text-mist-500">
        {description}
      </p>
    </div>
  );
}