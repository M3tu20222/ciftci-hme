"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/tarlalar", label: "Tarlalar" },
  { href: "/tarla-sahipler", label: "Tarla Sahipleri" },
  { href: "/kuyular", label: "Kuyular" },
  { href: "/sezonlar", label: "Sezonlar" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/gubreler", label: "Gübreler" },
  { href: "/gubre-stoklar", label: "Gübre Stokları" },
  { href: "/envanter", label: "Envanter" },
  { href: "/is-akisi", label: "İş Akışı" },
  { href: "/mazot-tuketim-kartlari", label: "Mazot Tüketim Kartları" },
  { href: "/kuyu-faturalar", label: "Kuyu Faturaları" },
  { href: "/finans", label: "Finans" },
  { href: "/kullanicilar", label: "Kullanıcılar" },
];

interface NavigationProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Navigation({ isOpen, toggleSidebar }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed left-0 top-0 bottom-0 w-64 bg-gray-800 p-4 transition-transform duration-300 ease-in-out transform",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 text-neon-pink hover:text-neon-blue"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <div className="mt-16 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center px-3 py-2 text-lg transition-colors hover:text-neon-pink",
              pathname === link.href ? "text-neon-green" : "text-gray-400"
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
