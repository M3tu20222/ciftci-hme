"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Pencil, Trash2, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface Kategori {
  _id: string;
  ad: string;
  ust_kategori_id: string | null;
  altKategoriler?: Kategori[];
}

export default function KategoriYonetimiPage() {
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [yeniKategori, setYeniKategori] = useState<Partial<Kategori>>({
    ad: "",
    ust_kategori_id: null,
  });
  const [editingKategori, setEditingKategori] = useState<Kategori | null>(null);
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

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchKategoriler();
  }, [session, status, router, fetchKategoriler]);

  const handleAddKategori = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const kategoriData = { ...yeniKategori };
      if (kategoriData.ust_kategori_id === "0") {
        kategoriData.ust_kategori_id = null;
      }
      const response = await fetch("/api/kategoriler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kategoriData),
      });
      if (!response.ok) throw new Error("Kategori ekleme hatası");
      await fetchKategoriler();
      setYeniKategori({ ad: "", ust_kategori_id: null });
      toast({
        title: "Başarılı",
        description: "Yeni kategori başarıyla eklendi.",
      });
    } catch (error) {
      console.error("Kategori ekleme hatası:", error);
      toast({
        title: "Hata",
        description: "Kategori eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleEditKategori = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKategori) return;
    try {
      const kategoriData = { ...editingKategori };
      if (kategoriData.ust_kategori_id === "0") {
        kategoriData.ust_kategori_id = null;
      }
      const response = await fetch(`/api/kategoriler/${editingKategori._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kategoriData),
      });
      if (!response.ok) throw new Error("Kategori güncelleme hatası");
      await fetchKategoriler();
      setEditingKategori(null);
      toast({
        title: "Başarılı",
        description: "Kategori başarıyla güncellendi.",
      });
    } catch (error) {
      console.error("Kategori güncelleme hatası:", error);
      toast({
        title: "Hata",
        description: "Kategori güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteKategori = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) return;
    try {
      const response = await fetch(`/api/kategoriler/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Kategori silme hatası");
      await fetchKategoriler();
      toast({
        title: "Başarılı",
        description: "Kategori başarıyla silindi.",
      });
    } catch (error) {
      console.error("Kategori silme hatası:", error);
      toast({
        title: "Hata",
        description: "Kategori silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const renderKategori = (kategori: Kategori, depth = 0) => (
    <Card
      key={kategori._id}
      className={`bg-gray-800 border-2 border-neon-green shadow-lg hover:shadow-neon-green transition-shadow duration-300 mb-2`}
    >
      <CardHeader>
        <CardTitle className="text-neon-pink flex items-center">
          {depth > 0 && <ChevronRight className="mr-2" />}
          {kategori.ad}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-neon-blue">
          Üst Kategori:{" "}
          <span className="text-neon-pink">
            {kategori.ust_kategori_id
              ? findKategoriById(kategori.ust_kategori_id)?.ad || "Bulunamadı"
              : "Ana Kategori"}
          </span>
        </p>
      </CardContent>
      <CardFooter className="space-x-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="bg-neon-cyan hover:bg-neon-blue text-black"
              onClick={() => setEditingKategori(kategori)}
            >
              <Pencil className="mr-2 h-4 w-4" /> Düzenle
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-2 border-neon-green">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-neon-green">
                Kategori Düzenle
              </DialogTitle>
            </DialogHeader>
            {editingKategori && (
              <form onSubmit={handleEditKategori}>
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
                      value={editingKategori.ad}
                      onChange={(e) =>
                        setEditingKategori({
                          ...editingKategori,
                          ad: e.target.value,
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="edit-ust_kategori"
                      className="text-right text-neon-blue"
                    >
                      Üst Kategori
                    </Label>
                    <Select
                      value={editingKategori.ust_kategori_id || ""}
                      onValueChange={(value) =>
                        setEditingKategori({
                          ...editingKategori,
                          ust_kategori_id: value || null,
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3 bg-gray-800 text-neon-green border-neon-green">
                        <SelectValue placeholder="Üst kategori seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Ana Kategori</SelectItem>
                        {kategoriler
                          .filter((k) => k._id !== editingKategori._id)
                          .map((kategori) => (
                            <SelectItem key={kategori._id} value={kategori._id}>
                              {kategori.ad}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-neon-green hover:bg-neon-blue text-black"
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
          onClick={() => handleDeleteKategori(kategori._id)}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Sil
        </Button>
      </CardFooter>
      {kategori.altKategoriler && kategori.altKategoriler.length > 0 && (
        <div className="ml-4">
          {kategori.altKategoriler.map((altKategori) =>
            renderKategori(altKategori, depth + 1)
          )}
        </div>
      )}
    </Card>
  );

  const findKategoriById = (id: string): Kategori | undefined => {
    const findInList = (list: Kategori[]): Kategori | undefined => {
      for (const kategori of list) {
        if (kategori._id === id) return kategori;
        if (kategori.altKategoriler) {
          const found = findInList(kategori.altKategoriler);
          if (found) return found;
        }
      }
      return undefined;
    };
    return findInList(kategoriler);
  };

  const flattenKategoriler = (kategoriler: Kategori[]): Kategori[] => {
    return kategoriler.reduce((acc, kategori) => {
      acc.push(kategori);
      if (kategori.altKategoriler) {
        acc.push(...flattenKategoriler(kategori.altKategoriler));
      }
      return acc;
    }, [] as Kategori[]);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-green title-glow">
          Kategori Yönetimi
        </h1>

        <Card className="bg-gray-800 border-2 border-neon-blue">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-neon-pink">
              Yeni Kategori Ekle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddKategori} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ad" className="text-neon-blue">
                  Kategori Adı
                </Label>
                <Input
                  id="ad"
                  value={yeniKategori.ad}
                  onChange={(e) =>
                    setYeniKategori({ ...yeniKategori, ad: e.target.value })
                  }
                  className="bg-gray-700 text-neon-pink border-neon-blue"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ust_kategori" className="text-neon-blue">
                  Üst Kategori
                </Label>
                <Select
                  value={yeniKategori.ust_kategori_id || ""}
                  onValueChange={(value) =>
                    setYeniKategori({
                      ...yeniKategori,
                      ust_kategori_id: value || null,
                    })
                  }
                >
                  <SelectTrigger className="bg-gray-700 text-neon-pink border-neon-blue">
                    <SelectValue placeholder="Üst kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Ana Kategori</SelectItem>
                    {kategoriler.map((kategori) => (
                      <SelectItem key={kategori._id} value={kategori._id}>
                        {kategori.ad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full bg-neon-green hover:bg-neon-blue text-black"
              >
                Kategori Ekle
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {kategoriler.map((kategori) => renderKategori(kategori))}
        </div>
      </div>
      <Toaster />
    </Layout>
  );
}
