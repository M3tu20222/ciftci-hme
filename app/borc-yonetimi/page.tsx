"use client";

import type React from "react";

import { useState, useEffect } from "react";
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

interface OrtakBorc {
  _id: string;
  alacakli_id: {
    _id: string;
    name: string;
  };
  borc_turu: {
    _id: string;
    ad: string;
  };
  miktar: number;
  birim: {
    _id: string;
    ad: string;
  };
  borc_tutari: number;
  odeme_durumu: string;
  notlar: string;
  odeme_sekli?: string;
  odeme_tarihi?: string;
  onaylandi: boolean;
  borclu_paylar: Array<{
    borclu_id: {
      _id: string;
      name: string;
    };
    pay: number;
  }>;
  taksit_sayisi: number;
  ilk_taksit_tarihi: string; // Changed from Date to string
  taksit_araligi: number;
}

interface BorcTuru {
  _id: string;
  ad: string;
}

interface Birim {
  _id: string;
  ad: string;
}

export default function BorcYonetimiPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ortakBorclar, setOrtakBorclar] = useState<OrtakBorc[]>([]);
  const [borcTurleri, setBorcTurleri] = useState<BorcTuru[]>([]);
  const [birimler, setBirimler] = useState<Birim[]>([]);
  const [yeniBorc, setYeniBorc] = useState<Partial<OrtakBorc>>({
    taksit_sayisi: 1,
    taksit_araligi: 30,
    ilk_taksit_tarihi: "", //Initialized with empty string
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tum-borclar");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchOrtakBorclar();
      fetchBorcTurleri();
      fetchBirimler();
    }
  }, [status, router]);

  const fetchOrtakBorclar = async () => {
    try {
      const res = await fetch("/api/ortak-borc");
      if (!res.ok) throw new Error("Ortak borçlar getirilemedi");
      const data = await res.json();
      setOrtakBorclar(data);
    } catch (error) {
      console.error("Ortak borçları getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Ortak borçlar yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const fetchBorcTurleri = async () => {
    try {
      const res = await fetch("/api/borc-turu");
      if (!res.ok) throw new Error("Borç türleri getirilemedi");
      const data = await res.json();
      setBorcTurleri(data);
    } catch (error) {
      console.error("Borç türlerini getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Borç türleri yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const fetchBirimler = async () => {
    try {
      const res = await fetch("/api/birim");
      if (!res.ok) throw new Error("Birimler getirilemedi");
      const data = await res.json();
      setBirimler(data);
    } catch (error) {
      console.error("Birimleri getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Birimler yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleBorcEkle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/ortak-borc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...yeniBorc,
          taksit_sayisi: Number(yeniBorc.taksit_sayisi) || 1,
          taksit_araligi: Number(yeniBorc.taksit_araligi) || 30,
        }),
      });
      if (!res.ok) throw new Error("Borç eklenirken bir hata oluştu");
      await fetchOrtakBorclar();
      setYeniBorc({});
      setIsDialogOpen(false);
      toast({ title: "Başarılı", description: "Yeni borç başarıyla eklendi." });
    } catch (error) {
      console.error("Borç ekleme hatası:", error);
      toast({
        title: "Hata",
        description: "Borç eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleBorcOde = async (borcId: string) => {
    try {
      const res = await fetch(`/api/ortak-borc`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: borcId, odeme_durumu: "Ödendi" }),
      });
      if (!res.ok) throw new Error("Borç ödenirken bir hata oluştu");
      await fetchOrtakBorclar();
      toast({ title: "Başarılı", description: "Borç başarıyla ödendi." });
    } catch (error) {
      console.error("Borç ödeme hatası:", error);
      toast({
        title: "Hata",
        description: "Borç ödenirken bir hata oluştu.",
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

  return (
    <Layout>
      <div className="container mx-auto p-4 min-h-screen bg-gray-900/50">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center text-neon-green glow-text-green mb-2">
            Borç Yönetimi
          </h1>
          <p className="text-center text-neon-blue opacity-80">
            Borçlarınızı ve alacaklarınızı yönetin
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid w-[400px] grid-cols-2 bg-gray-800/50 border border-neon-purple rounded-lg p-1">
              <TabsTrigger
                value="tum-borclar"
                className="data-[state=active]:bg-neon-purple data-[state=active]:text-white rounded-md transition-all duration-200"
              >
                Tüm Borçlar
              </TabsTrigger>
              <TabsTrigger
                value="benim-borclarim"
                className="data-[state=active]:bg-neon-purple data-[state=active]:text-white rounded-md transition-all duration-200"
              >
                Benim Borçlarım
              </TabsTrigger>
            </TabsList>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-neon-purple hover:bg-neon-pink text-white shadow-neon-purple/50 shadow-lg transition-all duration-300">
                  <Wallet className="mr-2 h-4 w-4" /> Yeni Borç Ekle
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-2 border-neon-purple">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-neon-purple">
                    Yeni Borç Ekle
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleBorcEkle}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label className="text-neon-blue">Borç Türü</Label>
                      <Select
                        value={yeniBorc.borc_turu?._id}
                        onValueChange={(value) =>
                          setYeniBorc({
                            ...yeniBorc,
                            borc_turu: { _id: value, ad: "" },
                          })
                        }
                      >
                        <SelectTrigger className="bg-gray-800 text-neon-green border-neon-blue">
                          <SelectValue placeholder="Borç türü seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {borcTurleri.map((tur) => (
                            <SelectItem key={tur._id} value={tur._id}>
                              {tur.ad}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-neon-blue">Miktar</Label>
                      <Input
                        type="number"
                        value={yeniBorc.miktar || ""}
                        onChange={(e) =>
                          setYeniBorc({
                            ...yeniBorc,
                            miktar: Number(e.target.value),
                          })
                        }
                        className="bg-gray-800 text-neon-pink border-neon-blue"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-neon-blue">Birim</Label>
                      <Select
                        value={yeniBorc.birim?._id}
                        onValueChange={(value) =>
                          setYeniBorc({
                            ...yeniBorc,
                            birim: { _id: value, ad: "" },
                          })
                        }
                      >
                        <SelectTrigger className="bg-gray-800 text-neon-green border-neon-blue">
                          <SelectValue placeholder="Birim seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {birimler.map((birim) => (
                            <SelectItem key={birim._id} value={birim._id}>
                              {birim.ad}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-neon-blue">Borç Tutarı (TL)</Label>
                      <Input
                        type="number"
                        value={yeniBorc.borc_tutari || ""}
                        onChange={(e) =>
                          setYeniBorc({
                            ...yeniBorc,
                            borc_tutari: Number(e.target.value),
                          })
                        }
                        className="bg-gray-800 text-neon-pink border-neon-blue"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-neon-blue">Notlar</Label>
                      <Input
                        value={yeniBorc.notlar || ""}
                        onChange={(e) =>
                          setYeniBorc({ ...yeniBorc, notlar: e.target.value })
                        }
                        className="bg-gray-800 text-neon-pink border-neon-blue"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-neon-blue">Taksit Sayısı</Label>
                      <Input
                        type="number"
                        value={yeniBorc.taksit_sayisi || 1}
                        onChange={(e) =>
                          setYeniBorc({
                            ...yeniBorc,
                            taksit_sayisi: Number(e.target.value),
                          })
                        }
                        className="bg-gray-800 text-neon-pink border-neon-blue"
                        min="1"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-neon-blue">
                        İlk Taksit Tarihi
                      </Label>
                      <Input
                        type="date"
                        value={yeniBorc.ilk_taksit_tarihi || ""}
                        onChange={(e) =>
                          setYeniBorc({
                            ...yeniBorc,
                            ilk_taksit_tarihi: e.target.value,
                          })
                        }
                        className="bg-gray-800 text-neon-pink border-neon-blue"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-neon-blue">
                        Taksit Aralığı (Gün)
                      </Label>
                      <Input
                        type="number"
                        value={yeniBorc.taksit_araligi || 30}
                        onChange={(e) =>
                          setYeniBorc({
                            ...yeniBorc,
                            taksit_araligi: Number(e.target.value),
                          })
                        }
                        className="bg-gray-800 text-neon-pink border-neon-blue"
                        min="1"
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

          <TabsContent value="tum-borclar" className="mt-0">
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
                        <span className="text-sm text-neon-blue">Alacaklı</span>
                        <span>{borc.alacakli_id.name}</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center gap-2 text-neon-blue">
                      <Wallet className="h-4 w-4" />
                      <span>Borç Türü:</span>
                      <span className="text-neon-green">
                        {borc.borc_turu?.ad || "Belirtilmemiş"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-neon-blue">
                      <Wallet className="h-4 w-4" />
                      <span>Miktar:</span>
                      <span className="text-neon-green">
                        {formatNumber(borc.miktar)} {borc.birim?.ad || "Birim"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-neon-blue">
                      <Wallet className="h-4 w-4" />
                      <span>Tutar:</span>
                      <span className="text-neon-green">
                        {formatNumber(borc.borc_tutari)} TL
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
                    {borc.odeme_tarihi && (
                      <div className="flex items-center gap-2 text-neon-blue">
                        <Calendar className="h-4 w-4" />
                        <span>Ödeme Tarihi:</span>
                        <span className="text-neon-green">
                          {format(new Date(borc.odeme_tarihi), "d MMMM yyyy", {
                            locale: tr,
                          })}
                        </span>
                      </div>
                    )}
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
                    <div className="mt-4">
                      <h4 className="text-neon-blue mb-2">Borçlular:</h4>
                      {borc.borclu_paylar.map((borclu, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-neon-green"
                        >
                          <span>{borclu.borclu_id.name}</span>
                          <span>{borclu.pay}%</span>
                        </div>
                      ))}
                    </div>
                    {borc.odeme_durumu !== "Ödendi" &&
                      borc.borclu_paylar.some(
                        (bp) => bp.borclu_id._id === session?.user?.id
                      ) && (
                        <Button
                          onClick={() => handleBorcOde(borc._id)}
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

          <TabsContent value="benim-borclarim" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ortakBorclar
                .filter((borc) =>
                  borc.borclu_paylar.some(
                    (bp) => bp.borclu_id._id === session?.user?.id
                  )
                )
                .map((borc) => (
                  <Card
                    key={borc._id}
                    className="bg-gray-800/50 border-2 border-neon-purple hover:border-neon-pink transition-all duration-300"
                  >
                    <CardHeader className="border-b border-gray-700">
                      <CardTitle className="text-xl text-neon-pink flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        <div className="flex flex-col">
                          <span className="text-sm text-neon-blue">
                            Alacaklı
                          </span>
                          <span>{borc.alacakli_id.name}</span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-center gap-2 text-neon-blue">
                        <Wallet className="h-4 w-4" />
                        <span>Borç Türü:</span>
                        <span className="text-neon-green">
                          {borc.borc_turu?.ad || "Belirtilmemiş"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-neon-blue">
                        <Wallet className="h-4 w-4" />
                        <span>Miktar:</span>
                        <span className="text-neon-green">
                          {formatNumber(borc.miktar)}{" "}
                          {borc.birim?.ad || "Birim"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-neon-blue">
                        <Wallet className="h-4 w-4" />
                        <span>Tutar:</span>
                        <span className="text-neon-green">
                          {formatNumber(borc.borc_tutari)} TL
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
                      {borc.odeme_tarihi && (
                        <div className="flex items-center gap-2 text-neon-blue">
                          <Calendar className="h-4 w-4" />
                          <span>Ödeme Tarihi:</span>
                          <span className="text-neon-green">
                            {format(
                              new Date(borc.odeme_tarihi),
                              "d MMMM yyyy",
                              {
                                locale: tr,
                              }
                            )}
                          </span>
                        </div>
                      )}
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
                      <div className="mt-4">
                        <h4 className="text-neon-blue mb-2">Benim Payım:</h4>
                        {borc.borclu_paylar
                          .filter(
                            (bp) => bp.borclu_id._id === session?.user?.id
                          )
                          .map((borclu, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center text-neon-green"
                            >
                              <span>Borç Payı:</span>
                              <span>{borclu.pay}%</span>
                            </div>
                          ))}
                      </div>
                      {borc.odeme_durumu !== "Ödendi" && (
                        <Button
                          onClick={() => handleBorcOde(borc._id)}
                          className="w-full mt-4 bg-neon-green hover:bg-neon-blue text-black transition-all duration-300"
                        >
                          Borcu Öde
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </Layout>
  );
}
