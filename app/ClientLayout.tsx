"use client";

import { useSession } from "next-auth/react";
import { Navigation } from "./components/Navigation";
import AuthStatus from "./components/AuthStatus";
import type React from "react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen bg-gray-900">
      {session && <Navigation />}
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 border-b border-neon-blue">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-neon-pink glow-text-pink">
              Çiftçilik Sistemi
            </h1>
            <AuthStatus />
          </div>
        </header>
        <main className="flex-1 p-8">{children}</main>
        <footer className="bg-gray-800 border-t border-neon-blue">
          <div className="container mx-auto px-4 py-4 text-center text-neon-cyan">
            &copy; 2023 Çiftçilik Sistemi. Tüm hakları saklıdır.
          </div>
        </footer>
      </div>
    </div>
  );
}
