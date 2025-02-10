"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthStatus() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="space-x-4">
        <span className="text-neon-green">{session.user?.name}</span>
        <Button
          onClick={() => signOut()}
          className="bg-neon-red text-gray-900 hover:bg-neon-pink transition-colors duration-300"
        >
          Çıkış Yap
        </Button>
      </div>
    );
  }

  return (
    <div className="space-x-4">
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
    </div>
  );
}
