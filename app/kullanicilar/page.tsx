"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, UserPlus } from "lucide-react";
import type { IUser } from "@/models/User";

export default function UsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.push("/");
      return;
    }

    fetchUsers();
  }, [session, status, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleEdit = (userId: string) => {
    // Implement edit functionality
    console.log("Edit user:", userId);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-neon-pink title-glow">
        Kullanıcı Yönetimi
      </h1>

      <div className="flex justify-between items-center gap-4">
        <Input
          type="text"
          placeholder="Kullanıcı ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 bg-gray-800 text-neon-blue placeholder-neon-blue/50 border-neon-blue focus:ring-neon-green"
        />

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[200px] bg-gray-800 text-neon-green border-neon-green">
            <SelectValue placeholder="Tümü" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="ortak">Ortak</SelectItem>
            <SelectItem value="işçi">İşçi</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={() => router.push("/kullanicilar/new")}
          className="bg-neon-purple hover:bg-neon-pink text-white"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Yeni Kullanıcı Ekle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <Card
            key={user._id}
            className="bg-gray-800 border-2 border-neon-blue shadow-lg hover:shadow-neon-blue transition-shadow duration-300"
          >
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-neon-pink">{user.name}</h2>
              <div className="space-y-2">
                <p className="text-neon-blue">
                  E-posta: <span className="text-neon-green">{user.email}</span>
                </p>
                <p className="text-neon-yellow">
                  Rol: <span className="text-neon-cyan">{user.role}</span>
                </p>
              </div>
              <Button
                onClick={() => handleEdit(user._id)}
                className="w-full bg-neon-cyan hover:bg-neon-blue text-gray-900"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Düzenle
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
