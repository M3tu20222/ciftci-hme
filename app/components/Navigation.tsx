"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  LayoutDashboard,
  Box,
  BadgeDollarSign,
  Wheat,
  Map,
  Users,
  Droplets,
  ListTodo,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) return null;

  const routes = [
    {
      label: "Ana Sayfa",
      icon: LayoutDashboard,
      href: "/",
    },
    {
      label: "Envanter",
      icon: Box,
      href: "/envanter",
    },
    {
      label: "Finans",
      icon: BadgeDollarSign,
      href: "/finans",
    },
    {
      label: "Tarlalar",
      icon: Wheat,
      href: "/tarlalar",
    },
    {
      label: "Plots",
      icon: Map,
      href: "/plots",
    },
    {
      label: "Kullanıcılar",
      icon: Users,
      href: "/kullanicilar",
    },
    {
      label: "Kuyular",
      icon: Droplets,
      href: "/kuyular",
    },
    {
      label: "İş Akışı",
      icon: ListTodo,
      href: "/is-akisi",
    },
  ];

  return (
    <nav
      className={cn(
        "relative h-screen border-r border-neon-blue bg-gray-900/95 pt-20 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <Button
        onClick={() => setIsCollapsed(!isCollapsed)}
        variant="ghost"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-neon-blue bg-gray-900 p-0 hover:bg-gray-800"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 text-neon-blue transition-all",
            isCollapsed && "rotate-180"
          )}
        />
      </Button>
      <div className="space-y-4 px-2">
        <div className="flex justify-between items-center px-3">
          <div
            className={cn("text-neon-pink font-bold", isCollapsed && "hidden")}
          >
            Çiftçilik Sistemi
          </div>
        </div>
        <div className="space-y-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800",
                pathname === route.href
                  ? "bg-gray-800 text-neon-pink"
                  : "text-neon-blue hover:text-neon-cyan",
                isCollapsed && "justify-center"
              )}
            >
              <route.icon
                className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-2")}
              />
              {!isCollapsed && <span>{route.label}</span>}
            </Link>
          ))}
        </div>
        {!isCollapsed && (
          <div className="absolute bottom-4 left-0 right-0 px-3">
            <div className="flex flex-col gap-2">
              <span className="text-neon-green text-sm">
                {session.user?.name}
              </span>
              <Button
                onClick={() => signOut()}
                className="w-full bg-neon-red text-gray-900 hover:bg-neon-pink transition-colors duration-300"
              >
                Çıkış Yap
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
