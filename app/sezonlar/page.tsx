"use client";

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
import { PlusCircle, Pencil } from "lucide-react";
import { format } from "date-fns";
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { cn } from "@/lib/utils"

interface Sezon {
  _id: string;
  ad: string;
  baslangic_tarihi: string;
  bitis_tarihi: string;
}

export default function SezonlarPage() {
  const [sezonlar, setSezonlar] = useState<Sezon[]>([]);
  const [yeniSezon, setYeniSezon] = useState({
    ad: "",
    baslangic_tarihi: new Date(),
    bitis_tarihi: new Date(),
  });
  const [editingSezon, setEditingSezon] = useState<Sezon | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchSezonlar();
  }, [session, status, router]);

  const fetchSezonlar = async () => {
    try {
      const response = await fetch("/api/sezonlar");
      if (!response.ok) throw new Error("Sezonları getirme hatası");
      const data = await response.json();
      setSezonlar(data);
    } catch (error) {
      console.error("Sezonları getirme hatası:", error);
    }
  };

  const handleAddSezon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/sezonlar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(yeniSezon),
      });
      if (!response.ok) throw new Error("Sezon ekleme hatası");
      fetchSezonlar();
      setYeniSezon({
        ad: "",
        baslangic_tarihi: new Date(),
        bitis_tarihi: new Date(),
      });
    } catch (error) {
      console.error("Sezon ekleme hatası:", error);
    }
  };

  const handleEditSezon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSezon) return;
    try {
      const response = await fetch(`/api/sezonlar/${editingSezon._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSezon),
      });
      if (!response.ok) throw new Error("Sezon güncelleme hatası");
      fetchSezonlar();
      setEditingSezon(null);
    } catch (error) {
      console.error("Sezon güncelleme hatası:", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-pink title-glow">
          Sezon Yönetimi
        </h1>

        <div className="flex justify-end mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-neon-purple hover:bg-neon-pink text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Yeni Sezon Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-2 border-neon-blue">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-neon-blue">
                  Yeni Sezon Ekle
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSezon}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ad" className="text-right text-neon-green">
                      Ad
                    </Label>
                    <Input
                      id="ad"
                      value={yeniSezon.ad}
                      onChange={(e) =>
                        setYeniSezon({ ...yeniSezon, ad: e.target.value })
                      }
                      className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="baslangic_tarihi"
                      className="text-right text-neon-green"
                    >
                      Başlangıç Tarihi
                    </Label>
                    <Input
                      id="baslangic_tarihi"
                      type="date"
                      value={format(yeniSezon.baslangic_tarihi, "yyyy-MM-dd")}
                      onChange={(e) =>
                        setYeniSezon({
                          ...yeniSezon,
                          baslangic_tarihi: new Date(e.target.value),
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-green"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="bitis_tarihi"
                      className="text-right text-neon-green"
                    >
                      Bitiş Tarihi
                    </Label>
                    <Input
                      id="bitis_tarihi"
                      type="date"
                      value={format(yeniSezon.bitis_tarihi, "yyyy-MM-dd")}
                      onChange={(e) =>
                        setYeniSezon({
                          ...yeniSezon,
                          bitis_tarihi: new Date(e.target.value),
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-green"
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
          {sezonlar.map((sezon) => (
            <Card
              key={sezon._id}
              className="bg-gray-800 border-2 border-neon-blue shadow-lg hover:shadow-neon-blue transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-neon-pink">{sezon.ad}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-neon-blue">
                  Başlangıç:{" "}
                  <span className="text-neon-green">
                    {format(new Date(sezon.baslangic_tarihi), "dd.MM.yyyy")}
                  </span>
                </p>
                <p className="text-neon-blue">
                  Bitiş:{" "}
                  <span className="text-neon-green">
                    {format(new Date(sezon.bitis_tarihi), "dd.MM.yyyy")}
                  </span>
                </p>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-neon-cyan hover:bg-neon-blue text-black"
                      onClick={() => setEditingSezon(sezon)}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Düzenle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-2 border-neon-blue">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-neon-blue">
                        Sezon Düzenle
                      </DialogTitle>
                    </DialogHeader>
                    {editingSezon && (
                      <form onSubmit={handleEditSezon}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-ad"
                              className="text-right text-neon-green"
                            >
                              Ad
                            </Label>
                            <Input
                              id="edit-ad"
                              value={editingSezon.ad}
                              onChange={(e) =>
                                setEditingSezon({
                                  ...editingSezon,
                                  ad: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-baslangic_tarihi"
                              className="text-right text-neon-green"
                            >
                              Başlangıç Tarihi
                            </Label>
                            <Input
                              id="edit-baslangic_tarihi"
                              type="date"
                              value={format(
                                new Date(editingSezon.baslangic_tarihi),
                                "yyyy-MM-dd"
                              )}
                              onChange={(e) =>
                                setEditingSezon({
                                  ...editingSezon,
                                  baslangic_tarihi: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-green"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-bitis_tarihi"
                              className="text-right text-neon-green"
                            >
                              Bitiş Tarihi
                            </Label>
                            <Input
                              id="edit-bitis_tarihi"
                              type="date"
                              value={format(
                                new Date(editingSezon.bitis_tarihi),
                                "yyyy-MM-dd"
                              )}
                              onChange={(e) =>
                                setEditingSezon({
                                  ...editingSezon,
                                  bitis_tarihi: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-green"
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
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
