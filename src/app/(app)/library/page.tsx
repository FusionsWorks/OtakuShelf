"use client";

import { useEffect, useState } from "react";
import { LibraryBig } from "lucide-react";

import { LibraryFilters } from "@/components/library/LibraryFilters";
import { LibraryGrid } from "@/components/library/LibraryGrid";
import { LibraryPagination } from "@/components/library/LibraryPagination";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useLibrary } from "@/hooks/useLibrary";

type Sort =
  | "updatedAt"
  | "addedAt"
  | "title"
  | "rating"
  | "progress";

type Order = "asc" | "desc";

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState<"" | "ANIME" | "MANGA">("");
  const [favorite, setFavorite] = useState(false);
  const [sort, setSort] = useState<Sort>("updatedAt");
  const [order, setOrder] = useState<Order>("desc");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search);

  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    status,
    type,
    favorite,
    sort,
    order,
  ]);

  const { data, isPending, isError, error } = useLibrary({
    search: debouncedSearch,
    status: status || undefined,
    type: type || undefined,
    favorite: favorite || undefined,
    sort,
    order,
    page,
    limit: 24,
  });

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setType("");
    setFavorite(false);
    setSort("updatedAt");
    setOrder("desc");
    setPage(1);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-ember-500/10 p-3">
            <LibraryBig className="h-6 w-6 text-ember-400" />
          </div>

          <div>
            <p className="text-sm text-mist-500">
              Tu colección
            </p>

            <h1 className="font-display text-3xl font-bold text-mist-100">
              Biblioteca
            </h1>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        <LibraryFilters
          search={search}
          status={status}
          type={type}
          favorite={favorite}
          sort={sort}
          order={order}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onTypeChange={setType}
          onFavoriteChange={setFavorite}
          onSortChange={setSort}
          onOrderChange={setOrder}
          onClear={clearFilters}
        />

        {isPending && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl2 border border-ink-700 bg-ink-900"
              >
                <Skeleton className="aspect-[2/3] rounded-none" />

                <div className="space-y-3 p-4">
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-3 w-2/5" />
                  <Skeleton className="h-1.5 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-xl2 border border-red-500/20 bg-red-500/5 p-8 text-center">
            <h2 className="font-display text-lg font-semibold text-mist-100">
              No pudimos cargar tu biblioteca
            </h2>

            <p className="mt-2 text-sm text-mist-500">
              {error instanceof Error
                ? error.message
                : "Ocurrió un error inesperado."}
            </p>
          </div>
        )}

        {!isPending && !isError && data && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-mist-500">
                {data.pagination.total}{" "}
                {data.pagination.total === 1
                  ? "título"
                  : "títulos"}
              </p>
            </div>

            <LibraryGrid entries={data.entries} />

            <LibraryPagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              hasPreviousPage={
                data.pagination.hasPreviousPage
              }
              hasNextPage={data.pagination.hasNextPage}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </main>
  );
}