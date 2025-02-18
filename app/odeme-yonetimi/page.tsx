"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  Wallet,
  Calendar,
  Clock,
  FileText,
  CreditCard,
  Users,
} from "lucide-react";
import { formatNumber } from "@/utils/formatNumber";

interface OdemeKaydi {
  _id: string;
  kuyu_fatura_id: {
    _id: string;
    baslangic_tarihi: string;
    bitis_tarihi: string;
    tutar: number;
  };
  odeme_yapan_id: {
    _id: string;
    name: string;
  };
  odeme_tarihi: string;
  odeme_tutari: number;
  odeme_yontemi: string;
  erteleme_suresi: number;
  notlar: string;
}

interface OrtakBorc {
  _id: string;
  odeme_kaydi_id: {
    odeme_tarihi: string;
    odeme_tutari: number;
  };
  borclu_id: {
    _id: string;
    name: string;
  };
  alacakli_id: {
    _id: string;
    name: string;
  };
  borc_tutari: number;
  odeme_durumu: string;
  notlar: string;
  odeme_sekli?: string;
  odeme_tarihi?: string;
  onaylandi: boolean;
}

interface KuyuFatura {
  _id: string;
  kuyu_id: {
    _id: string;
    ad: string;
  };
  baslangic_tarihi: string;
  bitis_tarihi: string;
  tutar: number;
}

interface SulamaAnalizi {
  sahipAnalizi: {
    sahip: {
      _id: string;
      name: string;
    };
    toplamSure: number;
    toplamMaliyet: number;
    tarlalar: string[];
  }[];
  toplamSulamaSuresi: number;
  kuyuFatura: {
    tutar: number;
  };
  birimMaliyet: number;
}

const formatSure = (dakika: number): string => {
  const saat = Math.floor(dakika / 60);
  const kalanDakika = Math.round(dakika % 60);
  return `${saat} saat ${kalanDakika} dakika`;
};

