"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { PlusCircle, User, Pencil } from "lucide-react";
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
}

export default function TarlaSahiplerPage() {
  const [tarlaSahipler, setTarlaSahipler] = useState<TarlaSahip[]>([]);
  const [tarlalar, setTarlalar] = useState<Tarla[]>([]);
  const [sahipler, setSahipler] = useState<Sahip[]>([]);
  const [yeniTarlaSahip, setYeniTarlaSahip] = useState<Partial<TarlaSahip>>({
    tarla_id: { _id: "", ad: "" },
    sahipler: [],
  });
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const fetchTarlaSahipler = useCallback(async () => {
    try {
      const response = await fetch("/api/tarla-sahipler");
      if (!response.ok) throw new Error("Tarla sahiplerini getirme hatası");
      const data = await response.json();
      setTarlaSahipler(data);
    } catch (error) {
      console.error("Tarla sahiplerini getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Tarla sahiplerini getirirken bir hata oluştu.",
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

  const fetchSahipler = useCallback(async () => {
    try {
      const response = await fetch("/api/users?role=ortak");
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
    fetchTarlaSahipler();
    fetchTarlalar();
    fetchSahipler();
  }, [
    session,
    status,
    router,
    fetchTarlaSahipler,
    fetchTarlalar,
    fetchSahipler,
  ]);

  const handleAddTarlaSahip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/tarla-sahipler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(yeniTarlaSahip),
      });
      if (!response.ok) throw new Error("Tarla sahibi ekleme hatası");
      await fetchTarlaSahipler();
      setYeniTarlaSahip({ tarla_id: { _id: "", ad: "" }, sahipler: [] });
      toast({
        title: "Başarılı",
        description: "Yeni tarla sahibi başarıyla eklendi.",
      });
    } catch (error) {
      console.error("Tarla sahibi ekleme hatası:", error);
      toast({
        title: "Hata",
        description: "Tarla sahibi eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-green title-glow">
          Tarla Sahipleri Yönetimi
        </h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-neon-purple hover:bg-neon-pink text-white">
              <PlusCircle className="mr-2 h-4 w-4" /> Yeni Tarla Sahibi Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-2 border-neon-purple">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-neon-purple">
                Yeni Tarla Sahibi Ekle
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTarlaSahip}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tarla" className="text-right text-neon-blue">
                    Tarla
                  </Label>
                  <Select
                    value={yeniTarlaSahip.tarla_id?._id || ""}
                    onValueChange={(value) =>
                      setYeniTarlaSahip({
                        ...yeniTarlaSahip,
                        tarla_id: {
                          _id: value,
                          ad: tarlalar.find((t) => t._id === value)?.ad || "",
                        },
                      })
                    }
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
                {yeniTarlaSahip.sahipler?.map((sahip, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 items-center gap-4"
                  >
                    <Label
                      htmlFor={`sahip-${index}`}
                      className="text-right text-neon-blue"
                    >
                      Sahip {index + 1}
                    </Label>
                    <Select
                      value={sahip.sahip_id?._id || ""}
                      onValueChange={(value) => {
                        const newSahipler = [
                          ...(yeniTarlaSahip.sahipler || []),
                        ];
                        newSahipler[index] = {
                          ...newSahipler[index],
                          sahip_id: {
                            _id: value,
                            name:
                              sahipler.find((s) => s._id === value)?.name || "",
                          },
                        };
                        setYeniTarlaSahip({
                          ...yeniTarlaSahip,
                          sahipler: newSahipler,
                        });
                      }}
                    >
                      <SelectTrigger className="col-span-2 bg-gray-800 text-neon-pink border-neon-blue">
                        <SelectValue placeholder="Sahip seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {sahipler.map((sahip) => (
                          <SelectItem key={sahip._id} value={sahip._id}>
                            {sahip.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      value={sahip.yuzde || ""}
                      onChange={(e) => {
                        const newSahipler = [
                          ...(yeniTarlaSahip.sahipler || []),
                        ];
                        newSahipler[index] = {
                          ...newSahipler[index],
                          yuzde: Number(e.target.value),
                        };
                        setYeniTarlaSahip({
                          ...yeniTarlaSahip,
                          sahipler: newSahipler,
                        });
                      }}
                      className="bg-gray-800 text-neon-pink border-neon-blue"
                      placeholder="Yüzde"
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() =>
                    setYeniTarlaSahip({
                      ...yeniTarlaSahip,
                      sahipler: [
                        ...(yeniTarlaSahip.sahipler || []),
                        { sahip_id: { _id: "", name: "" }, yuzde: 0 },
                      ],
                    })
                  }
                  className="bg-neon-green hover:bg-neon-blue text-black"
                >
                  Sahip Ekle
                </Button>
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
          {tarlaSahipler.map((tarlaSahip) => (
            <Card
              key={tarlaSahip._id}
              className="bg-gray-800 border-2 border-neon-purple shadow-lg hover:shadow-neon-purple transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-neon-pink flex items-center">
                  <User className="mr-2 h-5 w-5 text-neon-purple" />
                  {tarlaSahip.tarla_id.ad}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tarlaSahip.sahipler.map((sahip, index) => (
                  <p key={index} className="text-neon-blue">
                    {sahip.sahip_id.name}:{" "}
                    <span className="text-neon-green">{sahip.yuzde}%</span>
                  </p>
                ))}
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-neon-cyan hover:bg-neon-blue text-black"
                      onClick={() => {
                        /* Implement edit functionality */
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Düzenle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-2 border-neon-purple">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-neon-purple">
                        Tarla Sahibi Düzenle
                      </DialogTitle>
                    </DialogHeader>
                    {/* Implement edit form here */}
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <Toaster />
    </Layout>
  );
}
