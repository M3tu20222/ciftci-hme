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
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  PlusCircle,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface TarlaIsleme {
  _id: string;
  tarla_id: {
    _id: string;
    ad: string;
    dekar: number;
  };
  islem_tarihi: string;
  ekipman: {
    _id: string;
    ad: string;
    yakitTuketimi: number;
  };
  yakit_tuketimi: number;
  maliyet?: number;
  notlar?: string;
  created_by: {
    _id: string;
    name: string;
  };
}

interface Tarla {
  _id: string;
  ad: string;
  dekar: number;
}

interface Envanter {
  _id: string;
  ad: string;
  yakitTuketimi: number;
}

interface TarlaSahip {
  _id: string;
  tarla_id: string;
  sahipler: {
    sahip_id: string;
    yuzde: number;
  }[];
}

export default function TarlaIslemePage() {
  const [tarlaIslemeleri, setTarlaIslemeleri] = useState<TarlaIsleme[]>([]);
  const [tarlalar, setTarlalar] = useState<Tarla[]>([]);
  const [envanterler, setEnvanterler] = useState<Envanter[]>([]);
  const [tarlaSahipleri, setTarlaSahipleri] = useState<TarlaSahip[]>([]);
  const [yeniIsleme, setYeniIsleme] = useState<Partial<TarlaIsleme>>({});
  const [editingIsleme, setEditingIsleme] = useState<TarlaIsleme | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchTarlaIslemeleri();
      fetchTarlalar();
      fetchEnvanterler();
      fetchTarlaSahipleri();
    }
  }, [status, router]); // Bağımlılık dizisi yalnızca `status` ve `router` içeriyor.
  
  const fetchTarlaIslemeleri = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        startDate,
        endDate,
      });
      const res = await fetch(`/api/tarla-isleme?${queryParams}`);
      if (!res.ok) throw new Error("Tarla işlemeleri getirilemedi");
      const data = await res.json();
      setTarlaIslemeleri(data.tarlaIslemeleri);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Tarla işlemeleri getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Tarla işlemeleri yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const fetchTarlalar = async () => {
    try {
      const res = await fetch("/api/tarlalar");
      if (!res.ok) throw new Error("Tarlalar getirilemedi");
      const data = await res.json();
      setTarlalar(data);
    } catch (error) {
      console.error("Tarlalar getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Tarlalar yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const fetchEnvanterler = async () => {
    try {
      const res = await fetch("/api/envanter");
      if (!res.ok) throw new Error("Envanterler getirilemedi");
      const data = await res.json();
      setEnvanterler(data);
    } catch (error) {
      console.error("Envanterler getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Envanterler yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const fetchTarlaSahipleri = async () => {
    try {
      const res = await fetch("/api/tarla-sahipler");
      if (!res.ok) throw new Error("Tarla sahipleri getirilemedi");
      const data = await res.json();
      setTarlaSahipleri(data);
    } catch (error) {
      console.error("Tarla sahipleri getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Tarla sahipleri yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleAddIsleme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/tarla-isleme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(yeniIsleme),
      });
      if (!res.ok) throw new Error("Tarla işleme eklenirken bir hata oluştu");
      await fetchTarlaIslemeleri();
      setYeniIsleme({});
      toast({
        title: "Başarılı",
        description: "Yeni tarla işleme başarıyla eklendi.",
      });
    } catch (error) {
      console.error("Tarla işleme ekleme hatası:", error);
      toast({
        title: "Hata",
        description: "Tarla işleme eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleEditIsleme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIsleme) return;
    try {
      const res = await fetch(`/api/tarla-isleme/${editingIsleme._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingIsleme),
      });
      if (!res.ok)
        throw new Error("Tarla işleme güncellenirken bir hata oluştu");
      await fetchTarlaIslemeleri();
      setEditingIsleme(null);
      toast({
        title: "Başarılı",
        description: "Tarla işleme başarıyla güncellendi.",
      });
    } catch (error) {
      console.error("Tarla işleme güncelleme hatası:", error);
      toast({
        title: "Hata",
        description: "Tarla işleme güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteIsleme = async (id: string) => {
    if (!confirm("Bu tarla işleme kaydını silmek istediğinizden emin misiniz?"))
      return;
    try {
      const res = await fetch(`/api/tarla-isleme/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Tarla işleme silinirken bir hata oluştu");
      await fetchTarlaIslemeleri();
      toast({
        title: "Başarılı",
        description: "Tarla işleme başarıyla silindi.",
      });
    } catch (error) {
      console.error("Tarla işleme silme hatası:", error);
      toast({
        title: "Hata",
        description: "Tarla işleme silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const calculateTotalYakitTuketimi = () => {
    const selectedTarla = tarlalar.find(
      (t) => t._id === yeniIsleme.tarla_id?._id
    );
    const selectedEkipman = envanterler.find(
      (e) => e._id === yeniIsleme.ekipman?._id
    );
    if (selectedTarla && selectedEkipman) {
      return selectedTarla.dekar * selectedEkipman.yakitTuketimi;
    }
    return 0;
  };

  const getYakitDagilimi = () => {
    const selectedTarla = tarlalar.find(
      (t) => t._id === yeniIsleme.tarla_id?._id
    );
    const tarlaSahip = tarlaSahipleri.find(
      (ts) => ts.tarla_id === selectedTarla?._id
    );
    const totalYakitTuketimi = calculateTotalYakitTuketimi();

    if (tarlaSahip && totalYakitTuketimi > 0) {
      return tarlaSahip.sahipler.map((sahip) => ({
        sahip_id: sahip.sahip_id,
        yakit: (totalYakitTuketimi * sahip.yuzde) / 100,
      }));
    }
    return [];
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-pink title-glow">
          Tarla İşleme Yönetimi
        </h1>

        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-gray-800 text-neon-blue border-neon-blue"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-gray-800 text-neon-blue border-neon-blue"
            />
            <Button
              onClick={() => fetchTarlaIslemeleri()}
              className="bg-neon-purple hover:bg-neon-pink text-white"
            >
              Filtrele
            </Button>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-neon-green hover:bg-neon-blue text-black">
                <PlusCircle className="mr-2 h-4 w-4" /> Yeni İşleme Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-2 border-neon-blue">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-neon-blue">
                  Yeni Tarla İşleme Ekle
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddIsleme}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="tarla"
                      className="text-right text-neon-green"
                    >
                      Tarla
                    </Label>
                    <Select
                      value={yeniIsleme.tarla_id?._id}
                      onValueChange={(value) =>
                        setYeniIsleme({
                          ...yeniIsleme,
                          tarla_id: {
                            _id: value,
                            ad: tarlalar.find((t) => t._id === value)?.ad || "",
                            dekar:
                              tarlalar.find((t) => t._id === value)?.dekar || 0,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue">
                        <SelectValue placeholder="Tarla seçin" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800/80 backdrop-blur-sm border-neon-blue">
                        {tarlalar.map((tarla) => (
                          <SelectItem
                            key={tarla._id}
                            value={tarla._id}
                            className="text-neon-pink hover:bg-neon-blue hover:text-white"
                          >
                            {tarla.ad}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="islem_tarihi"
                      className="text-right text-neon-green"
                    >
                      İşlem Tarihi
                    </Label>
                    <Input
                      id="islem_tarihi"
                      type="date"
                      value={yeniIsleme.islem_tarihi || ""}
                      onChange={(e) =>
                        setYeniIsleme({
                          ...yeniIsleme,
                          islem_tarihi: e.target.value,
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="ekipman"
                      className="text-right text-neon-green"
                    >
                      Ekipman
                    </Label>
                    <Select
                      value={yeniIsleme.ekipman?._id}
                      onValueChange={(value) =>
                        setYeniIsleme({
                          ...yeniIsleme,
                          ekipman: {
                            _id: value,
                            ad:
                              envanterler.find((e) => e._id === value)?.ad ||
                              "",
                            yakitTuketimi:
                              envanterler.find((e) => e._id === value)
                                ?.yakitTuketimi || 0,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue">
                        <SelectValue placeholder="Ekipman seçin" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800/80 backdrop-blur-sm border-neon-blue">
                        {envanterler
                          .filter((e) => e.yakitTuketimi > 0)
                          .map((envanter) => (
                            <SelectItem
                              key={envanter._id}
                              value={envanter._id}
                              className="text-neon-pink hover:bg-neon-blue hover:text-white"
                            >
                              {envanter.ad}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="total_yakit_tuketimi"
                      className="text-right text-neon-green"
                    >
                      Total Yakıt Tüketimi
                    </Label>
                    <Input
                      id="total_yakit_tuketimi"
                      type="number"
                      value={calculateTotalYakitTuketimi()}
                      readOnly
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="maliyet"
                      className="text-right text-neon-green"
                    >
                      Maliyet (Opsiyonel)
                    </Label>
                    <Input
                      id="maliyet"
                      type="number"
                      value={yeniIsleme.maliyet || ""}
                      onChange={(e) =>
                        setYeniIsleme({
                          ...yeniIsleme,
                          maliyet: Number(e.target.value),
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="notlar"
                      className="text-right text-neon-green"
                    >
                      Notlar
                    </Label>
                    <Input
                      id="notlar"
                      value={yeniIsleme.notlar || ""}
                      onChange={(e) =>
                        setYeniIsleme({ ...yeniIsleme, notlar: e.target.value })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-neon-blue font-bold mb-2">
                    Yakıt Dağılımı:
                  </h3>
                  {getYakitDagilimi().map((dagilim, index) => (
                    <p key={index} className="text-neon-green">
                      Sahip {index + 1}: {dagilim.yakit.toFixed(2)} Lt
                    </p>
                  ))}
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
          {tarlaIslemeleri.map((isleme) => (
            <Card
              key={isleme._id}
              className="bg-gray-800 border-2 border-neon-purple"
            >
              <CardHeader>
                <CardTitle className="text-neon-pink">
                  {isleme.tarla_id.ad}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neon-blue">
                  İşlem Tarihi:{" "}
                  <span className="text-neon-green">
                    {format(new Date(isleme.islem_tarihi), "dd.MM.yyyy", {
                      locale: tr,
                    })}
                  </span>
                </p>
                <p className="text-neon-blue">
                  Ekipman:{" "}
                  <span className="text-neon-green">{isleme.ekipman.ad}</span>
                </p>
                <p className="text-neon-blue">
                  Yakıt Tüketimi:{" "}
                  <span className="text-neon-green">
                    {isleme.yakit_tuketimi.toFixed(2)} Lt
                  </span>
                </p>
                {isleme.maliyet && (
                  <p className="text-neon-blue">
                    Maliyet:{" "}
                    <span className="text-neon-green">{isleme.maliyet} TL</span>
                  </p>
                )}
                {isleme.notlar && (
                  <p className="text-neon-blue">
                    Notlar:{" "}
                    <span className="text-neon-green">{isleme.notlar}</span>
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-neon-cyan hover:bg-neon-blue text-black"
                      onClick={() => setEditingIsleme(isleme)}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Düzenle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-2 border-neon-blue">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-neon-blue">
                        Tarla İşleme Düzenle
                      </DialogTitle>
                    </DialogHeader>
                    {editingIsleme && (
                      <form onSubmit={handleEditIsleme}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="tarla"
                              className="text-right text-neon-green"
                            >
                              Tarla
                            </Label>
                            <Select
                              value={editingIsleme.tarla_id._id}
                              onValueChange={(value) =>
                                setEditingIsleme({
                                  ...editingIsleme,
                                  tarla_id: {
                                    _id: value,
                                    ad:
                                      tarlalar.find((t) => t._id === value)
                                        ?.ad || "",
                                    dekar:
                                      tarlalar.find((t) => t._id === value)
                                        ?.dekar || 0,
                                  },
                                })
                              }
                            >
                              <SelectTrigger className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue">
                                <SelectValue placeholder="Tarla seçin" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800/80 backdrop-blur-sm border-neon-blue">
                                {tarlalar.map((tarla) => (
                                  <SelectItem
                                    key={tarla._id}
                                    value={tarla._id}
                                    className="text-neon-pink hover:bg-neon-blue hover:text-white"
                                  >
                                    {tarla.ad}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="islem_tarihi"
                              className="text-right text-neon-green"
                            >
                              İşlem Tarihi
                            </Label>
                            <Input
                              id="islem_tarihi"
                              type="date"
                              value={
                                editingIsleme.islem_tarihi
                                  ? new Date(editingIsleme.islem_tarihi)
                                      .toISOString()
                                      .split("T")[0]
                                  : ""
                              }
                              onChange={(e) =>
                                setEditingIsleme({
                                  ...editingIsleme,
                                  islem_tarihi: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="ekipman"
                              className="text-right text-neon-green"
                            >
                              Ekipman
                            </Label>
                            <Select
                              value={editingIsleme.ekipman._id}
                              onValueChange={(value) =>
                                setEditingIsleme({
                                  ...editingIsleme,
                                  ekipman: {
                                    _id: value,
                                    ad:
                                      envanterler.find((e) => e._id === value)
                                        ?.ad || "",
                                    yakitTuketimi:
                                      envanterler.find((e) => e._id === value)
                                        ?.yakitTuketimi || 0,
                                  },
                                })
                              }
                            >
                              <SelectTrigger className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue">
                                <SelectValue placeholder="Ekipman seçin" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800/80 backdrop-blur-sm border-neon-blue">
                                {envanterler
                                  .filter((e) => e.yakitTuketimi > 0)
                                  .map((envanter) => (
                                    <SelectItem
                                      key={envanter._id}
                                      value={envanter._id}
                                      className="text-neon-pink hover:bg-neon-blue hover:text-white"
                                    >
                                      {envanter.ad}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="maliyet"
                              className="text-right text-neon-green"
                            >
                              Maliyet (Opsiyonel)
                            </Label>
                            <Input
                              id="maliyet"
                              type="number"
                              value={editingIsleme.maliyet || ""}
                              onChange={(e) =>
                                setEditingIsleme({
                                  ...editingIsleme,
                                  maliyet: Number(e.target.value),
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="notlar"
                              className="text-right text-neon-green"
                            >
                              Notlar
                            </Label>
                            <Input
                              id="notlar"
                              value={editingIsleme.notlar || ""}
                              onChange={(e) =>
                                setEditingIsleme({
                                  ...editingIsleme,
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
                            Kaydet
                          </Button>
                        </DialogFooter>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
                <Button
                  className="bg-neon-red hover:bg-neon-pink text-white"
                  onClick={() => handleDeleteIsleme(isleme._id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Sil
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center items-center space-x-2 mt-4">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-neon-blue hover:bg-neon-cyan text-black"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-neon-pink">
            Sayfa {currentPage} / {totalPages}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="bg-neon-blue hover:bg-neon-cyan text-black"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Toaster />
    </Layout>
  );
}
