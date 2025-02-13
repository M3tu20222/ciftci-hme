"use client";

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
import { Calendar } from "@/components/ui/calendar";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface Kuyu {
  _id: string;
  ad: string;
}

interface KuyuFatura {
  _id: string;
  kuyu_id: Kuyu;
  tarih: string;
  tuketim: number;
  birim_fiyat: number;
  toplam_tutar: number;
}

export default function KuyuFaturalarPage() {
  const [kuyular, setKuyular] = useState<Kuyu[]>([]);
  const [kuyuFaturalar, setKuyuFaturalar] = useState<KuyuFatura[]>([]);
  const [selectedKuyu, setSelectedKuyu] = useState<Kuyu | null>(null);
  const [editingFatura, setEditingFatura] = useState<KuyuFatura | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFatura, setNewFatura] = useState<Partial<KuyuFatura>>({
    kuyu_id: { _id: "", ad: "" },
    tarih: "",
    tuketim: 0,
    birim_fiyat: 0,
    toplam_tutar: 0,
  });
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const fetchKuyular = useCallback(async () => {
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
  }, [toast]);

  const fetchKuyuFaturalar = useCallback(async () => {
    try {
      const response = await fetch("/api/kuyu-faturalar");
      if (!response.ok) throw new Error("Kuyu faturalarını getirme hatası");
      const data = await response.json();
      setKuyuFaturalar(data);
    } catch (error) {
      console.error("Kuyu faturalarını getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Kuyu faturalarını getirirken bir hata oluştu.",
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
    fetchKuyular();
    fetchKuyuFaturalar();
  }, [session, status, router, fetchKuyular, fetchKuyuFaturalar]);

  const handleAddFatura = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/kuyu-faturalar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFatura),
      });
      if (!response.ok) throw new Error("Kuyu faturası ekleme hatası");
      await fetchKuyuFaturalar();
      setNewFatura({
        kuyu_id: { _id: "", ad: "" },
        tarih: "",
        tuketim: 0,
        birim_fiyat: 0,
        toplam_tutar: 0,
      });
      setIsAddDialogOpen(false);
      toast({
        title: "Başarılı",
        description: "Yeni kuyu faturası başarıyla eklendi.",
      });
    } catch (error) {
      console.error("Kuyu faturası ekleme hatası:", error);
      toast({
        title: "Hata",
        description: "Kuyu faturası eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleEditFatura = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFatura) return;
    try {
      const response = await fetch(`/api/kuyu-faturalar/${editingFatura._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingFatura),
      });
      if (!response.ok) throw new Error("Kuyu faturası güncelleme hatası");
      await fetchKuyuFaturalar();
      setEditingFatura(null);
      toast({
        title: "Başarılı",
        description: "Kuyu faturası başarıyla güncellendi.",
      });
    } catch (error) {
      console.error("Kuyu faturası güncelleme hatası:", error);
      toast({
        title: "Hata",
        description: "Kuyu faturası güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFatura = async (id: string) => {
    if (!confirm("Bu kuyu faturasını silmek istediğinizden emin misiniz?"))
      return;
    try {
      const response = await fetch(`/api/kuyu-faturalar/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Kuyu faturası silme hatası");
      await fetchKuyuFaturalar();
      toast({
        title: "Başarılı",
        description: "Kuyu faturası başarıyla silindi.",
      });
    } catch (error) {
      console.error("Kuyu faturası silme hatası:", error);
      toast({
        title: "Hata",
        description: "Kuyu faturası silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleKuyuChange = (kuyuId: string) => {
    const kuyu = kuyular.find((k) => k._id === kuyuId);
    setSelectedKuyu(kuyu || null);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-blue title-glow">
          Kuyu Faturaları Yönetimi
        </h1>

        <div className="flex justify-between items-center mb-4">
          <Select
            onValueChange={handleKuyuChange}
            value={selectedKuyu?._id || ""}
          >
            <SelectTrigger className="w-[200px] bg-gray-800 text-neon-green border-neon-blue">
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

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-neon-purple hover:bg-neon-pink text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Yeni Fatura Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-2 border-neon-green">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-neon-green">
                  Yeni Kuyu Faturası Ekle
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddFatura}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="kuyu" className="text-right text-neon-blue">
                      Kuyu
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setNewFatura({
                          ...newFatura,
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="tarih"
                      className="text-right text-neon-blue"
                    >
                      Tarih
                    </Label>
                    <div className="col-span-3">
                      <Calendar
                        selected={
                          newFatura.tarih
                            ? new Date(newFatura.tarih)
                            : undefined
                        }
                        onSelect={(date) =>
                          setNewFatura({
                            ...newFatura,
                            tarih: date ? date.toISOString() : "",
                          })
                        }
                        className="rounded-md border border-neon-blue bg-gray-800 text-neon-pink"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="tuketim"
                      className="text-right text-neon-blue"
                    >
                      Tüketim (kWh)
                    </Label>
                    <Input
                      id="tuketim"
                      type="number"
                      value={newFatura.tuketim}
                      onChange={(e) =>
                        setNewFatura({
                          ...newFatura,
                          tuketim: Number(e.target.value),
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="birim_fiyat"
                      className="text-right text-neon-blue"
                    >
                      Birim Fiyat (TL)
                    </Label>
                    <Input
                      id="birim_fiyat"
                      type="number"
                      step="0.01"
                      value={newFatura.birim_fiyat}
                      onChange={(e) =>
                        setNewFatura({
                          ...newFatura,
                          birim_fiyat: Number(e.target.value),
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="toplam_tutar"
                      className="text-right text-neon-blue"
                    >
                      Toplam Tutar (TL)
                    </Label>
                    <Input
                      id="toplam_tutar"
                      type="number"
                      step="0.01"
                      value={newFatura.toplam_tutar}
                      onChange={(e) =>
                        setNewFatura({
                          ...newFatura,
                          toplam_tutar: Number(e.target.value),
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
          {kuyuFaturalar
            .filter(
              (fatura) =>
                !selectedKuyu || fatura.kuyu_id._id === selectedKuyu._id
            )
            .map((fatura) => (
              <Card
                key={fatura._id}
                className="bg-gray-800 border-2 border-neon-blue shadow-lg hover:shadow-neon-blue transition-shadow duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-neon-pink">
                    {fatura.kuyu_id.ad}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-neon-blue">
                    Tarih:{" "}
                    <span className="text-neon-pink">
                      {format(new Date(fatura.tarih), "d MMMM yyyy", {
                        locale: tr,
                      })}
                    </span>
                  </p>
                  <p className="text-neon-blue">
                    Tüketim:{" "}
                    <span className="text-neon-pink">{fatura.tuketim} kWh</span>
                  </p>
                  <p className="text-neon-blue">
                    Birim Fiyat:{" "}
                    <span className="text-neon-pink">
                      {fatura.birim_fiyat.toFixed(2)} TL
                    </span>
                  </p>
                  <p className="text-neon-blue">
                    Toplam Tutar:{" "}
                    <span className="text-neon-pink">
                      {fatura.toplam_tutar.toFixed(2)} TL
                    </span>
                  </p>
                </CardContent>
                <CardFooter className="space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-neon-cyan hover:bg-neon-blue text-black"
                        onClick={() => setEditingFatura(fatura)}
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Düzenle
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-2 border-neon-green">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-neon-green">
                          Kuyu Faturası Düzenle
                        </DialogTitle>
                      </DialogHeader>
                      {editingFatura && (
                        <form onSubmit={handleEditFatura}>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="edit-kuyu"
                                className="text-right text-neon-blue"
                              >
                                Kuyu
                              </Label>
                              <Select
                                value={editingFatura.kuyu_id._id}
                                onValueChange={(value) =>
                                  setEditingFatura({
                                    ...editingFatura,
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
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="edit-tarih"
                                className="text-right text-neon-blue"
                              >
                                Tarih
                              </Label>
                              <div className="col-span-3">
                                <Calendar
                                  selected={new Date(editingFatura.tarih)}
                                  onSelect={(date) =>
                                    setEditingFatura({
                                      ...editingFatura,
                                      tarih: date ? date.toISOString() : "",
                                    })
                                  }
                                  className="rounded-md border border-neon-blue bg-gray-800 text-neon-pink"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="edit-tuketim"
                                className="text-right text-neon-blue"
                              >
                                Tüketim (kWh)
                              </Label>
                              <Input
                                id="edit-tuketim"
                                type="number"
                                value={editingFatura.tuketim}
                                onChange={(e) =>
                                  setEditingFatura({
                                    ...editingFatura,
                                    tuketim: Number(e.target.value),
                                  })
                                }
                                className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="edit-birim_fiyat"
                                className="text-right text-neon-blue"
                              >
                                Birim Fiyat (TL)
                              </Label>
                              <Input
                                id="edit-birim_fiyat"
                                type="number"
                                step="0.01"
                                value={editingFatura.birim_fiyat}
                                onChange={(e) =>
                                  setEditingFatura({
                                    ...editingFatura,
                                    birim_fiyat: Number(e.target.value),
                                  })
                                }
                                className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="edit-toplam_tutar"
                                className="text-right text-neon-blue"
                              >
                                Toplam Tutar (TL)
                              </Label>
                              <Input
                                id="edit-toplam_tutar"
                                type="number"
                                step="0.01"
                                value={editingFatura.toplam_tutar}
                                onChange={(e) =>
                                  setEditingFatura({
                                    ...editingFatura,
                                    toplam_tutar: Number(e.target.value),
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
                    onClick={() => handleDeleteFatura(fatura._id)}
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
