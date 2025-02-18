"use client";

import type React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, addDays } from "date-fns";
import tr from "date-fns/locale/tr";
import { toast } from "@/components/ui/use-toast";
import {Toaster} from "@/components/ui/toaster";
import {
  GlassWaterIcon as WaterIcon,
  PlusCircle,
  Pencil,
  Trash2,
} from "lucide-react";

interface Kuyu {
  _id: string;
  ad: string;
}

interface KuyuFatura {
  _id: string;
  kuyu_id: Kuyu;
  baslangic_tarihi: Date;
  bitis_tarihi: Date;
  tutar: number;
  odendi: boolean;
  son_odeme_tarihi: Date;
  odeme_durumu: string;
}

const KuyuFaturalarPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [kuyuFaturalar, setKuyuFaturalar] = useState<KuyuFatura[]>([]);
  const [kuyular, setKuyular] = useState<Kuyu[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newFatura, setNewFatura] = useState<Partial<KuyuFatura>>({
    kuyu_id: undefined,
    baslangic_tarihi: new Date(),
    bitis_tarihi: addDays(new Date(), 30),
    tutar: 0,
    odendi: false,
    son_odeme_tarihi: addDays(new Date(), 30),
    odeme_durumu: "Ödenmedi",
  });
  const [editingFatura, setEditingFatura] = useState<KuyuFatura>({
    _id: "",
    kuyu_id: { _id: "", ad: "" },
    baslangic_tarihi: new Date(),
    bitis_tarihi: new Date(),
    tutar: 0,
    odendi: false,
    son_odeme_tarihi: new Date(),
    odeme_durumu: "Ödenmedi",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchKuyular = async () => {
      try {
        const response = await fetch("/api/kuyular");
        if (!response.ok) throw new Error("Kuyular çekilemedi");
        const data = await response.json();
        setKuyular(data);
      } catch (error) {
        console.error("Kuyular çekilemedi:", error);
        toast({
          title: "Hata",
          description: "Kuyular yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    };
    if (session) {
      fetchKuyular();
    }
  }, [session]);

  const fetchKuyuFaturalar = useCallback(async () => {
    try {
      const response = await fetch("/api/kuyu-faturalar");
      if (!response.ok) throw new Error("Kuyu faturaları çekilemedi");
      const data = await response.json();
      setKuyuFaturalar(data);
    } catch (error) {
      console.error("Kuyu faturaları çekilemedi:", error);
      toast({
        title: "Hata",
        description: "Kuyu faturaları yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchKuyuFaturalar();
    }
  }, [session, fetchKuyuFaturalar]);

  const handleAddFatura = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFatura.kuyu_id) {
      toast({
        title: "Hata",
        description: "Lütfen bir kuyu seçin.",
        variant: "destructive",
      });
      return;
    }
    try {
      const response = await fetch("/api/kuyu-faturalar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newFatura,
          baslangic_tarihi: newFatura.baslangic_tarihi?.toISOString(),
          bitis_tarihi: newFatura.bitis_tarihi?.toISOString(),
          son_odeme_tarihi: newFatura.son_odeme_tarihi?.toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Kuyu faturası ekleme hatası");
      await fetchKuyuFaturalar();
      setNewFatura({
        kuyu_id: undefined,
        baslangic_tarihi: new Date(),
        bitis_tarihi: addDays(new Date(), 30),
        tutar: 0,
        odendi: false,
        son_odeme_tarihi: addDays(new Date(), 30),
        odeme_durumu: "Ödenmedi",
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

  const handleEditFatura = useCallback((fatura: KuyuFatura) => {
    setEditingFatura({
      ...fatura,
      baslangic_tarihi: new Date(fatura.baslangic_tarihi),
      bitis_tarihi: new Date(fatura.bitis_tarihi),
      son_odeme_tarihi: new Date(fatura.son_odeme_tarihi),
    });
    setIsEditDialogOpen(true);
  }, []);

  const handleUpdateFatura = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/kuyu-faturalar/${editingFatura._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingFatura,
          baslangic_tarihi: editingFatura.baslangic_tarihi.toISOString(),
          bitis_tarihi: editingFatura.bitis_tarihi.toISOString(),
          son_odeme_tarihi: editingFatura.son_odeme_tarihi.toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Kuyu faturası güncellenemedi");
      await fetchKuyuFaturalar();
      setIsEditDialogOpen(false);
      toast({
        title: "Başarılı",
        description: "Kuyu faturası başarıyla güncellendi.",
      });
    } catch (error) {
      console.error("Kuyu faturası güncellenemedi:", error);
      toast({
        title: "Hata",
        description: "Kuyu faturası güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFatura = useCallback(
    async (id: string) => {
      if (!confirm("Bu faturayı silmek istediğinizden emin misiniz?")) return;
      try {
        const response = await fetch(`/api/kuyu-faturalar/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Kuyu faturası silinemedi");
        await fetchKuyuFaturalar();
        toast({
          title: "Başarılı",
          description: "Kuyu faturası başarıyla silindi.",
        });
      } catch (error) {
        console.error("Kuyu faturası silinemedi:", error);
        toast({
          title: "Hata",
          description: "Kuyu faturası silinirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    },
    [fetchKuyuFaturalar]
  );

  const memoizedKuyuFaturalar = useMemo(() => kuyuFaturalar, [kuyuFaturalar]);

  if (status === "loading") {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-neon-blue animate-pulse-neon">Yükleniyor...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-neon-blue flex items-center gap-2 glow-text-blue">
            <WaterIcon className="w-8 h-8" />
            Kuyu Faturaları
          </h1>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="neon-button"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Yeni Fatura Ekle
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memoizedKuyuFaturalar.map((fatura) => (
            <Card key={fatura._id} className="card">
              <CardHeader>
                <CardTitle className="card-title flex items-center gap-2">
                  <WaterIcon className="w-5 h-5 text-neon-cyan" />
                  {fatura.kuyu_id.ad}
                </CardTitle>
                <CardDescription
                  className={`text-lg font-semibold ${
                    fatura.odendi ? "text-neon-green" : "text-neon-pink"
                  }`}
                >
                  {fatura.odendi ? "Ödendi" : "Ödenmedi"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="card-content">
                  <p className="flex justify-between">
                    <span className="text-neon-blue">Tutar:</span>
                    <span className="text-neon-pink font-bold">
                      {fatura.tutar} TL
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-neon-blue">Başlangıç:</span>
                    <span className="text-neon-cyan">
                      {format(
                        new Date(fatura.baslangic_tarihi),
                        "d MMMM yyyy",
                        { locale: tr }
                      )}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-neon-blue">Bitiş:</span>
                    <span className="text-neon-cyan">
                      {format(new Date(fatura.bitis_tarihi), "d MMMM yyyy", {
                        locale: tr,
                      })}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-neon-blue">Son Ödeme Tarihi:</span>
                    <span className="text-neon-cyan">
                      {format(
                        new Date(fatura.son_odeme_tarihi),
                        "d MMMM yyyy",
                        {
                          locale: tr,
                        }
                      )}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-4 w-full">
                  <Button
                    variant="outline"
                    onClick={() => handleEditFatura(fatura)}
                    className="w-full border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black shadow-neon transition-all duration-300"
                  >
                    <Pencil className="mr-2 h-4 w-4" /> Düzenle
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteFatura(fatura._id)}
                    className="w-full border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-white shadow-neon transition-all duration-300"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Sil
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="bg-secondary border-2 border-neon-purple shadow-neon-purple">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-neon-purple glow-text-purple">
                Yeni Kuyu Faturası Ekle
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddFatura} className="space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="kuyu" className="text-right text-neon-blue">
                    Kuyu
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={newFatura.kuyu_id?._id || ""}
                      onValueChange={(value) =>
                        setNewFatura({
                          ...newFatura,
                          kuyu_id: kuyular.find((k) => k._id === value) || {
                            _id: value,
                            ad: "",
                          },
                        })
                      }
                    >
                      <SelectTrigger className="bg-secondary border-neon-blue text-neon-cyan">
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

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tarih" className="text-right text-neon-blue">
                    Tarih Aralığı
                  </Label>
                  <div className="col-span-3 space-y-2">
                    <Input
                      type="date"
                      value={
                        newFatura.baslangic_tarihi?.toISOString().split("T")[0]
                      }
                      onChange={(e) =>
                        setNewFatura({
                          ...newFatura,
                          baslangic_tarihi: new Date(e.target.value),
                        })
                      }
                      className="bg-secondary border-neon-blue text-neon-cyan"
                    />
                    <Input
                      type="date"
                      value={
                        newFatura.bitis_tarihi?.toISOString().split("T")[0]
                      }
                      onChange={(e) =>
                        setNewFatura({
                          ...newFatura,
                          bitis_tarihi: new Date(e.target.value),
                        })
                      }
                      className="bg-secondary border-neon-blue text-neon-cyan"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tutar" className="text-right text-neon-blue">
                    Tutar
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="tutar"
                      type="number"
                      value={newFatura.tutar}
                      onChange={(e) =>
                        setNewFatura({
                          ...newFatura,
                          tutar: Number(e.target.value),
                        })
                      }
                      className="bg-secondary border-neon-blue text-neon-cyan"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="odendi" className="text-right text-neon-blue">
                    Ödendi
                  </Label>
                  <div className="col-span-3">
                    <input
                      type="checkbox"
                      id="odendi"
                      checked={newFatura.odendi}
                      onChange={(e) =>
                        setNewFatura({ ...newFatura, odendi: e.target.checked })
                      }
                      className="w-5 h-5 rounded border-neon-blue text-neon-purple focus:ring-neon-purple"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="son_odeme_tarihi"
                    className="text-right text-neon-blue"
                  >
                    Son Ödeme Tarihi
                  </Label>
                  <Input
                    id="son_odeme_tarihi"
                    type="date"
                    value={
                      newFatura.son_odeme_tarihi?.toISOString().split("T")[0] ||
                      ""
                    }
                    onChange={(e) =>
                      setNewFatura({
                        ...newFatura,
                        son_odeme_tarihi: new Date(e.target.value),
                      })
                    }
                    className="bg-gray-800 text-neon-pink border-neon-blue"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="neon-button">
                  Ekle
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-secondary border-2 border-neon-purple shadow-neon-purple">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-neon-purple glow-text-purple">
                Kuyu Faturası Düzenle
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateFatura} className="space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="edit-kuyu"
                    className="text-right text-neon-blue"
                  >
                    Kuyu
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={editingFatura.kuyu_id._id}
                      onValueChange={(value) =>
                        setEditingFatura({
                          ...editingFatura,
                          kuyu_id: {
                            _id: value,
                            ad: kuyular.find((k) => k._id === value)?.ad || "",
                          },
                        })
                      }
                    >
                      <SelectTrigger className="bg-secondary border-neon-blue text-neon-cyan">
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

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="edit-tarih"
                    className="text-right text-neon-blue"
                  >
                    Tarih Aralığı
                  </Label>
                  <div className="col-span-3 space-y-2">
                    <Input
                      type="date"
                      value={
                        editingFatura.baslangic_tarihi
                          .toISOString()
                          .split("T")[0]
                      }
                      onChange={(e) =>
                        setEditingFatura({
                          ...editingFatura,
                          baslangic_tarihi: new Date(e.target.value),
                        })
                      }
                      className="bg-secondary border-neon-blue text-neon-cyan"
                    />
                    <Input
                      type="date"
                      value={
                        editingFatura.bitis_tarihi.toISOString().split("T")[0]
                      }
                      onChange={(e) =>
                        setEditingFatura({
                          ...editingFatura,
                          bitis_tarihi: new Date(e.target.value),
                        })
                      }
                      className="bg-secondary border-neon-blue text-neon-cyan"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="edit-tutar"
                    className="text-right text-neon-blue"
                  >
                    Tutar
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="edit-tutar"
                      type="number"
                      value={editingFatura.tutar}
                      onChange={(e) =>
                        setEditingFatura({
                          ...editingFatura,
                          tutar: Number(e.target.value),
                        })
                      }
                      className="bg-secondary border-neon-blue text-neon-cyan"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="edit-odendi"
                    className="text-right text-neon-blue"
                  >
                    Ödendi
                  </Label>
                  <div className="col-span-3">
                    <input
                      type="checkbox"
                      id="edit-odendi"
                      checked={editingFatura.odendi}
                      onChange={(e) =>
                        setEditingFatura({
                          ...editingFatura,
                          odendi: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-neon-blue text-neon-purple focus:ring-neon-purple"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="neon-button">
                  Güncelle
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </Layout>
  );
};

export default KuyuFaturalarPage;
