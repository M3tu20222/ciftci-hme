"use client";

import type React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-neon-cyan">
      <header className="bg-gray-800 border-b border-neon-blue">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-neon-pink glow-text-pink"
          >
            Çiftçilik Sistemi
          </Link>
          {status === "authenticated" && (
            <div className="space-x-4">
              <Link
                href="/envanter"
                className="text-neon-blue hover:text-neon-cyan transition-colors"
              >
                Envanter
              </Link>
              <Link
                href="/finans"
                className="text-neon-blue hover:text-neon-cyan transition-colors"
              >
                Finans
              </Link>
              <Link
                href="/tarlalar"
                className="text-neon-blue hover:text-neon-cyan transition-colors"
              >
                Tarlalar
              </Link>
              <Link
                href="/plots"
                className="text-neon-blue hover:text-neon-cyan transition-colors"
              >
                Plots
              </Link>
              <Link
                href="/kullanicilar"
                className="text-neon-blue hover:text-neon-cyan transition-colors"
              >
                Kullanıcılar
              </Link>
              <Link
                href="/kuyular"
                className="text-neon-blue hover:text-neon-cyan transition-colors"
              >
                Kuyular
              </Link>
              <Link
                href="/is-akisi"
                className="text-neon-blue hover:text-neon-cyan transition-colors"
              >
                İş Akışı
              </Link>
            </div>
          )}
          <div className="space-x-4">
            {session ? (
              <>
                <span className="text-neon-green">{session.user?.name}</span>
                <Button
                  onClick={() => signOut()}
                  className="bg-neon-red text-gray-900 hover:bg-neon-pink transition-colors duration-300"
                >
                  Çıkış Yap
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button className="bg-neon-blue text-gray-900 hover:bg-neon-cyan transition-colors duration-300">
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-neon-green text-gray-900 hover:bg-neon-yellow transition-colors duration-300">
                    Kayıt Ol
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-gray-800 border-t border-neon-blue">
        <div className="container mx-auto px-4 py-4 text-center text-neon-cyan">
          &copy; 2023 Çiftçilik Sistemi. Tüm hakları saklıdır.
        </div>
      </footer>
    </div>
  );
}
