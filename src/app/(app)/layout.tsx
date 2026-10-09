import type { ReactNode } from "react";

import { Navbar } from "@/components/layout/Navbar";

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink-950 text-mist-100">
      <Navbar />

      <main>{children}</main>
    </div>
  );
}