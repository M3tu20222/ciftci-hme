"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Mail, Lock } from "lucide-react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.error(result.error);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 bg-opacity-75 backdrop-blur-sm">
      <Card className="w-[400px] border-2 border-neon-blue shadow-lg shadow-neon-blue">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-neon-pink glow-text-pink">
            Giriş Yap
          </CardTitle>
          <CardDescription className="text-center text-neon-cyan">
            Hesabınıza giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neon-green">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-blue" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Email adresiniz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-gray-800 border-neon-blue text-neon-cyan placeholder-neon-blue/50 focus:ring-neon-pink"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-neon-green">
                Şifre
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-blue" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Şifreniz"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-gray-800 border-neon-blue text-neon-cyan placeholder-neon-blue/50 focus:ring-neon-pink"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="bg-transparent text-neon-blue border-2 border-neon-blue hover:bg-neon-blue hover:text-gray-900 transition-all duration-300 shadow-neon-blue"
          >
            İptal
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-neon-green text-gray-900 hover:bg-neon-yellow transition-all duration-300 shadow-neon-green"
          >
            Giriş Yap
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
