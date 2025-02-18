"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import  {Toaster} from "@/components/ui/toaster";
import {
  GlassWaterIcon as WaterIcon,
  Clock,
  DollarSign,
  Users,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface Kuyu {
  _id: string;
  ad: string;
}

interface KuyuFatura {
  _id: string;
  kuyu_id: string;
  baslangic_tarihi: string;
  bitis_tarihi: string;
  tutar: number;
}

interface SahipAnalizi {
  sahip: {
    _id: string;
    name: string;
  };
  toplamSure: number;
  toplamMaliyet: number;
  tarlalar: string[];
}

interface AnalizSonucu {
  toplamSulamaSuresi: number;
  kuyuFatura: {
    tutar: number;
  };
  birimMaliyet: number;
  sahipAnalizi: SahipAnalizi[];
  toplamFaturaDegeri: number;
}

const COLORS = [
  "#FF6AC1",
  "#03FFFF",
  "#2F4EFD",
  "#8231B4",
  "#FFFF00",
  "#3ED83E",
];

export default function SulamaAnaliziPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [kuyular, setKuyular] = useState<Kuyu[]>([]);
  const [selectedKuyu, setSelectedKuyu] = useState<string>("");
  const [kuyuFaturalar, setKuyuFaturalar] = useState<KuyuFatura[]>([]);
  const [selectedFatura, setSelectedFatura] = useState<string>("");
  const [analizSonucu, setAnalizSonucu] = useState<AnalizSonucu | null>(null);
  const [loading, setLoading] = useState(false);

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
        setKuyular([{ _id: "total", ad: "Toplam" }, ...data]);
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

  useEffect(() => {
    const fetchKuyuFaturalar = async () => {
      if (selectedKuyu) {
        try {
          const response = await fetch(
            `/api/kuyu-faturalar?kuyu_id=${selectedKuyu}`
          );
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
      }
    };
    fetchKuyuFaturalar();
  }, [selectedKuyu]);

  const handleAnalizYap = async () => {
    if (!selectedKuyu || !selectedFatura) {
      toast({
        title: "Hata",
        description: "Lütfen kuyu ve fatura seçin.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const selectedFaturaData = kuyuFaturalar.find(
        (fatura) => fatura._id === selectedFatura
      );
      if (!selectedFaturaData) throw new Error("Seçilen fatura bulunamadı");

      const response = await fetch(
        `/api/sulama-analizi?kuyu_id=${selectedKuyu}&baslangic=${selectedFaturaData.baslangic_tarihi}&bitis=${selectedFaturaData.bitis_tarihi}`
      );
      if (!response.ok) throw new Error("Analiz yapılırken bir hata oluştu");
      const data = await response.json();
      setAnalizSonucu(data);
    } catch (error) {
      console.error("Analiz hatası:", error);
      toast({
        title: "Hata",
        description: "Analiz yapılırken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatSure = (dakika: number) => {
    const saat = Math.floor(dakika / 60);
    const kalanDakika = Math.round(dakika % 60);
    return `${saat} saat ${kalanDakika} dakika`;
  };

  const formatPara = (tutar: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(tutar);
  };

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
        <h1 className="text-4xl font-bold text-center text-neon-blue mb-8 flex items-center justify-center gap-2">
          <WaterIcon className="h-10 w-10" />
          Sulama Analizi
        </h1>

        <Card className="bg-gray-900 border-neon-purple">
          <CardHeader>
            <CardTitle className="text-2xl text-neon-purple">
              Analiz Kriterleri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kuyu" className="text-neon-blue">
                  Kuyu
                </Label>
                <Select value={selectedKuyu} onValueChange={setSelectedKuyu}>
                  <SelectTrigger className="bg-gray-800 text-neon-green border-neon-blue">
                    <SelectValue placeholder="Kuyu seçin" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-neon-blue">
                    {kuyular.map((kuyu) => (
                      <SelectItem
                        key={kuyu._id}
                        value={kuyu._id}
                        className="text-neon-cyan hover:bg-gray-700"
                      >
                        {kuyu.ad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fatura" className="text-neon-blue">
                  Fatura
                </Label>
                <Select
                  value={selectedFatura}
                  onValueChange={setSelectedFatura}
                >
                  <SelectTrigger className="bg-gray-800 text-neon-green border-neon-blue">
                    <SelectValue placeholder="Fatura seçin" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-neon-blue">
                    {kuyuFaturalar.map((fatura) => (
                      <SelectItem
                        key={fatura._id}
                        value={fatura._id}
                        className="text-neon-cyan hover:bg-gray-700"
                      >
                        {`${new Date(
                          fatura.baslangic_tarihi
                        ).toLocaleDateString()} - ${new Date(
                          fatura.bitis_tarihi
                        ).toLocaleDateString()} (${formatPara(fatura.tutar)})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={handleAnalizYap}
              className="w-full bg-neon-purple hover:bg-neon-pink text-white"
              disabled={loading}
            >
              {loading ? "Analiz Yapılıyor..." : "Analiz Yap"}
            </Button>
          </CardContent>
        </Card>

        {analizSonucu && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {" "}
              {/* Updated to 4 columns */}
              <Card className="bg-gray-900 border-neon-cyan">
                <CardHeader>
                  <CardTitle className="text-xl text-neon-cyan flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Toplam Sulama Süresi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">
                    {formatSure(analizSonucu.toplamSulamaSuresi)}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-neon-green">
                <CardHeader>
                  <CardTitle className="text-xl text-neon-green flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Toplam Fatura Tutarı
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">
                    {formatPara(analizSonucu.kuyuFatura?.tutar || 0)}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-neon-pink">
                <CardHeader>
                  <CardTitle className="text-xl text-neon-pink flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Birim Sulama Maliyeti
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">
                    {formatPara(analizSonucu.birimMaliyet)} / dakika
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-neon-yellow">
                <CardHeader>
                  <CardTitle className="text-xl text-neon-yellow flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Toplam Fatura Değeri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">
                    {formatPara(analizSonucu.toplamFaturaDegeri)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-neon-purple">
                <CardHeader>
                  <CardTitle className="text-xl text-neon-purple flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Sahip Analizi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analizSonucu.sahipAnalizi.map((sahip, index) => (
                      <Card
                        key={sahip.sahip._id}
                        className="bg-gray-800 border-neon-blue"
                      >
                        <CardHeader>
                          <CardTitle className="text-lg text-neon-blue">
                            {sahip.sahip.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-neon-cyan">
                            Sulama Süresi: {formatSure(sahip.toplamSure)}
                          </p>
                          <p className="text-neon-green">
                            Maliyet Payı: {formatPara(sahip.toplamMaliyet)}
                          </p>
                          <p className="text-neon-pink">
                            Tarlalar: {sahip.tarlalar.join(", ")}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-neon-purple">
                <CardHeader>
                  <CardTitle className="text-xl text-neon-purple">
                    Maliyet Dağılımı
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analizSonucu.sahipAnalizi.map((sahip) => ({
                            name: sahip.sahip.name,
                            value: sahip.toplamMaliyet,
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {analizSonucu.sahipAnalizi.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => formatPara(value)}
                          contentStyle={{
                            backgroundColor: "#1a1a1a",
                            borderColor: "#8231B4",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </Layout>
  );
}
