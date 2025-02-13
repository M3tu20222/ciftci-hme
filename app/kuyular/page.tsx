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
import { PlusCircle, Pencil, Droplet } from "lucide-react";

interface Kuyu {
  _id: string;
  ad: string;
  bolge: string;
  konum: string;
  derinlik: number;
  kapasite: number;
  durum: string;
  sezon_id: string;
}

interface Sezon {
  _id: string;
  ad: string;
}

export default function KuyularPage() {
  const [kuyular, setKuyular] = useState<Kuyu[]>([]);
  const [sezonlar, setSezonlar] = useState<Sezon[]>([]);
  const [yeniKuyu, setYeniKuyu] = useState<Partial<Kuyu>>({});
  const [editingKuyu, setEditingKuyu] = useState<Kuyu | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchKuyular();
    fetchSezonlar();
  }, [session, status, router]);

  const fetchKuyular = async () => {
    try {
      const response = await fetch("/api/kuyular");
      if (!response.ok) throw new Error("Kuyuları getirme hatası");
      const data = await response.json();
      setKuyular(data);
    } catch (error) {
      console.error("Kuyuları getirme hatası:", error);
    }
  };

  const fetchSezonlar = async () => {
    try {
      const response = await fetch("/api/sezonlar");
      if (!response.ok) throw new Error("Sezonları getirme hatası");
      const data = await response.json();
      setSezonlar(data);
    } catch (error) {
      console.error("Sezonları getirme hatası:", error);
    }
  };

  const handleAddKuyu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/kuyular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(yeniKuyu),
      });
      if (!response.ok) throw new Error("Kuyu ekleme hatası");
      fetchKuyular();
      setYeniKuyu({});
    } catch (error) {
      console.error("Kuyu ekleme hatası:", error);
    }
  };

  const handleEditKuyu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKuyu) return;
    try {
      const response = await fetch(`/api/kuyular/${editingKuyu._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingKuyu),
      });
      if (!response.ok) throw new Error("Kuyu güncelleme hatası");
      fetchKuyular();
      setEditingKuyu(null);
    } catch (error) {
      console.error("Kuyu güncelleme hatası:", error);
    }
  };

  return (
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-blue title-glow">
          Kuyu Yönetimi
        </h1>

        <div className="flex justify-end mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-neon-purple hover:bg-neon-pink text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Yeni Kuyu Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-2 border-neon-blue">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-neon-blue">
                  Yeni Kuyu Ekle
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddKuyu}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ad" className="text-right text-neon-green">
                      Ad
                    </Label>
                    <Input
                      id="ad"
                      value={yeniKuyu.ad || ""}
                      onChange={(e) =>
                        setYeniKuyu({ ...yeniKuyu, ad: e.target.value })
                      }
                      className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="bolge"
                      className="text-right text-neon-green"
                    >
                      Bölge
                    </Label>
                    <Input
                      id="bolge"
                      value={yeniKuyu.bolge || ""}
                      onChange={(e) =>
                        setYeniKuyu({ ...yeniKuyu, bolge: e.target.value })
                      }
                      className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="konum"
                      className="text-right text-neon-green"
                    >
                      Konum
                    </Label>
                    <Input
                      id="konum"
                      value={yeniKuyu.konum || ""}
                      onChange={(e) =>
                        setYeniKuyu({ ...yeniKuyu, konum: e.target.value })
                      }
                      className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="derinlik"
                      className="text-right text-neon-green"
                    >
                      Derinlik
                    </Label>
                    <Input
                      id="derinlik"
                      type="number"
                      value={yeniKuyu.derinlik || ""}
                      onChange={(e) =>
                        setYeniKuyu({
                          ...yeniKuyu,
                          derinlik: Number(e.target.value),
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="kapasite"
                      className="text-right text-neon-green"
                    >
                      Kapasite
                    </Label>
                    <Input
                      id="kapasite"
                      type="number"
                      value={yeniKuyu.kapasite || ""}
                      onChange={(e) =>
                        setYeniKuyu({
                          ...yeniKuyu,
                          kapasite: Number(e.target.value),
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="durum"
                      className="text-right text-neon-green"
                    >
                      Durum
                    </Label>
                    <Input
                      id="durum"
                      value={yeniKuyu.durum || ""}
                      onChange={(e) =>
                        setYeniKuyu({ ...yeniKuyu, durum: e.target.value })
                      }
                      className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="sezon"
                      className="text-right text-neon-green"
                    >
                      Sezon
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setYeniKuyu({ ...yeniKuyu, sezon_id: value })
                      }
                    >
                      <SelectTrigger className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue">
                        <SelectValue placeholder="Sezon seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {sezonlar.map((sezon) => (
                          <SelectItem key={sezon._id} value={sezon._id}>
                            {sezon.ad}
                          </SelectItem>
                        ))}
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
          {kuyular.map((kuyu) => (
            <Card
              key={kuyu._id}
              className="bg-gray-800 border-2 border-neon-blue shadow-lg hover:shadow-neon-blue transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-neon-pink flex items-center">
                  <Droplet className="mr-2 h-5 w-5 text-neon-blue" />
                  {kuyu.ad}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-neon-blue">
                  Bölge: <span className="text-neon-green">{kuyu.bolge}</span>
                </p>
                <p className="text-neon-blue">
                  Konum: <span className="text-neon-green">{kuyu.konum}</span>
                </p>
                <p className="text-neon-blue">
                  Derinlik:{" "}
                  <span className="text-neon-green">{kuyu.derinlik} m</span>
                </p>
                <p className="text-neon-blue">
                  Kapasite:{" "}
                  <span className="text-neon-green">
                    {kuyu.kapasite} m³/saat
                  </span>
                </p>
                <p className="text-neon-blue">
                  Durum: <span className="text-neon-green">{kuyu.durum}</span>
                </p>
                <p className="text-neon-blue">
                  Sezon:{" "}
                  <span className="text-neon-green">
                    {sezonlar.find((s) => s._id === kuyu.sezon_id)?.ad}
                  </span>
                </p>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-neon-cyan hover:bg-neon-blue text-black"
                      onClick={() => setEditingKuyu(kuyu)}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Düzenle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-2 border-neon-blue">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-neon-blue">
                        Kuyu Düzenle
                      </DialogTitle>
                    </DialogHeader>
                    {editingKuyu && (
                      <form onSubmit={handleEditKuyu}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-ad"
                              className="text-right text-neon-green"
                            >
                              Ad
                            </Label>
                            <Input
                              id="edit-ad"
                              value={editingKuyu.ad}
                              onChange={(e) =>
                                setEditingKuyu({
                                  ...editingKuyu,
                                  ad: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-bolge"
                              className="text-right text-neon-green"
                            >
                              Bölge
                            </Label>
                            <Input
                              id="edit-bolge"
                              value={editingKuyu.bolge}
                              onChange={(e) =>
                                setEditingKuyu({
                                  ...editingKuyu,
                                  bolge: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-konum"
                              className="text-right text-neon-green"
                            >
                              Konum
                            </Label>
                            <Input
                              id="edit-konum"
                              value={editingKuyu.konum}
                              onChange={(e) =>
                                setEditingKuyu({
                                  ...editingKuyu,
                                  konum: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-derinlik"
                              className="text-right text-neon-green"
                            >
                              Derinlik
                            </Label>
                            <Input
                              id="edit-derinlik"
                              type="number"
                              value={editingKuyu.derinlik}
                              onChange={(e) =>
                                setEditingKuyu({
                                  ...editingKuyu,
                                  derinlik: Number(e.target.value),
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-kapasite"
                              className="text-right text-neon-green"
                            >
                              Kapasite
                            </Label>
                            <Input
                              id="edit-kapasite"
                              type="number"
                              value={editingKuyu.kapasite}
                              onChange={(e) =>
                                setEditingKuyu({
                                  ...editingKuyu,
                                  kapasite: Number(e.target.value),
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-durum"
                              className="text-right text-neon-green"
                            >
                              Durum
                            </Label>
                            <Input
                              id="edit-durum"
                              value={editingKuyu.durum}
                              onChange={(e) =>
                                setEditingKuyu({
                                  ...editingKuyu,
                                  durum: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-sezon"
                              className="text-right text-neon-green"
                            >
                              Sezon
                            </Label>
                            <Select
                              value={editingKuyu.sezon_id}
                              onValueChange={(value) =>
                                setEditingKuyu({
                                  ...editingKuyu,
                                  sezon_id: value,
                                })
                              }
                            >
                              <SelectTrigger className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue">
                                <SelectValue placeholder="Sezon seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                {sezonlar.map((sezon) => (
                                  <SelectItem key={sezon._id} value={sezon._id}>
                                    {sezon.ad}
                                  </SelectItem>
                                ))}
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
  );
}
