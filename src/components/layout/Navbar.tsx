"use client";

import Link from "next/link";
import { BookOpen, LogOut, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-ink-700 bg-ink-950/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ember-500">
            <BookOpen size={19} className="text-white" />
          </div>

          <span className="font-display text-lg font-bold text-white">
            OtakuShelf
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Link
            href="/"
            className="rounded-lg px-4 py-2 text-sm font-medium text-mist-300 transition hover:bg-ink-800 hover:text-white"
          >
            Dashboard
          </Link>

          <Link
            href="/library"
            className="rounded-lg px-4 py-2 text-sm font-medium text-mist-300 transition hover:bg-ink-800 hover:text-white"
          >
            Biblioteca
          </Link>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="ml-2 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-mist-300 transition hover:bg-ink-800 hover:text-white"
          >
            <LogOut size={17} />
            Cerrar sesión
          </button>
        </nav>

        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((value) => !value)}
          className="rounded-lg p-2 text-mist-300 hover:bg-ink-800 hover:text-white md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-ink-700 px-6 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-mist-300 hover:bg-ink-800 hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              href="/library"
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-mist-300 hover:bg-ink-800 hover:text-white"
            >
              Biblioteca
            </Link>

            <Link
            href="/stats"
            className="rounded-lg px-4 py-2 text-sm font-medium text-mist-300 transition hover:bg-ink-800 hover:text-white"
            >
             Estadísticas
        </Link>

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-left text-sm font-medium text-mist-300 hover:bg-ink-800 hover:text-white"
            >
              <LogOut size={17} />
              Cerrar sesión
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}