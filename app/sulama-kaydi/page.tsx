"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import  { Toaster } from "@/components/ui/toaster";

interface SulamaKaydi {
  _id: string;
  tarla_id: { _id: string; ad: string };
  kuyu_id: { _id: string; ad: string };
  sezon_id: { _id: string; ad: string };
  baslangic_zamani: string;
  bitis_zamani: string;
  sulama_suresi: number;
  notlar: string;
  created_by: { _id: string; name: string };
}

interface Tarla {
  _id: string;
  ad: string;
  kuyu_id: { _id: string; ad: string };
}

export default function SulamaKaydiPage() {
  const [sulamaKayitlari, setSulamaKayitlari] = useState<SulamaKaydi[]>([]);
  const [tarlalar, setTarlalar] = useState<Tarla[]>([]);
  const [yeniKayit, setYeniKayit] = useState<Partial<SulamaKaydi>>({});
  const [editingKayit, setEditingKayit] = useState<SulamaKaydi | null>(null);
  const [selectedTarla, setSelectedTarla] = useState<Tarla | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const fetchSulamaKayitlari = useCallback(async () => {
    try {
      const response = await fetch("/api/sulama-kaydi");
      if (!response.ok) throw new Error("Sulama kayıtlarını getirme hatası");
      const data = await response.json();
      setSulamaKayitlari(data);
    } catch (error) {
      console.error("Sulama kayıtlarını getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Sulama kayıtlarını getirirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchTarlalar = useCallback(async () => {
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
  }, [toast]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchSulamaKayitlari();
    fetchTarlalar();
  }, [session, status, router, fetchSulamaKayitlari, fetchTarlalar]);

  useEffect(() => {
    if (selectedTarla) {
      setYeniKayit((prevState) => ({
        ...prevState,
        tarla_id: { _id: selectedTarla._id, ad: selectedTarla.ad },
        kuyu_id: selectedTarla.kuyu_id, // Assuming at least one kuyu exists
      }));
    }
  }, [selectedTarla]);

  const handleAddKayit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/sulama-kaydi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(yeniKayit),
      });
      if (!response.ok) throw new Error("Sulama kaydı ekleme hatası");
      await fetchSulamaKayitlari();
      setYeniKayit({});
      toast({
        title: "Başarılı",
        description: "Yeni sulama kaydı başarıyla eklendi.",
      });
    } catch (error) {
      console.error("Sulama kaydı ekleme hatası:", error);
      toast({
        title: "Hata",
        description: "Sulama kaydı eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleEditKayit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKayit) return;
    try {
      const response = await fetch(`/api/sulama-kaydi/${editingKayit._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tarla_id: editingKayit.tarla_id._id,
          kuyu_id: editingKayit.kuyu_id._id,
          baslangic_zamani: editingKayit.baslangic_zamani,
          sulama_suresi: editingKayit.sulama_suresi,
          notlar: editingKayit.notlar,
        }),
      });
      if (!response.ok) throw new Error("Sulama kaydı güncelleme hatası");
      const updatedKayit = await response.json();
      setSulamaKayitlari(
        sulamaKayitlari.map((kayit) =>
          kayit._id === updatedKayit._id ? updatedKayit : kayit
        )
      );
      setEditingKayit(null);
      toast({
        title: "Başarılı",
        description: "Sulama kaydı başarıyla güncellendi.",
      });
    } catch (error) {
      console.error("Sulama kaydı güncelleme hatası:", error);
      toast({
        title: "Hata",
        description: "Sulama kaydı güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteKayit = async (id: string) => {
    if (!confirm("Bu sulama kaydını silmek istediğinizden emin misiniz?"))
      return;
    try {
      const response = await fetch(`/api/sulama-kaydi/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Sulama kaydı silme hatası");
      await fetchSulamaKayitlari();
      toast({
        title: "Başarılı",
        description: "Sulama kaydı başarıyla silindi.",
      });
    } catch (error) {
      console.error("Sulama kaydı silme hatası:", error);
      toast({
        title: "Hata",
        description: "Sulama kaydı silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} saat ${remainingMinutes} dakika`;
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-green title-glow">
          Sulama Kayıtları
        </h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-neon-purple hover:bg-neon-pink text-white">
              <PlusCircle className="mr-2 h-4 w-4" /> Yeni Sulama Kaydı Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-2 border-neon-purple">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-neon-purple">
                Yeni Sulama Kaydı Ekle
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddKayit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tarla" className="text-right text-neon-blue">
                    Tarla
                  </Label>
                  <Select
                    value={yeniKayit.tarla_id?._id || ""}
                    onValueChange={(value) => {
                      const selected = tarlalar.find((t) => t._id === value);
                      setSelectedTarla(selected || null);
                    }}
                  >
                    <SelectTrigger className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue">
                      <SelectValue placeholder="Tarla seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {tarlalar.map((tarla) => (
                        <SelectItem key={tarla._id} value={tarla._id}>
                          {tarla.ad}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="kuyu" className="text-right text-neon-blue">
                    Kuyu
                  </Label>
                  <Input
                    id="kuyu"
                    value={yeniKayit.kuyu_id?.ad || ""}
                    disabled
                    className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="baslangic_zamani"
                    className="text-right text-neon-blue"
                  >
                    Başlangıç Zamanı
                  </Label>
                  <Input
                    id="baslangic_zamani"
                    type="datetime-local"
                    value={yeniKayit.baslangic_zamani || ""}
                    onChange={(e) =>
                      setYeniKayit({
                        ...yeniKayit,
                        baslangic_zamani: e.target.value,
                      })
                    }
                    className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="sulama_suresi"
                    className="text-right text-neon-blue"
                  >
                    Sulama Süresi
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Input
                      id="sulama_suresi_saat"
                      type="number"
                      placeholder="Saat"
                      min="0"
                      value={Math.floor((yeniKayit.sulama_suresi || 0) / 60)}
                      onChange={(e) =>
                        setYeniKayit({
                          ...yeniKayit,
                          sulama_suresi:
                            Number(e.target.value) * 60 +
                            ((yeniKayit.sulama_suresi || 0) % 60),
                        })
                      }
                      className="bg-gray-800 text-neon-pink border-neon-blue"
                    />
                    <Input
                      id="sulama_suresi_dakika"
                      type="number"
                      placeholder="Dakika"
                      min="0"
                      max="59"
                      value={(yeniKayit.sulama_suresi || 0) % 60}
                      onChange={(e) =>
                        setYeniKayit({
                          ...yeniKayit,
                          sulama_suresi:
                            Math.floor((yeniKayit.sulama_suresi || 0) / 60) *
                              60 +
                            Number(e.target.value),
                        })
                      }
                      className="bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notlar" className="text-right text-neon-blue">
                    Notlar
                  </Label>
                  <Textarea
                    id="notlar"
                    value={yeniKayit.notlar || ""}
                    onChange={(e) =>
                      setYeniKayit({ ...yeniKayit, notlar: e.target.value })
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sulamaKayitlari.map((kayit) => (
            <Card
              key={kayit._id}
              className="bg-gray-800 border-2 border-neon-purple"
            >
              <CardHeader>
                <CardTitle className="text-neon-pink">
                  {kayit.tarla_id.ad}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neon-blue">Kuyu: {kayit.kuyu_id.ad}</p>
                <p className="text-neon-blue">Sezon: {kayit.sezon_id.ad}</p>
                <p className="text-neon-blue">
                  Başlangıç: {new Date(kayit.baslangic_zamani).toLocaleString()}
                </p>
                <p className="text-neon-blue">
                  Süre: {formatDuration(kayit.sulama_suresi)}
                </p>
                <p className="text-neon-blue">
                  Bitiş: {new Date(kayit.bitis_zamani).toLocaleString()}
                </p>
                {kayit.notlar && (
                  <p className="text-neon-blue">Notlar: {kayit.notlar}</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-neon-cyan hover:bg-neon-blue text-black"
                      onClick={() => {
                        setEditingKayit({
                          ...kayit,
                          tarla_id: {
                            _id: kayit.tarla_id._id,
                            ad: kayit.tarla_id.ad,
                          },
                          kuyu_id: {
                            _id: kayit.kuyu_id._id,
                            ad: kayit.kuyu_id.ad,
                          },
                        });
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Düzenle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-2 border-neon-purple">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-neon-purple">
                        Sulama Kaydı Düzenle
                      </DialogTitle>
                    </DialogHeader>
                    {editingKayit && (
                      <form onSubmit={handleEditKayit}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-tarla"
                              className="text-right text-neon-blue"
                            >
                              Tarla
                            </Label>
                            <Select
                              value={editingKayit.tarla_id._id}
                              onValueChange={(value) => {
                                const selected = tarlalar.find(
                                  (t) => t._id === value
                                );
                                if (selected) {
                                  setEditingKayit({
                                    ...editingKayit,
                                    tarla_id: {
                                      _id: selected._id,
                                      ad: selected.ad,
                                    },
                                    kuyu_id: selected.kuyu_id,
                                  });
                                }
                              }}
                            >
                              <SelectTrigger className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue">
                                <SelectValue placeholder="Tarla seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                {tarlalar.map((tarla) => (
                                  <SelectItem key={tarla._id} value={tarla._id}>
                                    {tarla.ad}
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
                            <Input
                              id="edit-kuyu"
                              value={editingKayit.kuyu_id.ad}
                              disabled
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-baslangic"
                              className="text-right text-neon-blue"
                            >
                              Başlangıç Zamanı
                            </Label>
                            <Input
                              id="edit-baslangic"
                              type="datetime-local"
                              value={new Date(editingKayit.baslangic_zamani)
                                .toISOString()
                                .slice(0, 16)}
                              onChange={(e) =>
                                setEditingKayit({
                                  ...editingKayit,
                                  baslangic_zamani: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-sure"
                              className="text-right text-neon-blue"
                            >
                              Sulama Süresi (Dakika)
                            </Label>
                            <Input
                              id="edit-sure"
                              type="number"
                              value={editingKayit.sulama_suresi}
                              onChange={(e) =>
                                setEditingKayit({
                                  ...editingKayit,
                                  sulama_suresi: Number(e.target.value),
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-notlar"
                              className="text-right text-neon-blue"
                            >
                              Notlar
                            </Label>
                            <Textarea
                              id="edit-notlar"
                              value={editingKayit.notlar}
                              onChange={(e) =>
                                setEditingKayit({
                                  ...editingKayit,
                                  notlar: e.target.value,
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
                            Güncelle
                          </Button>
                        </DialogFooter>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
                <Button
                  className="bg-neon-red hover:bg-neon-pink text-white"
                  onClick={() => handleDeleteKayit(kayit._id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Sil
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
