"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Navigation } from "./Navigation";
import { Button } from "@/components/ui/button";
import type React from "react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // If not logged in, show a centered layout with login/register buttons
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <header className="p-4 flex justify-end">
          <div className="space-x-2">
            <Link href="/auth/signin">
              <Button
                variant="outline"
                className="bg-transparent border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-white"
              >
                Giriş Yap
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-neon-pink text-white hover:bg-neon-purple">
                Kayıt Ol
              </Button>
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          {children}
        </main>
        <footer className="p-4 text-center text-neon-blue">
          © 2023 Çiftçilik Sistemi. Tüm hakları saklıdır.
        </footer>
      </div>
    );
  }

  // If logged in, show the full layout with navigation
  return (
    <div className="flex min-h-screen bg-gray-900">
      <Navigation isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
