"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface Kategori {
  _id: string;
  ad: string;
  ust_kategori_id: string | null;
  altKategoriler?: Kategori[];
}

interface Sahip {
  sahip: {
    _id: string;
    name: string;
  };
  oran: number;
}

interface EnvanterItem {
  _id: string;
  ad: string;
  kategori_id: Kategori;
  miktar: number;
  birim: string;
  deger: number;
  sahipler: Sahip[];
}

export default function EnvanterPage() {
  const [envanterler, setEnvanterler] = useState<EnvanterItem[]>([]);
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [selectedKategori, setSelectedKategori] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchEnvanterler();
    fetchKategoriler();
  }, [session, status, router]);

  const fetchEnvanterler = async () => {
    try {
      const response = await fetch("/api/envanter");
      if (!response.ok) throw new Error("Envanterleri getirme hatası");
      const data = await response.json();
      setEnvanterler(data);
    } catch (error) {
      console.error("Envanterleri getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Envanterleri getirirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const fetchKategoriler = async () => {
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

  const filteredEnvanterler = selectedKategori
    ? envanterler.filter((item) => item.kategori_id._id === selectedKategori)
    : envanterler;

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-green title-glow">
          Envanter Listesi
        </h1>

        <div className="mb-4">
          <Select
            value={selectedKategori || " "}
            onValueChange={(value) => setSelectedKategori(value)}
          >
            <SelectTrigger className="bg-gray-700 text-neon-pink border-neon-blue">
              <SelectValue placeholder="Kategori seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Kategoriler</SelectItem>
              {renderKategoriOptions(kategoriler)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEnvanterler.map((item) => (
            <Card
              key={item._id}
              className="bg-gray-800 border-2 border-neon-green"
            >
              <CardHeader>
                <CardTitle className="text-neon-pink">{item.ad}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neon-blue">
                  Kategori: {item.kategori_id.ad}
                </p>
                <p className="text-neon-blue">
                  Miktar: {item.miktar} {item.birim}
                </p>
                <p className="text-neon-blue">Değer: {item.deger} TL</p>
                {item.sahipler && item.sahipler.length > 0 && (
                  <div className="mt-2">
                    <p className="text-neon-blue">Sahipler:</p>
                    <ul className="list-disc list-inside">
                      {item.sahipler.map((sahip, index) => (
                        <li
                          key={`${item._id}-${sahip.sahip._id}-${index}`}
                          className="text-neon-pink"
                        >
                          {sahip.sahip.name} ({sahip.oran}%)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Toaster />
    </Layout>
  );
}
