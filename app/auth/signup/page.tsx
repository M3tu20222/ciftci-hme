"use client";

import { useState } from "react";
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
import { UserPlus, Mail, Lock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("işçi");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (response.ok) {
      router.push("/auth/signin");
    } else {
      console.error("Kayıt başarısız");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 bg-opacity-75 backdrop-blur-sm">
      <Card className="w-[400px] border-2 border-neon-blue shadow-lg shadow-neon-blue">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-neon-pink glow-text-pink">
            Kayıt Ol
          </CardTitle>
          <CardDescription className="text-center text-neon-cyan">
            Yeni bir hesap oluşturun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-neon-green">
                İsim
              </Label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-blue" />
                <Input
                  id="name"
                  placeholder="Adınız"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-gray-800 border-neon-blue text-neon-cyan placeholder-neon-blue/50 focus:ring-neon-pink"
                />
              </div>
            </div>
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
              <Label htmlFor="role" className="text-neon-green">
                Rol
              </Label>
              <div className="relative">
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="w-full pl-10 bg-gray-800 border-neon-blue text-neon-cyan placeholder-neon-blue/50 focus:ring-neon-pink">
                    <SelectValue placeholder="Rol seçin" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border border-neon-blue text-neon-cyan">
                    <SelectItem
                      value="admin"
                      className="hover:bg-neon-blue/20 focus:bg-neon-blue/20 focus:text-neon-pink"
                    >
                      Admin
                    </SelectItem>
                    <SelectItem
                      value="ortak"
                      className="hover:bg-neon-blue/20 focus:bg-neon-blue/20 focus:text-neon-pink"
                    >
                      Ortak
                    </SelectItem>
                    <SelectItem
                      value="işçi"
                      className="hover:bg-neon-blue/20 focus:bg-neon-blue/20 focus:text-neon-pink"
                    >
                      İşçi
                    </SelectItem>
                  </SelectContent>
                </Select>
                <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-blue" />
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
            <Button type="submit">Submit</Button>
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
            type="submit"
            onClick={handleSubmit}
            className="bg-neon-green text-gray-900 hover:bg-neon-yellow transition-all duration-300 shadow-neon-green"
          >
            Kayıt Ol
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
