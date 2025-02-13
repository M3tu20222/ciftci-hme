"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { X, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface TarlaSahip {
  _id: string;
  tarla_id: {
    _id: string;
    ad: string;
  };
  sahipler: {
    sahip_id: {
      _id: string;
      name: string;
    };
    yuzde: number;
  }[];
}

interface Tarla {
  _id: string;
  ad: string;
}

export default function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [tarlaSahipler, setTarlaSahipler] = useState<TarlaSahip[]>([]);
  const [tarlalar, setTarlalar] = useState<Tarla[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingTarlaSahip, setEditingTarlaSahip] = useState<TarlaSahip | null>(
    null
  );
  const session = useSession();
  const status = session.status;
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session.data || session.data.user?.role !== "admin") {
      router.push("/");
      return;
    }
    fetchUsers();
    fetchTarlaSahipler();
    fetchTarlalar();
  }, [session, status, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Kullanıcıları getirme hatası");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Kullanıcıları getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Kullanıcıları getirirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const fetchTarlaSahipler = async () => {
    try {
      const response = await fetch("/api/tarla-sahipler");
      if (!response.ok) throw new Error("Tarla sahiplerini getirme hatası");
      const data = await response.json();
      setTarlaSahipler(data);
    } catch (error) {
      console.error("Tarla sahiplerini getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Tarla sahiplerini getirirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const fetchTarlalar = async () => {
    try {
      const response = await fetch("/api/tarlalar");
      if (!response.ok) throw new Error("Tarlaları getirme hatası");
      const data = await response.json();
      setTarlalar(data);
    } catch (error) {
      console.error("Tarlaları getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Tarlaları getirirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const response = await fetch(`/api/users/${editingUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      });
      if (!response.ok) throw new Error("Kullanıcı güncelleme hatası");
      fetchUsers();
      setEditingUser(null);
      toast({
        title: "Başarılı",
        description: "Kullanıcı başarıyla güncellendi.",
      });
    } catch (error) {
      console.error("Kullanıcı güncelleme hatası:", error);
      toast({
        title: "Hata",
        description: "Kullanıcı güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleEditTarlaSahip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTarlaSahip) return;
    try {
      const response = await fetch(
        `/api/tarla-sahipler/${editingTarlaSahip._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingTarlaSahip),
        }
      );
      if (!response.ok) throw new Error("Tarla sahipliği güncelleme hatası");
      fetchTarlaSahipler();
      setEditingTarlaSahip(null);
      toast({
        title: "Başarılı",
        description: "Tarla sahipliği başarıyla güncellendi.",
      });
    } catch (error) {
      console.error("Tarla sahipliği güncelleme hatası:", error);
      toast({
        title: "Hata",
        description: "Tarla sahipliği güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-pink title-glow">
          Kullanıcı ve Tarla Sahipliği Yönetimi
        </h1>

        {/* Kullanıcı Listesi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <Card
              key={user._id}
              className="bg-gray-800 border-2 border-neon-blue shadow-lg hover:shadow-neon-blue transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-neon-pink">{user.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neon-green">Email: {user.email}</p>
                <p className="text-neon-cyan">Rol: {user.role}</p>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-neon-purple hover:bg-neon-pink text-white"
                      onClick={() => setEditingUser(user)}
                    >
                      Düzenle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-2 border-neon-blue">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-neon-blue">
                        Kullanıcı Düzenle
                      </DialogTitle>
                    </DialogHeader>
                    {editingUser && (
                      <form onSubmit={handleEditUser}>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name" className="text-neon-green">
                              İsim
                            </Label>
                            <Input
                              id="name"
                              value={editingUser.name}
                              onChange={(e) =>
                                setEditingUser({
                                  ...editingUser,
                                  name: e.target.value,
                                })
                              }
                              className="bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email" className="text-neon-green">
                              Email
                            </Label>
                            <Input
                              id="email"
                              value={editingUser.email}
                              onChange={(e) =>
                                setEditingUser({
                                  ...editingUser,
                                  email: e.target.value,
                                })
                              }
                              className="bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div>
                            <Label htmlFor="role" className="text-neon-green">
                              Rol
                            </Label>
                            <Select
                              value={editingUser.role}
                              onValueChange={(value) =>
                                setEditingUser({ ...editingUser, role: value })
                              }
                            >
                              <SelectTrigger className="bg-gray-800 text-neon-green border-neon-green">
                                <SelectValue placeholder="Rol seçin" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-neon-green">
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="ortak">Ortak</SelectItem>
                                <SelectItem value="işçi">İşçi</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter className="mt-6">
                          <Button
                            type="submit"
                            className="bg-neon-green hover:bg-neon-blue text-black"
                          >
                            Kaydet
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

        {/* Tarla Sahipliği Listesi */}
        <h2 className="text-3xl font-bold text-center mt-12 mb-8 text-neon-cyan title-glow">
          Tarla Sahipliği
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tarlaSahipler.map((tarlaSahip) => (
            <Card
              key={tarlaSahip._id}
              className="bg-gray-800 border-2 border-neon-green shadow-lg hover:shadow-neon-green transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-neon-cyan">
                  {tarlaSahip.tarla_id.ad}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tarlaSahip.sahipler.map((sahip, index) => (
                  <p key={index} className="text-neon-yellow">
                    {sahip.sahip_id.name}:{" "}
                    <span className="text-neon-pink">{sahip.yuzde}%</span>
                  </p>
                ))}
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-neon-cyan hover:bg-neon-blue text-black"
                      onClick={() => setEditingTarlaSahip(tarlaSahip)}
                    >
                      Düzenle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-2 border-neon-green">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-neon-green">
                        Tarla Sahipliği Düzenle
                      </DialogTitle>
                    </DialogHeader>
                    {editingTarlaSahip && (
                      <form onSubmit={handleEditTarlaSahip}>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="tarla" className="text-neon-cyan">
                              Tarla
                            </Label>
                            <Select
                              value={editingTarlaSahip.tarla_id._id}
                              onValueChange={(value) =>
                                setEditingTarlaSahip({
                                  ...editingTarlaSahip,
                                  tarla_id: {
                                    _id: value,
                                    ad:
                                      tarlalar.find((t) => t._id === value)
                                        ?.ad || "",
                                  },
                                })
                              }
                            >
                              <SelectTrigger className="bg-gray-800 text-neon-yellow border-neon-yellow">
                                <SelectValue placeholder="Tarla seçin" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-neon-yellow">
                                {tarlalar.map((tarla) => (
                                  <SelectItem key={tarla._id} value={tarla._id}>
                                    {tarla.ad}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {editingTarlaSahip.sahipler.map((sahip, index) => (
                            <div key={index} className="space-y-2">
                              <Label
                                htmlFor={`sahip-${index}`}
                                className="text-neon-cyan"
                              >
                                Sahip {index + 1}
                              </Label>
                              <div className="flex space-x-2">
                                <Select
                                  value={sahip.sahip_id._id}
                                  onValueChange={(value) => {
                                    const newSahipler = [
                                      ...editingTarlaSahip.sahipler,
                                    ];
                                    newSahipler[index].sahip_id = {
                                      _id: value,
                                      name:
                                        users.find((u) => u._id === value)
                                          ?.name || "",
                                    };
                                    setEditingTarlaSahip({
                                      ...editingTarlaSahip,
                                      sahipler: newSahipler,
                                    });
                                  }}
                                >
                                  <SelectTrigger className="bg-gray-800 text-neon-yellow border-neon-yellow">
                                    <SelectValue placeholder="Sahip seçin" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-gray-800 border-neon-yellow">
                                    {users.map((user) => (
                                      <SelectItem
                                        key={user._id}
                                        value={user._id}
                                      >
                                        {user.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Input
                                  type="number"
                                  value={sahip.yuzde}
                                  onChange={(e) => {
                                    const newSahipler = [
                                      ...editingTarlaSahip.sahipler,
                                    ];
                                    newSahipler[index].yuzde = Number(
                                      e.target.value
                                    );
                                    setEditingTarlaSahip({
                                      ...editingTarlaSahip,
                                      sahipler: newSahipler,
                                    });
                                  }}
                                  className="w-24 bg-gray-800 text-neon-pink border-neon-pink"
                                  min="0"
                                  max="100"
                                />
                                <Button
                                  type="button"
                                  onClick={() => {
                                    const newSahipler =
                                      editingTarlaSahip.sahipler.filter(
                                        (_, i) => i !== index
                                      );
                                    setEditingTarlaSahip({
                                      ...editingTarlaSahip,
                                      sahipler: newSahipler,
                                    });
                                  }}
                                  className="bg-neon-red hover:bg-neon-pink text-white"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button
                            type="button"
                            onClick={() => {
                              const newSahipler = [
                                ...editingTarlaSahip.sahipler,
                                { sahip_id: { _id: "", name: "" }, yuzde: 0 },
                              ];
                              setEditingTarlaSahip({
                                ...editingTarlaSahip,
                                sahipler: newSahipler,
                              });
                            }}
                            className="bg-neon-green hover:bg-neon-blue text-black"
                          >
                            <Plus className="mr-2 h-4 w-4" /> Sahip Ekle
                          </Button>
                        </div>
                        <DialogFooter className="mt-6">
                          <Button
                            type="submit"
                            className="bg-neon-green hover:bg-neon-blue text-black"
                          >
                            Kaydet
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
