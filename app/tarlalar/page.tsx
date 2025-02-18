"use client";

import type React from "react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Pencil, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface Tarla {
  _id: string;
  ad: string;
  dekar: number;
  durum: string;
  sulanan: boolean;
  kiralik: boolean;
  ada_parsel: string;
  sezon_id: { _id: string; ad: string };
  urun_id: { _id: string; ad: string };
  kuyu_id: { _id: string; ad: string };
}

interface Sezon {
  _id: string;
  ad: string;
}

interface Urun {
  _id: string;
  ad: string;
}

interface Kuyu {
  _id: string;
  ad: string;
}

export default function TarlalarPage() {
  const [tarlalar, setTarlalar] = useState<Tarla[]>([]);
  const [sezonlar, setSezonlar] = useState<Sezon[]>([]);
  const [urunler, setUrunler] = useState<Urun[]>([]);
  const [kuyular, setKuyular] = useState<Kuyu[]>([]);
  const [yeniTarla, setYeniTarla] = useState<Partial<Tarla>>({
    kiralik: false,
    sulanan: false,
    kuyu_id: { _id: "", ad: "" },
  });
  const [editingTarla, setEditingTarla] = useState<Tarla | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchTarlalar();
    fetchSezonlar();
    fetchUrunler();
    fetchKuyular();
  }, [session, status, router]);

  const fetchTarlalar = async () => {
    try {
      const response = await fetch("/api/tarlalar");
      if (!response.ok) {
        throw new Error("Tarlaları getirme hatası");
      }
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

  const fetchSezonlar = async () => {
    try {
      const response = await fetch("/api/sezonlar");
      if (!response.ok) throw new Error("Sezonları getirme hatası");
      const data = await response.json();
      setSezonlar(data);
    } catch (error) {
      console.error("Sezonları getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Sezonları getirirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const fetchUrunler = async () => {
    try {
      const response = await fetch("/api/urunler");
      if (!response.ok) throw new Error("Ürünleri getirme hatası");
      const data = await response.json();
      setUrunler(data);
    } catch (error) {
      console.error("Ürünleri getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Ürünleri getirirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const fetchKuyular = async () => {
    try {
      const response = await fetch("/api/kuyular");
      if (!response.ok) throw new Error("Kuyuları getirme hatası");
      const data = await response.json();
      setKuyular(data);
    } catch (error) {
      console.error("Kuyuları getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Kuyuları getirirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleAddTarla = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/tarlalar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(yeniTarla),
      });
      if (!response.ok) throw new Error("Tarla ekleme hatası");
      await fetchTarlalar();
      setYeniTarla({
        kiralik: false,
        sulanan: false,
        kuyu_id: { _id: "", ad: "" },
      });
      toast({
        title: "Başarılı",
        description: "Yeni tarla başarıyla eklendi.",
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Tarla ekleme hatası:", error);
      toast({
        title: "Hata",
        description: "Tarla eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleEditTarla = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTarla) return;
    try {
      const response = await fetch(`/api/tarlalar/${editingTarla._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTarla),
      });
      if (!response.ok) throw new Error("Tarla güncelleme hatası");
      await fetchTarlalar();
      setEditingTarla(null);
      setIsEditDialogOpen(false);
      toast({
        title: "Başarılı",
        description: "Tarla başarıyla güncellendi.",
      });
    } catch (error) {
      console.error("Tarla güncelleme hatası:", error);
      toast({
        title: "Hata",
        description: "Tarla güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTarla = async (id: string) => {
    if (!confirm("Bu tarlayı silmek istediğinizden emin misiniz?")) return;
    try {
      const response = await fetch(`/api/tarlalar/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Tarla silme hatası");
      await fetchTarlalar();
      toast({
        title: "Başarılı",
        description: "Tarla başarıyla silindi.",
      });
    } catch (error) {
      console.error("Tarla silme hatası:", error);
      toast({
        title: "Hata",
        description: "Tarla silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-green title-glow">
          Tarla Yönetimi
        </h1>

        <div className="flex justify-end mb-4">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-neon-purple hover:bg-neon-pink text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Yeni Tarla Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-2 border-neon-green">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-neon-green">
                  Yeni Tarla Ekle
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddTarla}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ad" className="text-right text-neon-blue">
                      Ad
                    </Label>
                    <Input
                      id="ad"
                      value={yeniTarla.ad || ""}
                      onChange={(e) =>
                        setYeniTarla({ ...yeniTarla, ad: e.target.value })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="dekar"
                      className="text-right text-neon-blue"
                    >
                      Dekar
                    </Label>
                    <Input
                      id="dekar"
                      type="number"
                      value={yeniTarla.dekar || ""}
                      onChange={(e) =>
                        setYeniTarla({
                          ...yeniTarla,
                          dekar: Number(e.target.value),
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="durum"
                      className="text-right text-neon-blue"
                    >
                      Durum
                    </Label>
                    <Input
                      id="durum"
                      value={yeniTarla.durum || ""}
                      onChange={(e) =>
                        setYeniTarla({ ...yeniTarla, durum: e.target.value })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="sulanan"
                      className="text-right text-neon-blue"
                    >
                      Sulanan
                    </Label>
                    <Checkbox
                      id="sulanan"
                      checked={yeniTarla.sulanan || false}
                      onCheckedChange={(checked: boolean) =>
                        setYeniTarla({ ...yeniTarla, sulanan: checked })
                      }
                      className="col-span-3 "
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="kiralik"
                      className="text-right text-neon-blue"
                    >
                      Kiralık
                    </Label>
                    <Checkbox
                      id="kiralik"
                      checked={yeniTarla.kiralik || false}
                      onCheckedChange={(checked: boolean) =>
                        setYeniTarla({ ...yeniTarla, kiralik: checked })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="ada_parsel"
                      className="text-right text-neon-blue"
                    >
                      Ada-Parsel
                    </Label>
                    <Input
                      id="ada_parsel"
                      value={yeniTarla.ada_parsel || ""}
                      onChange={(e) =>
                        setYeniTarla({
                          ...yeniTarla,
                          ada_parsel: e.target.value,
                        })
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
                        setYeniTarla({
                          ...yeniTarla,
                          sezon_id: { _id: value, ad: "" },
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3 bg-gray-800 text-neon-green border-neon-green">
                        <SelectValue placeholder="Sezon seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {sezonlar.map((sezon) => (
                          <SelectItem
                            key={sezon._id}
                            value={sezon._id}
                            className="text-neon-yellow hover:bg-neon-blue/20 focus:bg-neon-blue/20 focus:text-neon-pink" // text-neon-yellow sınıfı eklendi
                          >
                            {sezon.ad}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="urun" className="text-right text-neon-blue">
                      Ürün
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setYeniTarla({
                          ...yeniTarla,
                          urun_id: { _id: value, ad: "" },
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3 bg-gray-800 text-neon-green border-neon-green">
                        <SelectValue placeholder="Ürün seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {urunler.map((urun) => (
                          <SelectItem
                            key={urun._id}
                            value={urun._id}
                            className="text-neon-cyan hover:bg-neon-blue/20 focus:bg-neon-blue/20 focus:text-neon-pink" // text-neon-yellow sınıfı eklendi
                          >
                            {urun.ad}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="kuyu" className="text-right text-neon-blue">
                      Kuyu
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setYeniTarla({
                          ...yeniTarla,
                          kuyu_id: {
                            _id: value,
                            ad: kuyular.find((k) => k._id === value)?.ad || "",
                          },
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3 bg-gray-800 text-neon-green border-neon-green">
                        <SelectValue placeholder="Kuyu seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {kuyular.map((kuyu) => (
                          <SelectItem key={kuyu._id} value={kuyu._id}>
                            {kuyu.ad}
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
          {tarlalar.map((tarla) => (
            <Card
              key={tarla._id}
              className="bg-gray-800 border-2 border-neon-green shadow-lg hover:shadow-neon-green transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-neon-pink flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-neon-green" />
                  {tarla.ad}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-neon-blue">
                  Dekar: <span className="text-neon-pink">{tarla.dekar}</span>
                </p>
                <p className="text-neon-blue">
                  Durum: <span className="text-neon-pink">{tarla.durum}</span>
                </p>
                <p className="text-neon-blue">
                  Sulanan:{" "}
                  <span className="text-neon-pink">
                    {tarla.sulanan ? "Evet" : "Hayır"}
                  </span>
                </p>
                <p className="text-neon-blue">
                  Kiralık:{" "}
                  <span className="text-neon-pink">
                    {tarla.kiralik ? "Evet" : "Hayır"}
                  </span>
                </p>
                <p className="text-neon-blue">
                  Ada-Parsel:{" "}
                  <span className="text-neon-pink">{tarla.ada_parsel}</span>
                </p>
                <p className="text-neon-blue">
                  Sezon:{" "}
                  <span className="text-neon-pink">{tarla.sezon_id.ad}</span>
                </p>
                <p className="text-neon-blue">
                  Ürün:{" "}
                  <span className="text-neon-pink">{tarla.urun_id.ad}</span>
                </p>
                <p className="text-neon-blue">
                  Kuyu:{" "}
                  <span className="text-neon-pink">
                    {tarla.kuyu_id ? tarla.kuyu_id.ad : "Bağlı değil"}
                  </span>
                </p>
              </CardContent>
              <CardFooter>
                <Dialog
                  open={isEditDialogOpen}
                  onOpenChange={setIsEditDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-neon-cyan hover:bg-neon-blue text-black"
                      onClick={() => setEditingTarla(tarla)}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Düzenle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-2 border-neon-green">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-neon-green">
                        Tarla Düzenle
                      </DialogTitle>
                    </DialogHeader>
                    {editingTarla && (
                      <form onSubmit={handleEditTarla}>
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
                              value={editingTarla.ad}
                              onChange={(e) =>
                                setEditingTarla({
                                  ...editingTarla,
                                  ad: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-dekar"
                              className="text-right text-neon-blue"
                            >
                              Dekar
                            </Label>
                            <Input
                              id="edit-dekar"
                              type="number"
                              value={editingTarla.dekar}
                              onChange={(e) =>
                                setEditingTarla({
                                  ...editingTarla,
                                  dekar: Number(e.target.value),
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-durum"
                              className="text-right text-neon-blue"
                            >
                              Durum
                            </Label>
                            <Input
                              id="edit-durum"
                              value={editingTarla.durum}
                              onChange={(e) =>
                                setEditingTarla({
                                  ...editingTarla,
                                  durum: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-sulanan"
                              className="text-right text-neon-blue"
                            >
                              Sulanan
                            </Label>
                            <Checkbox
                              id="edit-sulanan"
                              checked={editingTarla.sulanan}
                              onCheckedChange={(checked: boolean) =>
                                setEditingTarla({
                                  ...editingTarla,
                                  sulanan: checked,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-kiralik"
                              className="text-right text-neon-blue"
                            >
                              Kiralık
                            </Label>
                            <Checkbox
                              id="edit-kiralik"
                              checked={editingTarla.kiralik}
                              onCheckedChange={(checked: boolean) =>
                                setEditingTarla({
                                  ...editingTarla,
                                  kiralik: checked,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-ada_parsel"
                              className="text-right text-neon-blue"
                            >
                              Ada-Parsel
                            </Label>
                            <Input
                              id="edit-ada_parsel"
                              value={editingTarla.ada_parsel}
                              onChange={(e) =>
                                setEditingTarla({
                                  ...editingTarla,
                                  ada_parsel: e.target.value,
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
                              value={editingTarla.sezon_id._id}
                              onValueChange={(value) =>
                                setEditingTarla({
                                  ...editingTarla,
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
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-urun"
                              className="text-right text-neon-blue"
                            >
                              Ürün
                            </Label>
                            <Select
                              value={editingTarla.urun_id._id}
                              onValueChange={(value) =>
                                setEditingTarla({
                                  ...editingTarla,
                                  urun_id: { _id: value, ad: "" },
                                })
                              }
                            >
                              <SelectTrigger className="col-span-3 bg-gray-800 text-neon-green border-neon-green">
                                <SelectValue placeholder="Ürün seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                {urunler.map((urun) => (
                                  <SelectItem key={urun._id} value={urun._id}>
                                    {urun.ad}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-kuyu"
                              className="text-right text-neon-blue"
                            >
                              Kuyu
                            </Label>
                            <Select
                              value={editingTarla.kuyu_id?._id}
                              onValueChange={(value) =>
                                setEditingTarla({
                                  ...editingTarla,
                                  kuyu_id: {
                                    _id: value,
                                    ad:
                                      kuyular.find((k) => k._id === value)
                                        ?.ad || "",
                                  },
                                })
                              }
                            >
                              <SelectTrigger className="col-span-3 bg-gray-800 text-neon-green border-neon-green">
                                <SelectValue placeholder="Kuyu seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                {kuyular.map((kuyu) => (
                                  <SelectItem key={kuyu._id} value={kuyu._id}>
                                    {kuyu.ad}
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
                            Güncelle
                          </Button>
                        </DialogFooter>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
                <Button
                  className="w-full mt-2 bg-neon-red hover:bg-neon-pink text-white"
                  onClick={() => handleDeleteTarla(tarla._id)}
                >
                  Sil
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <Toaster />
    </Layout>
  );
}
