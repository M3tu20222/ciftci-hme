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
import { PlusCircle, Pencil, Package } from "lucide-react";
import { format } from "date-fns";

interface GubreStok {
  _id: string;
  gubre_id: {
    _id: string;
    ad: string;
  };
  miktar: number;
  alim_tarihi: string;
  son_kullanma_tarihi: string;
  fiyat: number;
  tedarikci: string;
}

interface Gubre {
  _id: string;
  ad: string;
}

export default function GubreStokPage() {
  const [gubreStoklar, setGubreStoklar] = useState<GubreStok[]>([]);
  const [gubreler, setGubreler] = useState<Gubre[]>([]);
  const [yeniGubreStok, setYeniGubreStok] = useState<Partial<GubreStok>>({});
  const [editingGubreStok, setEditingGubreStok] = useState<GubreStok | null>(
    null
  );
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchGubreStoklar();
    fetchGubreler();
  }, [session, status, router]);

  const fetchGubreStoklar = async () => {
    try {
      const response = await fetch("/api/gubre-stoklar");
      if (!response.ok) throw new Error("Gübre stoklarını getirme hatası");
      const data = await response.json();
      setGubreStoklar(data);
    } catch (error) {
      console.error("Gübre stoklarını getirme hatası:", error);
    }
  };

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

  const handleAddGubreStok = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/gubre-stoklar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(yeniGubreStok),
      });
      if (!response.ok) throw new Error("Gübre stok ekleme hatası");

      fetchGubreStoklar();
      setYeniGubreStok({});
    } catch (error) {
      console.error("Gübre stok ekleme hatası:", error);
    }
  };

  const handleEditGubreStok = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGubreStok) return;
    try {
      const response = await fetch(
        `/api/gubre-stoklar/${editingGubreStok._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingGubreStok),
        }
      );
      if (!response.ok) throw new Error("Gübre stok güncelleme hatası");
      fetchGubreStoklar();
      setEditingGubreStok(null);
    } catch (error) {
      console.error("Gübre stok güncelleme hatası:", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-blue title-glow">
          Gübre Stok Yönetimi
        </h1>

        <div className="flex justify-end mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-neon-blue hover:bg-neon-cyan text-black">
                <PlusCircle className="mr-2 h-4 w-4" /> Yeni Gübre Stok Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-2 border-neon-blue">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-neon-blue">
                  Yeni Gübre Stok Ekle
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddGubreStok}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="gubre_id"
                      className="text-right text-neon-green"
                    >
                      Gübre
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setYeniGubreStok({
                          ...yeniGubreStok,
                          gubre_id: { _id: value, ad: "" },
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3 bg-gray-800 text-neon-pink border-neon-green">
                        <SelectValue placeholder="Gübre seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {gubreler.map((gubre) => (
                          <SelectItem key={gubre._id} value={gubre._id}>
                            {gubre.ad}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="miktar"
                      className="text-right text-neon-green"
                    >
                      Miktar
                    </Label>
                    <Input
                      id="miktar"
                      type="number"
                      value={yeniGubreStok.miktar || ""}
                      onChange={(e) =>
                        setYeniGubreStok({
                          ...yeniGubreStok,
                          miktar: Number(e.target.value),
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-green"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="alim_tarihi"
                      className="text-right text-neon-green"
                    >
                      Alım Tarihi
                    </Label>
                    <Input
                      id="alim_tarihi"
                      type="date"
                      value={yeniGubreStok.alim_tarihi || ""}
                      onChange={(e) =>
                        setYeniGubreStok({
                          ...yeniGubreStok,
                          alim_tarihi: e.target.value,
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-green"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="son_kullanma_tarihi"
                      className="text-right text-neon-green"
                    >
                      Son Kullanma Tarihi
                    </Label>
                    <Input
                      id="son_kullanma_tarihi"
                      type="date"
                      value={yeniGubreStok.son_kullanma_tarihi || ""}
                      onChange={(e) =>
                        setYeniGubreStok({
                          ...yeniGubreStok,
                          son_kullanma_tarihi: e.target.value,
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-green"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="fiyat"
                      className="text-right text-neon-green"
                    >
                      Fiyat
                    </Label>
                    <Input
                      id="fiyat"
                      type="number"
                      value={yeniGubreStok.fiyat || ""}
                      onChange={(e) =>
                        setYeniGubreStok({
                          ...yeniGubreStok,
                          fiyat: Number(e.target.value),
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-green"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="tedarikci"
                      className="text-right text-neon-green"
                    >
                      Tedarikçi
                    </Label>
                    <Input
                      id="tedarikci"
                      value={yeniGubreStok.tedarikci || ""}
                      onChange={(e) =>
                        setYeniGubreStok({
                          ...yeniGubreStok,
                          tedarikci: e.target.value,
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-green"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-neon-blue hover:bg-neon-cyan text-black"
                  >
                    Ekle
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gubreStoklar.map((gubreStok) => (
            <Card
              key={gubreStok._id}
              className="bg-gray-800 border-2 border-neon-blue shadow-lg hover:shadow-neon-blue transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-neon-blue flex items-center">
                  <Package className="mr-2 h-5 w-5 text-neon-blue" />
                  {gubreStok.gubre_id.ad}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neon-green">
                  Miktar:{" "}
                  <span className="text-neon-pink">{gubreStok.miktar}</span>
                </p>
                <p className="text-neon-green">
                  Alım Tarihi:{" "}
                  <span className="text-neon-pink">
                    {format(new Date(gubreStok.alim_tarihi), "dd.MM.yyyy")}
                  </span>
                </p>
                <p className="text-neon-green">
                  Son Kullanma Tarihi:{" "}
                  <span className="text-neon-pink">
                    {format(
                      new Date(gubreStok.son_kullanma_tarihi),
                      "dd.MM.yyyy"
                    )}
                  </span>
                </p>
                <p className="text-neon-green">
                  Fiyat:{" "}
                  <span className="text-neon-pink">{gubreStok.fiyat} TL</span>
                </p>
                <p className="text-neon-green">
                  Tedarikçi:{" "}
                  <span className="text-neon-pink">{gubreStok.tedarikci}</span>
                </p>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-neon-cyan hover:bg-neon-blue text-black"
                      onClick={() => setEditingGubreStok(gubreStok)}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Düzenle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-2 border-neon-blue">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-neon-blue">
                        Gübre Stok Düzenle
                      </DialogTitle>
                    </DialogHeader>
                    {editingGubreStok && (
                      <form onSubmit={handleEditGubreStok}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-gubre_id"
                              className="text-right text-neon-green"
                            >
                              Gübre
                            </Label>
                            <Select
                              value={editingGubreStok.gubre_id._id}
                              onValueChange={(value) =>
                                setEditingGubreStok({
                                  ...editingGubreStok,
                                  gubre_id: {
                                    _id: value,
                                    ad:
                                      gubreler.find((g) => g._id === value)
                                        ?.ad || "",
                                  },
                                })
                              }
                            >
                              <SelectTrigger className="col-span-3 bg-gray-800 text-neon-pink border-neon-green">
                                <SelectValue placeholder="Gübre seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                {gubreler.map((gubre) => (
                                  <SelectItem key={gubre._id} value={gubre._id}>
                                    {gubre.ad}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-miktar"
                              className="text-right text-neon-green"
                            >
                              Miktar
                            </Label>
                            <Input
                              id="edit-miktar"
                              type="number"
                              value={editingGubreStok.miktar}
                              onChange={(e) =>
                                setEditingGubreStok({
                                  ...editingGubreStok,
                                  miktar: Number(e.target.value),
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-green"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-alim_tarihi"
                              className="text-right text-neon-green"
                            >
                              Alım Tarihi
                            </Label>
                            <Input
                              id="edit-alim_tarihi"
                              type="date"
                              value={format(
                                new Date(editingGubreStok.alim_tarihi),
                                "yyyy-MM-dd"
                              )}
                              onChange={(e) =>
                                setEditingGubreStok({
                                  ...editingGubreStok,
                                  alim_tarihi: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-green"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-son_kullanma_tarihi"
                              className="text-right text-neon-green"
                            >
                              Son Kullanma Tarihi
                            </Label>
                            <Input
                              id="edit-son_kullanma_tarihi"
                              type="date"
                              value={format(
                                new Date(editingGubreStok.son_kullanma_tarihi),
                                "yyyy-MM-dd"
                              )}
                              onChange={(e) =>
                                setEditingGubreStok({
                                  ...editingGubreStok,
                                  son_kullanma_tarihi: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-green"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-fiyat"
                              className="text-right text-neon-green"
                            >
                              Fiyat
                            </Label>
                            <Input
                              id="edit-fiyat"
                              type="number"
                              value={editingGubreStok.fiyat}
                              onChange={(e) =>
                                setEditingGubreStok({
                                  ...editingGubreStok,
                                  fiyat: Number(e.target.value),
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-green"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-tedarikci"
                              className="text-right text-neon-green"
                            >
                              Tedarikçi
                            </Label>
                            <Input
                              id="edit-tedarikci"
                              value={editingGubreStok.tedarikci}
                              onChange={(e) =>
                                setEditingGubreStok({
                                  ...editingGubreStok,
                                  tedarikci: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-green"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            type="submit"
                            className="bg-neon-blue hover:bg-neon-cyan text-black"
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
