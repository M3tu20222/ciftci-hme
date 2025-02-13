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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Pencil, FileText } from "lucide-react";

interface Kuyu {
  _id: string;
  ad: string;
}

interface KuyuFatura {
  _id: string;
  kuyu_id: Kuyu;
  baslangic_tarihi: string;
  bitis_tarihi: string;
  tutar: number;
  odendi: boolean;
}

export default function KuyuFaturalarPage() {
  const [kuyuFaturalar, setKuyuFaturalar] = useState<KuyuFatura[]>([]);
  const [kuyular, setKuyular] = useState<Kuyu[]>([]);
  const [yeniFatura, setYeniFatura] = useState<Partial<KuyuFatura>>({});
  const [editingFatura, setEditingFatura] = useState<KuyuFatura | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchKuyuFaturalar();
    fetchKuyular();
  }, [session, status, router]);

  const fetchKuyuFaturalar = async () => {
    try {
      const response = await fetch("/api/kuyu-faturalar");
      if (!response.ok) throw new Error("Kuyu faturalarını getirme hatası");
      const data = await response.json();
      setKuyuFaturalar(data);
    } catch (error) {
      console.error("Kuyu faturalarını getirme hatası:", error);
    }
  };

  const fetchKuyular = async () => {
    try {
      const response = await fetch("/api/kuyular");
      if (!response.ok) throw new Error("Kuyuları getirme hatası");
      const data = await response.json();
      setKuyular(data);
    } catch (error) {
      console.error("Kuyuları getirme hatası:", error);
    }
  };

  const handleAddFatura = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/kuyu-faturalar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(yeniFatura),
      });
      if (!response.ok) throw new Error("Kuyu faturası ekleme hatası");
      fetchKuyuFaturalar();
      setYeniFatura({});
    } catch (error) {
      console.error("Kuyu faturası ekleme hatası:", error);
    }
  };

  const handleEditFatura = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFatura) return;
    try {
      const response = await fetch(`/api/kuyu-faturalar/${editingFatura._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingFatura),
      });
      if (!response.ok) throw new Error("Kuyu faturası güncelleme hatası");
      fetchKuyuFaturalar();
      setEditingFatura(null);
    } catch (error) {
      console.error("Kuyu faturası güncelleme hatası:", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-blue title-glow">
          Kuyu Fatura Yönetimi
        </h1>

        <div className="flex justify-end mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-neon-green hover:bg-neon-blue text-black">
                <PlusCircle className="mr-2 h-4 w-4" /> Yeni Fatura Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-2 border-neon-green">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-neon-green">
                  Yeni Kuyu Faturası Ekle
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddFatura}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="kuyu" className="text-right text-neon-blue">
                      Kuyu
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setYeniFatura({ ...yeniFatura, kuyu_id: value })
                      }
                      value={yeniFatura.kuyu_id as string}
                    >
                      <SelectTrigger className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue">
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="baslangic_tarihi"
                      className="text-right text-neon-blue"
                    >
                      Başlangıç Tarihi
                    </Label>
                    <Input
                      id="baslangic_tarihi"
                      type="date"
                      value={yeniFatura.baslangic_tarihi || ""}
                      onChange={(e) =>
                        setYeniFatura({
                          ...yeniFatura,
                          baslangic_tarihi: e.target.value,
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="bitis_tarihi"
                      className="text-right text-neon-blue"
                    >
                      Bitiş Tarihi
                    </Label>
                    <Input
                      id="bitis_tarihi"
                      type="date"
                      value={yeniFatura.bitis_tarihi || ""}
                      onChange={(e) =>
                        setYeniFatura({
                          ...yeniFatura,
                          bitis_tarihi: e.target.value,
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="tutar"
                      className="text-right text-neon-blue"
                    >
                      Tutar
                    </Label>
                    <Input
                      id="tutar"
                      type="number"
                      value={yeniFatura.tutar || ""}
                      onChange={(e) =>
                        setYeniFatura({
                          ...yeniFatura,
                          tutar: Number(e.target.value),
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="odendi"
                      className="text-right text-neon-blue"
                    >
                      Ödendi
                    </Label>
                    <Checkbox
                      id="odendi"
                      checked={yeniFatura.odendi || false}
                      onCheckedChange={(checked) =>
                        setYeniFatura({
                          ...yeniFatura,
                          odendi: checked as boolean,
                        })
                      }
                      className="col-span-3"
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
          {kuyuFaturalar.map((fatura) => (
            <Card
              key={fatura._id}
              className="bg-gray-800 border-2 border-neon-blue shadow-lg hover:shadow-neon-blue transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-neon-blue flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-neon-blue" />
                  {fatura.kuyu_id.ad}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neon-green">
                  Başlangıç:{" "}
                  <span className="text-neon-pink">
                    {new Date(fatura.baslangic_tarihi).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-neon-green">
                  Bitiş:{" "}
                  <span className="text-neon-pink">
                    {new Date(fatura.bitis_tarihi).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-neon-green">
                  Tutar:{" "}
                  <span className="text-neon-pink">{fatura.tutar} TL</span>
                </p>
                <p className="text-neon-green">
                  Ödendi:{" "}
                  <span className="text-neon-pink">
                    {fatura.odendi ? "Evet" : "Hayır"}
                  </span>
                </p>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-neon-cyan hover:bg-neon-blue text-black"
                      onClick={() => setEditingFatura(fatura)}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Düzenle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-2 border-neon-blue">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-neon-blue">
                        Kuyu Faturası Düzenle
                      </DialogTitle>
                    </DialogHeader>
                    {editingFatura && (
                      <form onSubmit={handleEditFatura}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-kuyu"
                              className="text-right text-neon-green"
                            >
                              Kuyu
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                setEditingFatura({
                                  ...editingFatura,
                                  kuyu_id: {
                                    _id: value,
                                    ad:
                                      kuyular.find((k) => k._id === value)
                                        ?.ad || "",
                                  },
                                })
                              }
                              value={editingFatura.kuyu_id._id}
                            >
                              <SelectTrigger className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue">
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
                              value={editingFatura.baslangic_tarihi}
                              onChange={(e) =>
                                setEditingFatura({
                                  ...editingFatura,
                                  baslangic_tarihi: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
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
                              value={editingFatura.bitis_tarihi}
                              onChange={(e) =>
                                setEditingFatura({
                                  ...editingFatura,
                                  bitis_tarihi: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-tutar"
                              className="text-right text-neon-green"
                            >
                              Tutar
                            </Label>
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
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-odendi"
                              className="text-right text-neon-green"
                            >
                              Ödendi
                            </Label>
                            <Checkbox
                              id="edit-odendi"
                              checked={editingFatura.odendi}
                              onCheckedChange={(checked) =>
                                setEditingFatura({
                                  ...editingFatura,
                                  odendi: checked as boolean,
                                })
                              }
                              className="col-span-3"
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
