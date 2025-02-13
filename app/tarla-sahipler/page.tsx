"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { PlusCircle, Users, X, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface TarlaSahip {
  _id: string;
  tarla_id: {
    _id: string;
    ad: string;
  };
  sahipler: {
    sahip_id: {
      _id: string;
      name: string;
    };
    yuzde: number;
  }[];
}

interface Tarla {
  _id: string;
  ad: string;
}

interface Sahip {
  _id: string;
  name: string;
  role: string;
}

interface OrtakPayi {
  sahip_id: string;
  yuzde: number;
}

export default function TarlaSahiplerPage() {
  const { toast } = useToast();
  const [tarlaSahipler, setTarlaSahipler] = useState<TarlaSahip[]>([]);
  const [tarlalar, setTarlalar] = useState<Tarla[]>([]);
  const [sahipler, setSahipler] = useState<Sahip[]>([]);
  const [secilenTarla, setSecilenTarla] = useState("");
  const [ortakPaylari, setOrtakPaylari] = useState<OrtakPayi[]>([]);
  const [editingTarlaSahip, setEditingTarlaSahip] = useState<TarlaSahip | null>(
    null
  );
  const { data: session, status } = useSession();
  const router = useRouter();

  const fetchTarlaSahipler = useCallback(async () => {
    try {
      const response = await fetch("/api/tarla-sahipler");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Tarla sahiplerini getirme hatası");
      }
      const data = await response.json();
      console.log("Fetched tarlaSahipler:", data);
      setTarlaSahipler(data);
    } catch (error) {
      console.error("Tarla sahiplerini getirme hatası:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description:
          "Tarla sahiplerini getirirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchTarlaSahipler();
    fetchTarlalar();
    fetchOrtaklar();
  }, [session, status, router, fetchTarlaSahipler]);

  const fetchTarlalar = async () => {
    try {
      const response = await fetch("/api/tarlalar");
      if (!response.ok) throw new Error("Tarlaları getirme hatası");
      const data = await response.json();
      setTarlalar(data);
    } catch (error) {
      console.error("Tarlaları getirme hatası:", error);
    }
  };

  const fetchOrtaklar = async () => {
    try {
      const response = await fetch("/api/users?role=ortak");
      if (!response.ok) throw new Error("Ortakları getirme hatası");
      const data = await response.json();
      setSahipler(data);
    } catch (error) {
      console.error("Ortakları getirme hatası:", error);
    }
  };

  const handleAddOrtakPayi = () => {
    setOrtakPaylari([...ortakPaylari, { sahip_id: "", yuzde: 0 }]);
  };

  const handleRemoveOrtakPayi = (index: number) => {
    setOrtakPaylari(ortakPaylari.filter((_, i) => i !== index));
  };

  const handleOrtakPayiChange = (
    index: number,
    field: keyof OrtakPayi,
    value: string | number
  ) => {
    const yeniPaylar = [...ortakPaylari];
    yeniPaylar[index] = { ...yeniPaylar[index], [field]: value };
    setOrtakPaylari(yeniPaylar);
  };

  const handleAddTarlaSahip = async (e: React.FormEvent) => {
    e.preventDefault();

    const toplamYuzde = ortakPaylari.reduce((sum, pay) => sum + pay.yuzde, 0);
    if (toplamYuzde !== 100) {
      toast({
        variant: "destructive",
        description: "Toplam pay yüzdesi 100 olmalıdır!",
      });
      return;
    }

    try {
      const tarlaSahipData = {
        tarla_id: secilenTarla,
        sahipler: ortakPaylari.map((pay) => ({
          sahip_id: pay.sahip_id,
          yuzde: pay.yuzde,
        })),
      };

      const response = await fetch("/api/tarla-sahipler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarlaSahipData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Tarla sahipleri ekleme hatası");
      }

      toast({ description: "Tarla ortakları başarıyla eklendi" });
      fetchTarlaSahipler();
      setSecilenTarla("");
      setOrtakPaylari([]);
    } catch (error) {
      console.error("Tarla sahipleri ekleme hatası:", error);
      if (error instanceof Error) {
        toast({ variant: "destructive", description: error.message });
      } else {
        toast({
          variant: "destructive",
          description: "Bilinmeyen bir hata oluştu",
        });
      }
    }
  };

  const handleEditTarlaSahip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTarlaSahip) return;
    try {
      const response = await fetch(
        `/api/tarla-sahipler/${editingTarlaSahip._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingTarlaSahip),
        }
      );
      if (!response.ok) throw new Error("Tarla sahibi güncelleme hatası");
      fetchTarlaSahipler();
      setEditingTarlaSahip(null);
    } catch (error) {
      console.error("Tarla sahibi güncelleme hatası:", error);
      if (error instanceof Error) {
        toast({ variant: "destructive", description: error.message });
      } else {
        toast({
          variant: "destructive",
          description: "Bilinmeyen bir hata oluştu",
        });
      }
    }
  };

  const kalanYuzde =
    100 - ortakPaylari.reduce((sum, pay) => sum + pay.yuzde, 0);

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-green title-glow">
          Tarla Sahipleri Yönetimi
        </h1>

        <div className="flex justify-end mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-neon-purple hover:bg-neon-pink text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Yeni Tarla Sahipleri
                Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-2 border-neon-purple backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-neon-purple">
                  Yeni Tarla Sahipleri Ekle
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddTarlaSahip}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="tarla"
                      className="text-right text-neon-blue"
                    >
                      Tarla
                    </Label>
                    <Select onValueChange={setSecilenTarla}>
                      <SelectTrigger className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue">
                        <SelectValue placeholder="Tarla seçin" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-neon-blue backdrop-blur-sm">
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

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-neon-yellow">Ortak Payları</Label>
                      <span className="text-neon-green">
                        Kalan: %{kalanYuzde}
                      </span>
                    </div>

                    {ortakPaylari.map((pay, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-4 items-center"
                      >
                        <div className="col-span-5">
                          <Select
                            value={pay.sahip_id}
                            onValueChange={(value) =>
                              handleOrtakPayiChange(index, "sahip_id", value)
                            }
                          >
                            <SelectTrigger className="bg-gray-800 text-neon-pink border-neon-blue">
                              <SelectValue placeholder="Ortak seçin" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-neon-blue backdrop-blur-sm">
                              {sahipler
                                .filter(
                                  (sahip) =>
                                    !ortakPaylari.some(
                                      (p, i) =>
                                        i !== index && p.sahip_id === sahip._id
                                    )
                                )
                                .map((sahip) => (
                                  <SelectItem
                                    key={sahip._id}
                                    value={sahip._id}
                                    className="text-neon-pink hover:bg-neon-blue hover:text-white"
                                  >
                                    {sahip.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-5">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={pay.yuzde}
                            onChange={(e) =>
                              handleOrtakPayiChange(
                                index,
                                "yuzde",
                                Number(e.target.value)
                              )
                            }
                            className="bg-gray-800 text-neon-pink border-neon-blue"
                            placeholder="Pay yüzdesi"
                          />
                        </div>
                        <div className="col-span-2">
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-neon-red hover:text-neon-pink"
                            onClick={() => handleRemoveOrtakPayi(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mt-2 border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black"
                      onClick={handleAddOrtakPayi}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Ortak Ekle
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-neon-green hover:bg-neon-blue text-black"
                    disabled={
                      !secilenTarla ||
                      ortakPaylari.length === 0 ||
                      kalanYuzde !== 0
                    }
                  >
                    Kaydet
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tarlaSahipler.map((tarlaSahip) => (
            <Card
              key={tarlaSahip._id}
              className="bg-gray-800 border-2 border-neon-purple shadow-lg hover:shadow-neon-purple transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-neon-pink flex items-center">
                  <Users className="mr-2 h-5 w-5 text-neon-purple" />
                  {tarlaSahip.tarla_id.ad}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  {tarlaSahip.sahipler.map((sahip, index) => (
                    <p key={index} className="text-neon-blue">
                      <span className="text-neon-cyan">
                        {sahip.sahip_id.name}:
                      </span>{" "}
                      <span className="text-neon-pink">%{sahip.yuzde}</span>
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Toaster />
      </div>
    </Layout>
  );
}
