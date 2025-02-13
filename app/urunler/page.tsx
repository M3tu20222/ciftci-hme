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

interface Urun {
  _id: string;
  ad: string;
  kategori: string;
  marka: string;
  birim: string;
  sezon_id: { _id: string; ad: string };
}

interface Sezon {
  _id: string;
  ad: string;
}

export default function UrunlerPage() {
  const [urunler, setUrunler] = useState<Urun[]>([]);
  const [sezonlar, setSezonlar] = useState<Sezon[]>([]);
  const [yeniUrun, setYeniUrun] = useState<Partial<Urun>>({});
  const [editingUrun, setEditingUrun] = useState<Urun | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchUrunler();
    fetchSezonlar();
  }, [session, status, router]);

  const fetchUrunler = async () => {
    try {
      const response = await fetch("/api/urunler");
      if (!response.ok) throw new Error("Ürünleri getirme hatası");
      const data = await response.json();
      setUrunler(data);
    } catch (error) {
      console.error("Ürünleri getirme hatası:", error);
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

  const handleAddUrun = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/urunler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(yeniUrun),
      });
      if (!response.ok) throw new Error("Ürün ekleme hatası");
      fetchUrunler();
      setYeniUrun({});
    } catch (error) {
      console.error("Ürün ekleme hatası:", error);
    }
  };

  const handleEditUrun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUrun) return;
    try {
      const response = await fetch(`/api/urunler/${editingUrun._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUrun),
      });
      if (!response.ok) throw new Error("Ürün güncelleme hatası");
      fetchUrunler();
      setEditingUrun(null);
    } catch (error) {
      console.error("Ürün güncelleme hatası:", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-yellow title-glow">
          Ürün Yönetimi
        </h1>

        <div className="flex justify-end mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-neon-yellow hover:bg-neon-orange text-black">
                <PlusCircle className="mr-2 h-4 w-4" /> Yeni Ürün Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-2 border-neon-yellow">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-neon-yellow">
                  Yeni Ürün Ekle
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddUrun}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ad" className="text-right text-neon-blue">
                      Ad
                    </Label>
                    <Input
                      id="ad"
                      value={yeniUrun.ad || ""}
                      onChange={(e) =>
                        setYeniUrun({ ...yeniUrun, ad: e.target.value })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="kategori"
                      className="text-right text-neon-blue"
                    >
                      Kategori
                    </Label>
                    <Input
                      id="kategori"
                      value={yeniUrun.kategori || ""}
                      onChange={(e) =>
                        setYeniUrun({ ...yeniUrun, kategori: e.target.value })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="marka"
                      className="text-right text-neon-blue"
                    >
                      Marka
                    </Label>
                    <Input
                      id="marka"
                      value={yeniUrun.marka || ""}
                      onChange={(e) =>
                        setYeniUrun({ ...yeniUrun, marka: e.target.value })
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
                      value={yeniUrun.birim || ""}
                      onChange={(e) =>
                        setYeniUrun({ ...yeniUrun, birim: e.target.value })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="sezon"
                      className="text-right text-neon-blue"
                    >
                      Sezon
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setYeniUrun({
                          ...yeniUrun,
                          sezon_id: { _id: value, ad: "" },
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3 bg-gray-800 text-neon-green border-neon-green">
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
          {urunler.map((urun) => (
            <Card
              key={urun._id}
              className="bg-gray-800 border-2 border-neon-yellow shadow-lg hover:shadow-neon-yellow transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-neon-yellow flex items-center">
                  <Package className="mr-2 h-5 w-5 text-neon-yellow" />
                  {urun.ad}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neon-blue">
                  Kategori:{" "}
                  <span className="text-neon-green">{urun.kategori}</span>
                </p>
                <p className="text-neon-blue">
                  Marka: <span className="text-neon-green">{urun.marka}</span>
                </p>
                <p className="text-neon-blue">
                  Birim: <span className="text-neon-green">{urun.birim}</span>
                </p>
                <p className="text-neon-blue">
                  Sezon:{" "}
                  <span className="text-neon-green">{urun.sezon_id.ad}</span>
                </p>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-neon-cyan hover:bg-neon-blue text-black"
                      onClick={() => setEditingUrun(urun)}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Düzenle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-2 border-neon-yellow">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-neon-yellow">
                        Ürün Düzenle
                      </DialogTitle>
                    </DialogHeader>
                    {editingUrun && (
                      <form onSubmit={handleEditUrun}>
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
                              value={editingUrun.ad}
                              onChange={(e) =>
                                setEditingUrun({
                                  ...editingUrun,
                                  ad: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-kategori"
                              className="text-right text-neon-blue"
                            >
                              Kategori
                            </Label>
                            <Input
                              id="edit-kategori"
                              value={editingUrun.kategori}
                              onChange={(e) =>
                                setEditingUrun({
                                  ...editingUrun,
                                  kategori: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-marka"
                              className="text-right text-neon-blue"
                            >
                              Marka
                            </Label>
                            <Input
                              id="edit-marka"
                              value={editingUrun.marka}
                              onChange={(e) =>
                                setEditingUrun({
                                  ...editingUrun,
                                  marka: e.target.value,
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
                              value={editingUrun.birim}
                              onChange={(e) =>
                                setEditingUrun({
                                  ...editingUrun,
                                  birim: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-sezon"
                              className="text-right text-neon-blue"
                            >
                              Sezon
                            </Label>
                            <Select
                              value={editingUrun.sezon_id._id}
                              onValueChange={(value) =>
                                setEditingUrun({
                                  ...editingUrun,
                                  sezon_id: {
                                    _id: value,
                                    ad:
                                      sezonlar.find((s) => s._id === value)
                                        ?.ad || "",
                                  },
                                })
                              }
                            >
                              <SelectTrigger className="col-span-3 bg-gray-800 text-neon-green border-neon-green">
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
    </Layout>
  );
}
