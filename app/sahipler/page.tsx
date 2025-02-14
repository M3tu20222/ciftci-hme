"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, User, Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface Sahip {
  _id: string;
  ad: string;
  tip: string;
  user_id: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function SahiplerPage() {
  const [sahipler, setSahipler] = useState<Sahip[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [yeniSahip, setYeniSahip] = useState<Partial<Sahip>>({});
  const [editingSahip, setEditingSahip] = useState<Sahip | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const fetchSahipler = useCallback(async () => {
    try {
      const response = await fetch("/api/sahipler");
      if (!response.ok) throw new Error("Sahipleri getirme hatası");
      const data = await response.json();
      setSahipler(data);
    } catch (error) {
      console.error("Sahipleri getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Sahipleri getirirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Kullanıcıları getirme hatası");
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("API users verisi bir dizi değil:", data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Kullanıcıları getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Kullanıcıları getirirken bir hata oluştu.",
        variant: "destructive",
      });
      setUsers([]);
    }
  }, [toast]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchSahipler();
    fetchUsers();
  }, [session, status, router, fetchSahipler, fetchUsers]);

  const handleAddSahip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/sahipler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(yeniSahip),
      });
      if (!response.ok) throw new Error("Sahip ekleme hatası");
      await fetchSahipler();
      setYeniSahip({});
      toast({
        title: "Başarılı",
        description: "Yeni sahip başarıyla eklendi.",
      });
    } catch (error) {
      console.error("Sahip ekleme hatası:", error);
      toast({
        title: "Hata",
        description: "Sahip eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleEditSahip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSahip) return;
    try {
      const response = await fetch(`/api/sahipler/${editingSahip._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSahip),
      });
      if (!response.ok) throw new Error("Sahip güncelleme hatası");
      await fetchSahipler();
      setEditingSahip(null);
      toast({
        title: "Başarılı",
        description: "Sahip başarıyla güncellendi.",
      });
    } catch (error) {
      console.error("Sahip güncelleme hatası:", error);
      toast({
        title: "Hata",
        description: "Sahip güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-purple title-glow">
          Sahip Yönetimi
        </h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-neon-purple hover:bg-neon-pink text-white">
              <PlusCircle className="mr-2 h-4 w-4" /> Yeni Sahip Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-2 border-neon-purple">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-neon-purple">
                Yeni Sahip Ekle
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSahip}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="user" className="text-right text-neon-blue">
                    Kullanıcı
                  </Label>
                  <Select
                    value={yeniSahip.user_id || ""}
                    onValueChange={(value) =>
                      setYeniSahip({
                        ...yeniSahip,
                        user_id: value,
                        ad: users.find((u) => u._id === value)?.name || "",
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue">
                      <SelectValue placeholder="Kullanıcı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tip" className="text-right text-neon-blue">
                    Tip
                  </Label>
                  <Select
                    value={yeniSahip.tip || ""}
                    onValueChange={(value) =>
                      setYeniSahip({ ...yeniSahip, tip: value })
                    }
                  >
                    <SelectTrigger className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue">
                      <SelectValue placeholder="Tip seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bireysel">Bireysel</SelectItem>
                      <SelectItem value="Kurumsal">Kurumsal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-neon-green hover:bg-neon-blue text-black"
                >
                  Ekle
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sahipler.map((sahip) => (
            <Card
              key={sahip._id}
              className="bg-gray-800 border-2 border-neon-purple shadow-lg hover:shadow-neon-purple transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-neon-pink flex items-center">
                  <User className="mr-2 h-5 w-5 text-neon-purple" />
                  {sahip.ad}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neon-blue">
                  Tip: <span className="text-neon-green">{sahip.tip}</span>
                </p>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-neon-cyan hover:bg-neon-blue text-black"
                      onClick={() => setEditingSahip(sahip)}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Düzenle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-2 border-neon-purple">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-neon-purple">
                        Sahip Düzenle
                      </DialogTitle>
                    </DialogHeader>
                    {editingSahip && (
                      <form onSubmit={handleEditSahip}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-user"
                              className="text-right text-neon-blue"
                            >
                              Kullanıcı
                            </Label>
                            <Select
                              value={editingSahip.user_id}
                              onValueChange={(value) =>
                                setEditingSahip({
                                  ...editingSahip,
                                  user_id: value,
                                  ad:
                                    users.find((u) => u._id === value)?.name ||
                                    "",
                                })
                              }
                            >
                              <SelectTrigger className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue">
                                <SelectValue placeholder="Kullanıcı seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                {users.map((user) => (
                                  <SelectItem key={user._id} value={user._id}>
                                    {user.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-tip"
                              className="text-right text-neon-blue"
                            >
                              Tip
                            </Label>
                            <Select
                              value={editingSahip.tip}
                              onValueChange={(value) =>
                                setEditingSahip({ ...editingSahip, tip: value })
                              }
                            >
                              <SelectTrigger className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue">
                                <SelectValue placeholder="Tip seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Bireysel">
                                  Bireysel
                                </SelectItem>
                                <SelectItem value="Kurumsal">
                                  Kurumsal
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            type="submit"
                            className="bg-neon-green hover:bg-neon-blue text-black"
                          >
                            Güncelle
                          </Button>
                        </DialogFooter>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <Toaster />
    </Layout>
  );
}
