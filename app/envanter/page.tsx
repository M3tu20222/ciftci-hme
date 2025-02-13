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

interface EnvanterItem {
  _id: string;
  ad: string;
  kategori: string;
  altKategori: string;
  miktar: number;
  birim: string;
  mevcutDeger: number;
  yakitTuketimi: number;
  sahipler: Array<{ sahip: { _id: string; name: string }; oran: number }>;
}

export default function EnvanterPage() {
  const [envanterItems, setEnvanterItems] = useState<EnvanterItem[]>([]);
  const [yeniItem, setYeniItem] = useState<Partial<EnvanterItem>>({});
  const [editingItem, setEditingItem] = useState<EnvanterItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchEnvanterItems();
  }, [session, status, router]);

  const fetchEnvanterItems = async () => {
    try {
      const response = await fetch("/api/envanter");
      if (!response.ok) throw new Error("Envanter öğelerini getirme hatası");
      const data = await response.json();
      setEnvanterItems(data);
    } catch (error) {
      console.error("Envanter öğelerini getirme hatası:", error);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/envanter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(yeniItem),
      });
      if (!response.ok) throw new Error("Envanter öğesi ekleme hatası");
      fetchEnvanterItems();
      setYeniItem({});
    } catch (error) {
      console.error("Envanter öğesi ekleme hatası:", error);
    }
  };

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const response = await fetch(`/api/envanter/${editingItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });
      if (!response.ok) throw new Error("Envanter öğesi güncelleme hatası");
      fetchEnvanterItems();
      setEditingItem(null);
    } catch (error) {
      console.error("Envanter öğesi güncelleme hatası:", error);
    }
  };

  const filteredItems = envanterItems.filter(
    (item) =>
      (item.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kategori.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === "all" || item.kategori === categoryFilter)
  );

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-green title-glow">
          Envanter Yönetimi
        </h1>

        <div className="flex justify-between items-center mb-6">
          <Input
            type="text"
            placeholder="Envanter ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3 bg-gray-800 text-neon-blue placeholder-neon-blue/50 border-neon-blue focus:ring-neon-green"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px] bg-gray-800 text-neon-green border-neon-green">
              <SelectValue placeholder="Kategori Filtrele" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
              <SelectItem value="all">Tümü</SelectItem>
              {Array.from(
                new Set(envanterItems.map((item) => item.kategori))
              ).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-neon-purple hover:bg-neon-pink text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Yeni Envanter Öğesi Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-2 border-neon-green">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-neon-green">
                  Yeni Envanter Öğesi Ekle
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddItem}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ad" className="text-right text-neon-blue">
                      Ad
                    </Label>
                    <Input
                      id="ad"
                      value={yeniItem.ad || ""}
                      onChange={(e) =>
                        setYeniItem({ ...yeniItem, ad: e.target.value })
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
                      value={yeniItem.kategori || ""}
                      onChange={(e) =>
                        setYeniItem({ ...yeniItem, kategori: e.target.value })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="altKategori"
                      className="text-right text-neon-blue"
                    >
                      Alt Kategori
                    </Label>
                    <Input
                      id="altKategori"
                      value={yeniItem.altKategori || ""}
                      onChange={(e) =>
                        setYeniItem({
                          ...yeniItem,
                          altKategori: e.target.value,
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="miktar"
                      className="text-right text-neon-blue"
                    >
                      Miktar
                    </Label>
                    <Input
                      id="miktar"
                      type="number"
                      value={yeniItem.miktar || ""}
                      onChange={(e) =>
                        setYeniItem({
                          ...yeniItem,
                          miktar: Number(e.target.value),
                        })
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
                      value={yeniItem.birim || ""}
                      onChange={(e) =>
                        setYeniItem({ ...yeniItem, birim: e.target.value })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="mevcutDeger"
                      className="text-right text-neon-blue"
                    >
                      Mevcut Değer
                    </Label>
                    <Input
                      id="mevcutDeger"
                      type="number"
                      value={yeniItem.mevcutDeger || ""}
                      onChange={(e) =>
                        setYeniItem({
                          ...yeniItem,
                          mevcutDeger: Number(e.target.value),
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="yakitTuketimi"
                      className="text-right text-neon-blue"
                    >
                      Yakıt Tüketimi
                    </Label>
                    <Input
                      id="yakitTuketimi"
                      type="number"
                      value={yeniItem.yakitTuketimi || ""}
                      onChange={(e) =>
                        setYeniItem({
                          ...yeniItem,
                          yakitTuketimi: Number(e.target.value),
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
                    Ekle
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Card
              key={item._id}
              className="bg-gray-800 border-2 border-neon-green shadow-lg hover:shadow-neon-green transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-neon-pink flex items-center">
                  <Package className="mr-2 h-5 w-5 text-neon-green" />
                  {item.ad}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-neon-blue">
                  Kategori:{" "}
                  <span className="text-neon-pink">{item.kategori}</span>
                </p>
                <p className="text-neon-blue">
                  Alt Kategori:{" "}
                  <span className="text-neon-pink">{item.altKategori}</span>
                </p>
                <p className="text-neon-blue">
                  Miktar:{" "}
                  <span className="text-neon-pink">
                    {item.miktar} {item.birim}
                  </span>
                </p>
                <p className="text-neon-blue">
                  Mevcut Değer:{" "}
                  <span className="text-neon-pink">{item.mevcutDeger} TL</span>
                </p>
                <p className="text-neon-blue">
                  Yakıt Tüketimi:{" "}
                  <span className="text-neon-pink">
                    {item.yakitTuketimi} L/Dekar
                  </span>
                </p>
                <div className="text-neon-blue">
                  Sahipler:
                  <ul className="list-disc list-inside">
                    {item.sahipler.map((sahip, index) => (
                      <li key={index} className="text-neon-pink">
                        {sahip.sahip.name} ({sahip.oran}%)
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-neon-cyan hover:bg-neon-blue text-black"
                      onClick={() => setEditingItem(item)}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Düzenle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-2 border-neon-green">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-neon-green">
                        Envanter Öğesi Düzenle
                      </DialogTitle>
                    </DialogHeader>
                    {editingItem && (
                      <form onSubmit={handleEditItem}>
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
                              value={editingItem.ad}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
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
                              value={editingItem.kategori}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  kategori: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-altKategori"
                              className="text-right text-neon-blue"
                            >
                              Alt Kategori
                            </Label>
                            <Input
                              id="edit-altKategori"
                              value={editingItem.altKategori}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  altKategori: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-miktar"
                              className="text-right text-neon-blue"
                            >
                              Miktar
                            </Label>
                            <Input
                              id="edit-miktar"
                              type="number"
                              value={editingItem.miktar}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  miktar: Number(e.target.value),
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
                              value={editingItem.birim}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  birim: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-mevcutDeger"
                              className="text-right text-neon-blue"
                            >
                              Mevcut Değer
                            </Label>
                            <Input
                              id="edit-mevcutDeger"
                              type="number"
                              value={editingItem.mevcutDeger}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  mevcutDeger: Number(e.target.value),
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-yakitTuketimi"
                              className="text-right text-neon-blue"
                            >
                              Yakıt Tüketimi
                            </Label>
                            <Input
                              id="edit-yakitTuketimi"
                              type="number"
                              value={editingItem.yakitTuketimi}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  yakitTuketimi: Number(e.target.value),
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