export default function OdemeYonetimiPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [odemeKayitlari, setOdemeKayitlari] = useState<OdemeKaydi[]>([]);
  const [ortakBorclar, setOrtakBorclar] = useState<OrtakBorc[]>([]);
  const [yeniOdeme, setYeniOdeme] = useState({
    kuyu_fatura_id: "",
    odeme_tarihi: "",
    odeme_tutari: 0,
    odeme_yontemi: "",
    erteleme_suresi: 0,
    notlar: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [kuyuFaturalar, setKuyuFaturalar] = useState<KuyuFatura[]>([]);
  const [activeTab, setActiveTab] = useState("odeme-kayitlari");
  const [sulamaAnalizi, setSulamaAnalizi] = useState<SulamaAnalizi | null>(
    null
  );
  const [selectedKuyuFatura, setSelectedKuyuFatura] =
    useState<KuyuFatura | null>(null);
  const [isOdemeDialogOpen, setIsOdemeDialogOpen] = useState(false);
  const [selectedBorc, setSelectedBorc] = useState<OrtakBorc | null>(null);
  const [odemeBilgileri, setOdemeBilgileri] = useState({
    odeme_sekli: "",
    notlar: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchOdemeKayitlari();
      fetchOrtakBorclar();
      fetchKuyuFaturalar();
    }
  }, [status, router]);

  const fetchOdemeKayitlari = async () => {
    try {
      const res = await fetch("/api/odeme-kaydi");
      if (!res.ok) throw new Error("Ödeme kayıtları getirilemedi");
      const data = await res.json();
      setOdemeKayitlari(data);
    } catch (error) {
      console.error("Ödeme kayıtları getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Ödeme kayıtları yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const fetchOrtakBorclar = async () => {
    try {
      const res = await fetch("/api/ortak-borc");
      if (!res.ok) throw new Error("Ortak borçlar getirilemedi");
      const data = await res.json();
      setOrtakBorclar(data);
    } catch (error) {
      console.error("Ortak borçlar getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Ortak borçlar yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const fetchKuyuFaturalar = async () => {
    try {
      const res = await fetch("/api/kuyu-faturalar");
      if (!res.ok) throw new Error("Kuyu faturaları getirilemedi");
      const data = await res.json();
      setKuyuFaturalar(data);
    } catch (error) {
      console.error("Kuyu faturaları getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Kuyu faturaları yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const fetchSulamaAnalizi = useCallback(
    async (kuyuId: string, baslangicTarihi: string, bitisTarihi: string) => {
      try {
        const res = await fetch(
          `/api/sulama-analizi?kuyu_id=${kuyuId}&baslangic=${baslangicTarihi}&bitis=${bitisTarihi}`
        );
        if (!res.ok) throw new Error("Sulama analizi getirilemedi");
        const data = await res.json();
        console.log("Sulama analizi data:", data);
        setSulamaAnalizi(data);
      } catch (error) {
        console.error("Sulama analizi getirme hatası:", error);
        toast({
          title: "Hata",
          description: "Sulama analizi yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    },
    []
  );

  const handleAddOdeme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKuyuFatura || !sulamaAnalizi) return;

    const odemeYapanId = session?.user?.id;
    if (!odemeYapanId) {
      toast({
        title: "Hata",
        description: "Oturum bilgisi alınamadı.",
        variant: "destructive",
      });
      return;
    }

    const toplamBorc = sulamaAnalizi.kuyuFatura.tutar;

    try {
      const odemeRes = await fetch("/api/odeme-kaydi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...yeniOdeme,
          odeme_yapan_id: odemeYapanId,
          odeme_tutari: toplamBorc,
        }),
      });
      if (!odemeRes.ok) throw new Error("Ödeme eklenirken bir hata oluştu");
      const odemeData = await odemeRes.json();

      await fetchOdemeKayitlari();
      await fetchOrtakBorclar();
      setYeniOdeme({
        kuyu_fatura_id: "",
        odeme_tarihi: "",
        odeme_tutari: 0,
        odeme_yontemi: "",
        erteleme_suresi: 0,
        notlar: "",
      });
      setIsDialogOpen(false);
      setSulamaAnalizi(null);
      setSelectedKuyuFatura(null);
      toast({
        title: "Başarılı",
        description: "Ödeme başarıyla eklendi ve vade tarihi hesaplandı.",
      });
    } catch (error) {
      console.error("Ödeme ekleme hatası:", error);
      toast({
        title: "Hata",
        description: "Ödeme eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleBorcOde = async (borc: OrtakBorc) => {
    setSelectedBorc(borc);
    setIsOdemeDialogOpen(true);
  };

  const handleOdemeGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBorc) return;

    try {
      const res = await fetch(`/api/ortak-borc`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedBorc._id,
          odeme_durumu: "Ödendi",
          odeme_sekli: odemeBilgileri.odeme_sekli,
          notlar: odemeBilgileri.notlar,
        }),
      });
      if (!res.ok) throw new Error("Borç ödenirken bir hata oluştu");
      await fetchOrtakBorclar();
      setIsOdemeDialogOpen(false);
      toast({ title: "Başarılı", description: "Ödeme başarıyla kaydedildi." });
    } catch (error) {
      console.error("Borç ödeme hatası:", error);
      toast({
        title: "Hata",
        description: "Ödeme kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleOdemeOnayla = async (borcId: string) => {
    try {
      const res = await fetch(`/api/ortak-borc`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: borcId, onaylandi: true }),
      });
      if (!res.ok) throw new Error("Ödeme onaylanırken bir hata oluştu");
      await fetchOrtakBorclar();
      toast({ title: "Başarılı", description: "Ödeme başarıyla onaylandı." });
    } catch (error) {
      console.error("Ödeme onaylama hatası:", error);
      toast({
        title: "Hata",
        description: "Ödeme onaylanırken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleKuyuFaturaSelect = (value: string) => {
    const selectedFatura = kuyuFaturalar.find((fatura) => fatura._id === value);
    if (selectedFatura) {
      setSelectedKuyuFatura(selectedFatura);
      setYeniOdeme({
        ...yeniOdeme,
        kuyu_fatura_id: value,
        odeme_tutari: selectedFatura.tutar,
      });
      fetchSulamaAnalizi(
        selectedFatura.kuyu_id._id,
        selectedFatura.baslangic_tarihi,
        selectedFatura.bitis_tarihi
      );
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 min-h-screen bg-gray-900/50">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center text-neon-green glow-text-green mb-2">
            Ödeme Yönetimi
          </h1>
          <p className="text-center text-neon-blue opacity-80">
            Ödemeleri ve ortak borçları yönetin
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid w-[400px] grid-cols-2 bg-gray-800/50 border border-neon-purple rounded-lg p-1">
              <TabsTrigger
                value="odeme-kayitlari"
                className="data-[state=active]:bg-neon-purple data-[state=active]:text-white rounded-md transition-all duration-200"
              >
                Ödeme Kayıtları
              </TabsTrigger>
              <TabsTrigger
                value="ortak-borclar"
                className="data-[state=active]:bg-neon-purple data-[state=active]:text-white rounded-md transition-all duration-200"
              >
                Ortak Borçlar
              </TabsTrigger>
            </TabsList>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-neon-purple hover:bg-neon-pink text-white shadow-neon-purple/50 shadow-lg transition-all duration-300">
                  <Wallet className="mr-2 h-4 w-4" /> Yeni Ödeme Ekle
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-2 border-neon-purple">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-neon-purple">
                    Yeni Ödeme Ekle
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddOdeme}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label className="text-neon-blue">Kuyu Faturası</Label>
                      <Select
                        value={yeniOdeme.kuyu_fatura_id}
                        onValueChange={handleKuyuFaturaSelect}
                      >
                        <SelectTrigger className="bg-gray-800 text-neon-green border-neon-blue">
                          <SelectValue placeholder="Fatura seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {kuyuFaturalar.map((fatura) => (
                            <SelectItem key={fatura._id} value={fatura._id}>
                              {fatura.kuyu_id.ad} -{" "}
                              {new Date(
                                fatura.baslangic_tarihi
                              ).toLocaleDateString()}{" "}
                              - {fatura.tutar} TL
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-neon-blue">Ödeme Tarihi</Label>
                      <Input
                        type="date"
                        value={yeniOdeme.odeme_tarihi}
                        onChange={(e) =>
                          setYeniOdeme({
                            ...yeniOdeme,
                            odeme_tarihi: e.target.value,
                          })
                        }
                        className="bg-gray-800 text-neon-pink border-neon-blue"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-neon-blue">Ödeme Tutarı</Label>
                      <Input
                        type="number"
                        value={yeniOdeme.odeme_tutari}
                        readOnly
                        className="bg-gray-800 text-neon-pink border-neon-blue"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-neon-blue">Ödeme Yöntemi</Label>
                      <Select
                        value={yeniOdeme.odeme_yontemi}
                        onValueChange={(value) =>
                          setYeniOdeme({ ...yeniOdeme, odeme_yontemi: value })
                        }
                      >
                        <SelectTrigger className="bg-gray-800 text-neon-green border-neon-blue">
                          <SelectValue placeholder="Ödeme yöntemi seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nakit">Nakit</SelectItem>
                          <SelectItem value="Kredi Kartı">
                            Kredi Kartı
                          </SelectItem>
                          <SelectItem value="Tarım Kartı">
                            Tarım Kartı
                          </SelectItem>
                          <SelectItem value="Kredi">Kredi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-neon-blue">
                        Erteleme Süresi (Ay)
                      </Label>
                      <Input
                        type="number"
                        value={yeniOdeme.erteleme_suresi}
                        onChange={(e) =>
                          setYeniOdeme({
                            ...yeniOdeme,
                            erteleme_suresi: Number(e.target.value),
                          })
                        }
                        className="bg-gray-800 text-neon-pink border-neon-blue"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-neon-blue">Notlar</Label>
                      <Input
                        value={yeniOdeme.notlar}
                        onChange={(e) =>
                          setYeniOdeme({ ...yeniOdeme, notlar: e.target.value })
                        }
                        className="bg-gray-800 text-neon-pink border-neon-blue"
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

          <TabsContent value="odeme-kayitlari" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {odemeKayitlari.map((odeme) => (
                <Card
                  key={odeme._id}
                  className="bg-gray-800/50 border-2 border-neon-purple hover:border-neon-pink transition-all duration-300"
                >
                  <CardHeader className="border-b border-gray-700">
                    <CardTitle className="text-xl text-neon-pink flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {format(new Date(odeme.odeme_tarihi), "d MMMM yyyy", {
                        locale: tr,
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center gap-2 text-neon-blue">
                      <Users className="h-4 w-4" />
                      <span>Ödeme Yapan:</span>
                      <span className="text-neon-green">
                        {odeme.odeme_yapan_id.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-neon-blue">
                      <Wallet className="h-4 w-4" />
                      <span>Tutar:</span>
                      <span className="text-neon-green">
                        {odeme.odeme_tutari} TL
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-neon-blue">
                      <CreditCard className="h-4 w-4" />
                      <span>Yöntem:</span>
                      <span className="text-neon-green">
                        {odeme.odeme_yontemi}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-neon-blue">
                      <Clock className="h-4 w-4" />
                      <span>Erteleme:</span>
                      <span className="text-neon-green">
                        {odeme.erteleme_suresi} ay
                      </span>
                    </div>
                    {odeme.notlar && (
                      <div className="flex items-center gap-2 text-neon-blue">
                        <FileText className="h-4 w-4" />
                        <span>Notlar:</span>
                        <span className="text-neon-green">{odeme.notlar}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ortak-borclar" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ortakBorclar.map((borc) => (
                <Card
                  key={borc._id}
                  className="bg-gray-800/50 border-2 border-neon-purple hover:border-neon-pink transition-all duration-300"
                >
                  <CardHeader className="border-b border-gray-700">
                    <CardTitle className="text-xl text-neon-pink flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      <div className="flex flex-col">
                        <span className="text-sm text-neon-blue">
                          Borçlu → Alacaklı
                        </span>
                        <span>
                          {borc.borclu_id.name} → {borc.alacakli_id.name}
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center gap-2 text-neon-blue">
                      <Wallet className="h-4 w-4" />
                      <span>Tutar:</span>
                      <span className="text-neon-green">
                        {formatNumber(Math.ceil(borc.borc_tutari))} TL
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-neon-blue">
                      <Clock className="h-4 w-4" />
                      <span>Durum:</span>
                      <span
                        className={
                          borc.odeme_durumu === "Ödendi"
                            ? "text-neon-green"
                            : "text-neon-pink"
                        }
                      >
                        {borc.odeme_durumu}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-neon-blue">
                      <Calendar className="h-4 w-4" />
                      <span>Ödeme Tarihi:</span>
                      <span className="text-neon-green">
                        {format(
                          new Date(borc.odeme_kaydi_id.odeme_tarihi),
                          "d MMMM yyyy",
                          {
                            locale: tr,
                          }
                        )}
                      </span>
                    </div>
                    {borc.odeme_sekli && (
                      <div className="flex items-center gap-2 text-neon-blue">
                        <CreditCard className="h-4 w-4" />
                        <span>Ödeme Şekli:</span>
                        <span className="text-neon-green">
                          {borc.odeme_sekli}
                        </span>
                      </div>
                    )}
                    {borc.notlar && (
                      <div className="flex items-center gap-2 text-neon-blue">
                        <FileText className="h-4 w-4" />
                        <span>Notlar:</span>
                        <span className="text-neon-green">{borc.notlar}</span>
                      </div>
                    )}
                    {borc.odeme_durumu !== "Ödendi" &&
                      borc.borclu_id._id === session?.user?.id && (
                        <Button
                          onClick={() => handleBorcOde(borc)}
                          className="w-full mt-4 bg-neon-green hover:bg-neon-blue text-black transition-all duration-300"
                        >
                          Borcu Öde
                        </Button>
                      )}
                    {borc.odeme_durumu === "Ödendi" &&
                      !borc.onaylandi &&
                      borc.alacakli_id._id === session?.user?.id && (
                        <Button
                          onClick={() => handleOdemeOnayla(borc._id)}
                          className="w-full mt-4 bg-neon-yellow hover:bg-neon-orange text-black transition-all duration-300"
                        >
                          Ödemeyi Onayla
                        </Button>
                      )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        {sulamaAnalizi && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-neon-purple">
            <h3 className="text-lg font-semibold text-neon-green mb-2">
              Sulama Analizi Sonuçları
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-neon-blue">Toplam Sulama Süresi:</p>
              <p className="text-neon-pink">
                {formatSure(sulamaAnalizi.toplamSulamaSuresi)}
              </p>
              <p className="text-neon-blue">Toplam Fatura Tutarı:</p>
              <p className="text-neon-pink">
                {sulamaAnalizi.kuyuFatura.tutar} TL
              </p>
              <p className="text-neon-blue">Birim Maliyet:</p>
              <p className="text-neon-pink">
                {sulamaAnalizi.birimMaliyet?.toFixed(2) ?? "N/A"} TL/dakika
              </p>
            </div>
            <h4 className="text-lg font-semibold text-neon-green mt-4 mb-2">
              Kişi Bazlı Analiz
            </h4>
            {sulamaAnalizi.sahipAnalizi.map((sahip) => (
              <div key={sahip.sahip._id} className="mb-2">
                <p className="text-neon-blue">{sahip.sahip.name}:</p>
                <p className="text-neon-pink">
                  Sulama Süresi: {formatSure(sahip.toplamSure)}
                </p>
                <p className="text-neon-pink">
                  Maliyet Payı: {sahip.toplamMaliyet.toFixed(2)} TL
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Dialog open={isOdemeDialogOpen} onOpenChange={setIsOdemeDialogOpen}>
        <DialogContent className="bg-gray-900 border-2 border-neon-purple">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-neon-purple">
              Ödeme Bilgileri
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleOdemeGonder}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label className="text-neon-blue">Ödeme Şekli</Label>
                <Select
                  value={odemeBilgileri.odeme_sekli}
                  onValueChange={(value) =>
                    setOdemeBilgileri({ ...odemeBilgileri, odeme_sekli: value })
                  }
                >
                  <SelectTrigger className="bg-gray-800 text-neon-green border-neon-blue">
                    <SelectValue placeholder="Ödeme şekli seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nakit">Nakit</SelectItem>
                    <SelectItem value="EFT">EFT</SelectItem>
                    <SelectItem value="Havale">Havale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-neon-blue">Notlar</Label>
                <Input
                  value={odemeBilgileri.notlar}
                  onChange={(e) =>
                    setOdemeBilgileri({
                      ...odemeBilgileri,
                      notlar: e.target.value,
                    })
                  }
                  className="bg-gray-800 text-neon-pink border-neon-blue"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-neon-green hover:bg-neon-blue text-black"
              >
                Ödemeyi Kaydet
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </Layout>
  );
}
