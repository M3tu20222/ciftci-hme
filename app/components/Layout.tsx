"use client";

import type React from "react";
import { useSession } from "next-auth/react";
import { Navigation } from "./Navigation";
import  AuthStatus  from "./AuthStatus";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  return (
    <div className="flex min-h-screen bg-gray-900 text-neon-cyan">
      {status === "authenticated" && <Navigation />}
      <div className="flex flex-1 flex-col">
        <header className="bg-gray-800 border-b border-neon-blue">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-neon-pink glow-text-pink">
              Çiftçilik Sistemi
            </h1>
            <AuthStatus />
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-800 border-t border-neon-blue">
          <div className="container mx-auto px-4 py-4 text-center text-neon-cyan">
            &copy; 2025 Çiftçilik Sistemi. Tüm hakları saklıdır.
          </div>
        </footer>
      </div>
    </div>
  );
}
