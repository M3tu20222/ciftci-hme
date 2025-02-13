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
import { PlusCircle, Pencil, Leaf } from "lucide-react";

interface Gubre {
  _id: string;
  ad: string;
  tip: string;
  birim: string;
  stok_miktari: number;
  fiyat: number;
  uretici: string;
}

export default function GubrelerPage() {
  const [gubreler, setGubreler] = useState<Gubre[]>([]);
  const [yeniGubre, setYeniGubre] = useState<Partial<Gubre>>({});
  const [editingGubre, setEditingGubre] = useState<Gubre | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchGubreler();
  }, [session, status, router]);

  const fetchGubreler = async () => {
    try {
      const response = await fetch("/api/gubreler");
      if (!response.ok) throw new Error("Gübreleri getirme hatası");
      const data = await response.json();
      setGubreler(data);
    } catch (error) {
      console.error("Gübreleri getirme hatası:", error);
    }
  };

  const handleAddGubre = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/gubreler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(yeniGubre),
      });
      if (!response.ok) throw new Error("Gübre ekleme hatası");
      fetchGubreler();
      setYeniGubre({});
    } catch (error) {
      console.error("Gübre ekleme hatası:", error);
    }
  };

  const handleEditGubre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGubre) return;
    try {
      const response = await fetch(`/api/gubreler/${editingGubre._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingGubre),
      });
      if (!response.ok) throw new Error("Gübre güncelleme hatası");
      fetchGubreler();
      setEditingGubre(null);
    } catch (error) {
      console.error("Gübre güncelleme hatası:", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-green title-glow">
          Gübre Yönetimi
        </h1>

        <div className="flex justify-end mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-neon-green hover:bg-neon-blue text-black">
                <PlusCircle className="mr-2 h-4 w-4" /> Yeni Gübre Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-2 border-neon-green">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-neon-green">
                  Yeni Gübre Ekle
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddGubre}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ad" className="text-right text-neon-blue">
                      Ad
                    </Label>
                    <Input
                      id="ad"
                      value={yeniGubre.ad || ""}
                      onChange={(e) =>
                        setYeniGubre({ ...yeniGubre, ad: e.target.value })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tip" className="text-right text-neon-blue">
                      Tip
                    </Label>
                    <Input
                      id="tip"
                      value={yeniGubre.tip || ""}
                      onChange={(e) =>
                        setYeniGubre({ ...yeniGubre, tip: e.target.value })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="birim"
                      className="text-right text-neon-blue"
                    >
                      Birim
                    </Label>
                    <Input
                      id="birim"
                      value={yeniGubre.birim || ""}
                      onChange={(e) =>
                        setYeniGubre({ ...yeniGubre, birim: e.target.value })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="stok_miktari"
                      className="text-right text-neon-blue"
                    >
                      Stok Miktarı
                    </Label>
                    <Input
                      id="stok_miktari"
                      type="number"
                      value={yeniGubre.stok_miktari || ""}
                      onChange={(e) =>
                        setYeniGubre({
                          ...yeniGubre,
                          stok_miktari: Number(e.target.value),
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="fiyat"
                      className="text-right text-neon-blue"
                    >
                      Fiyat
                    </Label>
                    <Input
                      id="fiyat"
                      type="number"
                      value={yeniGubre.fiyat || ""}
                      onChange={(e) =>
                        setYeniGubre({
                          ...yeniGubre,
                          fiyat: Number(e.target.value),
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="uretici"
                      className="text-right text-neon-blue"
                    >
                      Üretici
                    </Label>
                    <Input
                      id="uretici"
                      value={yeniGubre.uretici || ""}
                      onChange={(e) =>
                        setYeniGubre({ ...yeniGubre, uretici: e.target.value })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
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
          {gubreler.map((gubre) => (
            <Card
              key={gubre._id}
              className="bg-gray-800 border-2 border-neon-green shadow-lg hover:shadow-neon-green transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-neon-green flex items-center">
                  <Leaf className="mr-2 h-5 w-5 text-neon-green" />
                  {gubre.ad}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neon-blue">
                  Tip: <span className="text-neon-pink">{gubre.tip}</span>
                </p>
                <p className="text-neon-blue">
                  Birim: <span className="text-neon-pink">{gubre.birim}</span>
                </p>
                <p className="text-neon-blue">
                  Stok Miktarı:{" "}
                  <span className="text-neon-pink">{gubre.stok_miktari}</span>
                </p>
                <p className="text-neon-blue">
                  Fiyat:{" "}
                  <span className="text-neon-pink">{gubre.fiyat} TL</span>
                </p>
                <p className="text-neon-blue">
                  Üretici:{" "}
                  <span className="text-neon-pink">{gubre.uretici}</span>
                </p>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-neon-cyan hover:bg-neon-blue text-black"
                      onClick={() => setEditingGubre(gubre)}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Düzenle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-2 border-neon-green">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-neon-green">
                        Gübre Düzenle
                      </DialogTitle>
                    </DialogHeader>
                    {editingGubre && (
                      <form onSubmit={handleEditGubre}>
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
                              value={editingGubre.ad}
                              onChange={(e) =>
                                setEditingGubre({
                                  ...editingGubre,
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
                            <Input
                              id="edit-tip"
                              value={editingGubre.tip}
                              onChange={(e) =>
                                setEditingGubre({
                                  ...editingGubre,
                                  tip: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-birim"
                              className="text-right text-neon-blue"
                            >
                              Birim
                            </Label>
                            <Input
                              id="edit-birim"
                              value={editingGubre.birim}
                              onChange={(e) =>
                                setEditingGubre({
                                  ...editingGubre,
                                  birim: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-stok_miktari"
                              className="text-right text-neon-blue"
                            >
                              Stok Miktarı
                            </Label>
                            <Input
                              id="edit-stok_miktari"
                              type="number"
                              value={editingGubre.stok_miktari}
                              onChange={(e) =>
                                setEditingGubre({
                                  ...editingGubre,
                                  stok_miktari: Number(e.target.value),
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-fiyat"
                              className="text-right text-neon-blue"
                            >
                              Fiyat
                            </Label>
                            <Input
                              id="edit-fiyat"
                              type="number"
                              value={editingGubre.fiyat}
                              onChange={(e) =>
                                setEditingGubre({
                                  ...editingGubre,
                                  fiyat: Number(e.target.value),
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-uretici"
                              className="text-right text-neon-blue"
                            >
                              Üretici
                            </Label>
                            <Input
                              id="edit-uretici"
                              value={editingGubre.uretici}
                              onChange={(e) =>
                                setEditingGubre({
                                  ...editingGubre,
                                  uretici: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
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
