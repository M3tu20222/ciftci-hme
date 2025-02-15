"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
import { PlusCircle, Trash2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Kategori {
  _id: string;
  ad: string;
  ust_kategori_id: string | null;
  altKategoriler?: Kategori[];
}

interface Sahip {
  _id: string;
  name: string;
}

interface Sahiplik {
  sahip_id: string;
  yuzde: number;
}

interface Envanter {
  _id: string;
  ad: string;
  kategori_id: {
    _id: string;
    ad: string;
  };
  miktar: number;
  birim: string;
  deger: number;
  sahiplikler: Array<{
    sahip_id: {
      _id: string;
      name: string;
    };
    yuzde: number;
  }>;
}

export default function EnvanterYonetimiPage() {
  const [envanterler, setEnvanterler] = useState<Envanter[]>([]);
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [sahipler, setSahipler] = useState<Sahip[]>([]);
  const [yeniEnvanter, setYeniEnvanter] = useState<Partial<Envanter>>({
    ad: "",
    kategori_id: { _id: "", ad: "" },
    miktar: 0,
    birim: "",
    deger: 0,
    sahiplikler: [],
  });
  const [editingEnvanter, setEditingEnvanter] = useState<Envanter | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const fetchEnvanterler = useCallback(async () => {
    try {
      const response = await fetch("/api/envanter");
      if (!response.ok) throw new Error("Envanterleri getirme hatası");
      const data = await response.json();
      console.log("Fetched envanterler:", data);
      setEnvanterler(data);
    } catch (error) {
      console.error("Envanterleri getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Envanterleri getirirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  }, [toast]);

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
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Kullanıcıları getirme hatası");
      const data = await response.json();
      setSahipler(data);
    } catch (error) {
      console.error("Kullanıcıları getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Kullanıcıları getirirken bir hata oluştu.",
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
    fetchEnvanterler();
    fetchKategoriler();
    fetchSahipler();
  }, [
    session,
    status,
    router,
    fetchEnvanterler,
    fetchKategoriler,
    fetchSahipler,
  ]);

  const handleAddEnvanter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/envanter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(yeniEnvanter),
      });
      if (!response.ok) throw new Error("Envanter ekleme hatası");
      await fetchEnvanterler();
      setYeniEnvanter({
        ad: "",
        kategori_id: { _id: "", ad: "" },
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

  const handleEditEnvanter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEnvanter) return;
    try {
      const response = await fetch(`/api/envanter/${editingEnvanter._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingEnvanter),
      });
      if (!response.ok) throw new Error("Envanter güncelleme hatası");
      await fetchEnvanterler();
      setEditingEnvanter(null);
      toast({
        title: "Başarılı",
        description: "Envanter başarıyla güncellendi.",
      });
    } catch (error) {
      console.error("Envanter güncelleme hatası:", error);
      toast({
        title: "Hata",
        description: "Envanter güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEnvanter = async (id: string) => {
    if (!confirm("Bu envanteri silmek istediğinizden emin misiniz?")) return;
    try {
      const response = await fetch(`/api/envanter/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Envanter silme hatası");
      await fetchEnvanterler();
      toast({
        title: "Başarılı",
        description: "Envanter başarıyla silindi.",
      });
    } catch (error) {
      console.error("Envanter silme hatası:", error);
      toast({
        title: "Hata",
        description: "Envanter silinirken bir hata oluştu.",
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

  const handleAddSahiplik = (envanter: Partial<Envanter>) => {
    const updatedEnvanter = { ...envanter };
    updatedEnvanter.sahiplikler = [
      ...(updatedEnvanter.sahiplikler || []),
      { sahip_id: { _id: "", name: "" }, yuzde: 0 },
    ];
    if (envanter === yeniEnvanter) {
      setYeniEnvanter(updatedEnvanter);
    } else if (editingEnvanter) {
      setEditingEnvanter(updatedEnvanter as Envanter);
    }
  };

  const handleRemoveSahiplik = (index: number, envanter: Partial<Envanter>) => {
    const updatedEnvanter = { ...envanter };
    updatedEnvanter.sahiplikler =
      updatedEnvanter.sahiplikler?.filter((_, i) => i !== index) || [];
    if (envanter === yeniEnvanter) {
      setYeniEnvanter(updatedEnvanter);
    } else if (editingEnvanter) {
      setEditingEnvanter(updatedEnvanter as Envanter);
    }
  };

  const handleSahiplikChange = (
    index: number,
    field: keyof Sahiplik,
    value: string | number,
    envanter: Partial<Envanter>
  ) => {
    const updatedEnvanter = { ...envanter };
    updatedEnvanter.sahiplikler =
      updatedEnvanter.sahiplikler?.map((sahiplik, i) =>
        i === index ? { ...sahiplik, [field]: value } : sahiplik
      ) || [];
    if (envanter === yeniEnvanter) {
      setYeniEnvanter(updatedEnvanter);
    } else if (editingEnvanter) {
      setEditingEnvanter(updatedEnvanter as Envanter);
    }
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
                  value={yeniEnvanter.kategori_id?._id}
                  onValueChange={(value) =>
                    setYeniEnvanter({
                      ...yeniEnvanter,
                      kategori_id: {
                        _id: value,
                        ad: kategoriler.find((k) => k._id === value)?.ad || "",
                      },
                    })
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
                  <div key={index} className="flex items-center space-x-2 ">
                    <Select
                      value={sahiplik.sahip_id?._id}
                      onValueChange={(value) =>
                        handleSahiplikChange(
                          index,
                          "sahip_id",
                          value,
                          yeniEnvanter
                        )
                      }
                    >
                      <SelectTrigger className="bg-gray-700 text-neon-pink border-neon-blue">
                        <SelectValue placeholder="Sahip seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {sahipler.map((sahip) => (
                          <SelectItem
                            key={sahip._id}
                            className="bg-gray-700 text-neon-yellow border-neon-blue"
                            value={sahip._id}
                          >
                            {sahip.name}
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
                          Number(e.target.value),
                          yeniEnvanter
                        )
                      }
                      className="bg-gray-700 text-neon-pink border-neon-blue w-24"
                      placeholder="Yüzde (%)"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveSahiplik(index, yeniEnvanter)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddSahiplik(yeniEnvanter)}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {envanterler.map((envanter) => (
            <Card
              key={envanter._id}
              className="bg-gray-800 border-2 border-neon-purple"
            >
              <CardHeader>
                <CardTitle className="text-neon-pink">{envanter.ad}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neon-blue">
                  Kategori: {envanter.kategori_id.ad || "Bilinmeyen Kategori"}
                </p>
                <p className="text-neon-blue">
                  Miktar: {envanter.miktar} {envanter.birim}
                </p>
                <p className="text-neon-blue">Değer: {envanter.deger} TL</p>
                {envanter.sahiplikler && envanter.sahiplikler.length > 0 && (
                  <div className="mt-2">
                    <p className="text-neon-blue">Sahiplikler:</p>
                    <ul className="list-disc list-inside">
                      {envanter.sahiplikler.map((sahiplik, index) => (
                        <li key={index} className="text-neon-pink">
                          {sahiplik.sahip_id.name || "Bilinmeyen Sahip"} (
                          {sahiplik.yuzde}%)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-neon-cyan hover:bg-neon-blue text-black"
                      onClick={() => setEditingEnvanter(envanter)}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Düzenle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-2 border-neon-purple">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-neon-purple">
                        Envanter Düzenle
                      </DialogTitle>
                    </DialogHeader>
                    {editingEnvanter && (
                      <form onSubmit={handleEditEnvanter}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-ad"
                              className="text-right text-neon-blue"
                            >
                              Ad
                            </Label>
                            <Input
                              id="edit-ad"
                              value={editingEnvanter.ad}
                              onChange={(e) =>
                                setEditingEnvanter({
                                  ...editingEnvanter,
                                  ad: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-kategori"
                              className="text-right text-neon-blue"
                            >
                              Kategori
                            </Label>
                            <Select
                              value={editingEnvanter.kategori_id._id}
                              onValueChange={(value) =>
                                setEditingEnvanter({
                                  ...editingEnvanter,
                                  kategori_id: {
                                    _id: value,
                                    ad:
                                      kategoriler.find((k) => k._id === value)
                                        ?.ad || "",
                                  },
                                })
                              }
                            >
                              <SelectTrigger className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue">
                                <SelectValue placeholder="Kategori seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                {renderKategoriOptions(kategoriler)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-miktar"
                              className="text-right text-neon-blue"
                            >
                              Miktar
                            </Label>
                            <Input
                              id="edit-miktar"
                              type="number"
                              value={editingEnvanter.miktar}
                              onChange={(e) =>
                                setEditingEnvanter({
                                  ...editingEnvanter,
                                  miktar: Number(e.target.value),
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-birim"
                              className="text-right text-neon-blue"
                            >
                              Birim
                            </Label>
                            <Input
                              id="edit-birim"
                              value={editingEnvanter.birim}
                              onChange={(e) =>
                                setEditingEnvanter({
                                  ...editingEnvanter,
                                  birim: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-deger"
                              className="text-right text-neon-blue"
                            >
                              Değer
                            </Label>
                            <Input
                              id="edit-deger"
                              type="number"
                              value={editingEnvanter.deger}
                              onChange={(e) =>
                                setEditingEnvanter({
                                  ...editingEnvanter,
                                  deger: Number(e.target.value),
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-neon-blue">
                              Sahiplikler
                            </Label>
                            {editingEnvanter.sahiplikler?.map(
                              (sahiplik, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2"
                                >
                                  <Select
                                    value={sahiplik.sahip_id._id}
                                    onValueChange={(value) =>
                                      handleSahiplikChange(
                                        index,
                                        "sahip_id",
                                        value,
                                        editingEnvanter
                                      )
                                    }
                                  >
                                    <SelectTrigger className="bg-gray-700 text-neon-pink border-neon-blue">
                                      <SelectValue placeholder="Sahip seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {sahipler.map((sahip) => (
                                        <SelectItem
                                          key={sahip._id}
                                          value={sahip._id}
                                          className="bg-gray-700 text-neon-green border-neon-blue"
                                        >
                                          {sahip.name}
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
                                        Number(e.target.value),
                                        editingEnvanter
                                      )
                                    }
                                    className="bg-gray-700 text-neon-pink border-neon-blue w-24"
                                    placeholder="Yüzde (%)"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() =>
                                      handleRemoveSahiplik(
                                        index,
                                        editingEnvanter
                                      )
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )
                            )}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleAddSahiplik(editingEnvanter)}
                              className="mt-2"
                            >
                              <PlusCircle className="mr-2 h-4 w-4" /> Sahiplik
                              Ekle
                            </Button>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            type="submit"
                            className="bg-neon-green hover:bg-neon-blue text-green"
                          >
                            Güncelle
                          </Button>
                        </DialogFooter>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
                <Button
                  className="bg-neon-red hover:bg-neon-pink text-white"
                  onClick={() => handleDeleteEnvanter(envanter._id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Sil
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <Toaster />
    </Layout>
  );
}
