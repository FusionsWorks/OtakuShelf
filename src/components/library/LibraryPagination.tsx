"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface LibraryPaginationProps {
  page: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

export function LibraryPagination({
  page,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  onPageChange,
}: LibraryPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Paginación de biblioteca"
      className="flex items-center justify-center gap-3"
    >
      <button
        type="button"
        disabled={!hasPreviousPage}
        onClick={() => onPageChange(page - 1)}
        className="rounded-lg border border-ink-700 p-2 text-mist-300 transition hover:border-ember-500/50 hover:text-mist-100 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <span className="text-sm text-mist-300">
        Página{" "}
        <strong className="text-mist-100">
          {page}
        </strong>{" "}
        de {totalPages}
      </span>

      <button
        type="button"
        disabled={!hasNextPage}
        onClick={() => onPageChange(page + 1)}
        className="rounded-lg border border-ink-700 p-2 text-mist-300 transition hover:border-ember-500/50 hover:text-mist-100 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Página siguiente"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}