"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function AuthStatus() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="flex items-center gap-4">
      <span className="text-neon-green">{session.user?.name}</span>
      <Button
        onClick={() => signOut()}
        variant="outline"
        className="border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-white"
      >
        Çıkış Yap
      </Button>
    </div>
  );
}
