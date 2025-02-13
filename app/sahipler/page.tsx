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
import { PlusCircle, Pencil, User } from "lucide-react";

interface Sahip {
  _id: string;
  ad: string;
  tip: string;
}

export default function SahiplerPage() {
  const [sahipler, setSahipler] = useState<Sahip[]>([]);
  const [yeniSahip, setYeniSahip] = useState<Partial<Sahip>>({});
  const [editingSahip, setEditingSahip] = useState<Sahip | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchSahipler();
  }, [session, status, router]);

  const fetchSahipler = async () => {
    try {
      const response = await fetch("/api/sahipler");
      if (!response.ok) throw new Error("Sahipleri getirme hatası");
      const data = await response.json();
      setSahipler(data);
    } catch (error) {
      console.error("Sahipleri getirme hatası:", error);
    }
  };

  const handleAddSahip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/sahipler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(yeniSahip),
      });
      if (!response.ok) throw new Error("Sahip ekleme hatası");
      fetchSahipler();
      setYeniSahip({});
    } catch (error) {
      console.error("Sahip ekleme hatası:", error);
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
      fetchSahipler();
      setEditingSahip(null);
    } catch (error) {
      console.error("Sahip güncelleme hatası:", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-purple title-glow">
          Sahip Yönetimi
        </h1>

        <div className="flex justify-end mb-4">
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
                    <Label htmlFor="ad" className="text-right text-neon-blue">
                      Ad
                    </Label>
                    <Input
                      id="ad"
                      value={yeniSahip.ad || ""}
                      onChange={(e) =>
                        setYeniSahip({ ...yeniSahip, ad: e.target.value })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tip" className="text-right text-neon-blue">
                      Tip
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setYeniSahip({ ...yeniSahip, tip: value })
                      }
                    >
                      <SelectTrigger className="col-span-3 bg-gray-800 text-neon-green border-neon-green">
                        <SelectValue placeholder="Tip seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ortak">Ortak</SelectItem>
                        <SelectItem value="Çalışan">Çalışan</SelectItem>
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
        </div>

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
                              htmlFor="edit-ad"
                              className="text-right text-neon-blue"
                            >
                              Ad
                            </Label>
                            <Input
                              id="edit-ad"
                              value={editingSahip.ad}
                              onChange={(e) =>
                                setEditingSahip({
                                  ...editingSahip,
                                  ad: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
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
                              <SelectTrigger className="col-span-3 bg-gray-800 text-neon-green border-neon-green">
                                <SelectValue placeholder="Tip seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Ortak">Ortak</SelectItem>
                                <SelectItem value="Çalışan">Çalışan</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
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
    </Layout>
  );
}
