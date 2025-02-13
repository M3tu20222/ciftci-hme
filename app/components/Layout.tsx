import type { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { Navigation } from "./Navigation";
import AuthStatus from "./AuthStatus";
import { useState } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  if (!session) return null;

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 p-4 border-r border-neon-green">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neon-pink">
            Çiftçilik Sistemi
          </h1>
        </div>
        <Navigation isOpen={isOpen} toggleSidebar={toggleSidebar} />
      </aside>
      <main className="flex-1 bg-gray-800">
        <header className="h-16 border-b border-neon-green bg-gray-900 px-4 flex items-center justify-end">
          <AuthStatus />
        </header>
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
}
