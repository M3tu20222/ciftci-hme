"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { PlusCircle, Trash2 } from "lucide-react";

interface Kategori {
  _id: string;
  ad: string;
  ust_kategori_id: string | null;
  altKategoriler?: Kategori[];
}

interface Sahip {
  _id: string;
  ad: string;
  tip: string;
}

interface Sahiplik {
  sahip_id: string;
  yuzde: number;
}

interface Envanter {
  _id: string;
  ad: string;
  kategori_id: string;
  miktar: number;
  birim: string;
  deger: number;
  sahiplikler: Sahiplik[];
}

export default function EnvanterYonetimiPage() {
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [sahipler, setSahipler] = useState<Sahip[]>([]);
  const [yeniEnvanter, setYeniEnvanter] = useState<Partial<Envanter>>({
    ad: "",
    kategori_id: "",
    miktar: 0,
    birim: "",
    deger: 0,
    sahiplikler: [],
  });
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const fetchKategoriler = useCallback(async () => {
    try {
      const response = await fetch("/api/kategoriler");
      if (!response.ok) throw new Error("Kategorileri getirme hatası");
      const data = await response.json();
      setKategoriler(data);
    } catch (error) {
      console.error("Kategorileri getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Kategorileri getirirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchSahipler = useCallback(async () => {
    try {
      const response = await fetch("/api/sahipler");
      if (!response.ok) throw new Error("Sahipleri getirme hatası");
      const data = await response.json();
      setSahipler(data);
    } catch (error) {
      console.error("Sahipleri getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Sahipleri getirirken bir hata oluştu.",
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
    fetchKategoriler();
    fetchSahipler();
  }, [session, status, router, fetchKategoriler, fetchSahipler]);

  const handleAddEnvanter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/envanter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(yeniEnvanter),
      });
      if (!response.ok) throw new Error("Envanter ekleme hatası");
      setYeniEnvanter({
        ad: "",
        kategori_id: "",
        miktar: 0,
        birim: "",
        deger: 0,
        sahiplikler: [],
      });
      toast({
        title: "Başarılı",
        description: "Yeni envanter başarıyla eklendi.",
      });
    } catch (error) {
      console.error("Envanter ekleme hatası:", error);
      toast({
        title: "Hata",
        description: "Envanter eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const renderKategoriOptions = (
    kategoriler: Kategori[],
    depth = 0
  ): React.ReactNode[] => {
    return kategoriler.flatMap((kategori) => [
      <SelectItem key={kategori._id} value={kategori._id}>
        {"\u00A0".repeat(depth * 2)}
        {kategori.ad}
      </SelectItem>,
      ...(kategori.altKategoriler
        ? renderKategoriOptions(kategori.altKategoriler, depth + 1)
        : []),
    ]);
  };

  const handleAddSahiplik = () => {
    setYeniEnvanter((prev) => ({
      ...prev,
      sahiplikler: [...(prev.sahiplikler || []), { sahip_id: "", yuzde: 0 }],
    }));
  };

  const handleRemoveSahiplik = (index: number) => {
    setYeniEnvanter((prev) => ({
      ...prev,
      sahiplikler: prev.sahiplikler?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSahiplikChange = (
    index: number,
    field: keyof Sahiplik,
    value: string | number
  ) => {
    setYeniEnvanter((prev) => ({
      ...prev,
      sahiplikler:
        prev.sahiplikler?.map((sahiplik, i) =>
          i === index ? { ...sahiplik, [field]: value } : sahiplik
        ) || [],
    }));
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-green title-glow">
          Envanter Yönetimi
        </h1>

        <Card className="bg-gray-800 border-2 border-neon-blue">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-neon-pink">
              Yeni Envanter Ekle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddEnvanter} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ad" className="text-neon-blue">
                  Envanter Adı
                </Label>
                <Input
                  id="ad"
                  value={yeniEnvanter.ad}
                  onChange={(e) =>
                    setYeniEnvanter({ ...yeniEnvanter, ad: e.target.value })
                  }
                  className="bg-gray-700 text-neon-pink border-neon-blue"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kategori" className="text-neon-blue">
                  Kategori
                </Label>
                <Select
                  value={yeniEnvanter.kategori_id}
                  onValueChange={(value) =>
                    setYeniEnvanter({ ...yeniEnvanter, kategori_id: value })
                  }
                >
                  <SelectTrigger className="bg-gray-700 text-neon-pink border-neon-blue">
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {renderKategoriOptions(kategoriler)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="miktar" className="text-neon-blue">
                  Miktar
                </Label>
                <Input
                  id="miktar"
                  type="number"
                  value={yeniEnvanter.miktar}
                  onChange={(e) =>
                    setYeniEnvanter({
                      ...yeniEnvanter,
                      miktar: Number(e.target.value),
                    })
                  }
                  className="bg-gray-700 text-neon-pink border-neon-blue"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birim" className="text-neon-blue">
                  Birim
                </Label>
                <Input
                  id="birim"
                  value={yeniEnvanter.birim}
                  onChange={(e) =>
                    setYeniEnvanter({ ...yeniEnvanter, birim: e.target.value })
                  }
                  className="bg-gray-700 text-neon-pink border-neon-blue"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deger" className="text-neon-blue">
                  Değer
                </Label>
                <Input
                  id="deger"
                  type="number"
                  value={yeniEnvanter.deger}
                  onChange={(e) =>
                    setYeniEnvanter({
                      ...yeniEnvanter,
                      deger: Number(e.target.value),
                    })
                  }
                  className="bg-gray-700 text-neon-pink border-neon-blue"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-neon-blue">Sahiplikler</Label>
                {yeniEnvanter.sahiplikler?.map((sahiplik, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Select
                      value={sahiplik.sahip_id}
                      onValueChange={(value) =>
                        handleSahiplikChange(index, "sahip_id", value)
                      }
                    >
                      <SelectTrigger className="bg-gray-700 text-neon-pink border-neon-blue">
                        <SelectValue placeholder="Sahip seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {sahipler.map((sahip) => (
                          <SelectItem key={sahip._id} value={sahip._id}>
                            {sahip.ad}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      value={sahiplik.yuzde}
                      onChange={(e) =>
                        handleSahiplikChange(
                          index,
                          "yuzde",
                          Number(e.target.value)
                        )
                      }
                      className="bg-gray-700 text-neon-pink border-neon-blue w-24"
                      placeholder="Yüzde (%)"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveSahiplik(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddSahiplik}
                  className="mt-2"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Sahiplik Ekle
                </Button>
              </div>
              <Button
                type="submit"
                className="w-full bg-neon-green hover:bg-neon-blue text-black"
              >
                Envanter Ekle
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </Layout>
  );
}
