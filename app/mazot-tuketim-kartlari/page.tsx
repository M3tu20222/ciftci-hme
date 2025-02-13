"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
//import { toast } from "react-hot-toast";

interface MazotTuketimKarti {
  _id: string;
  ad: string;
  kategori: string;
  alt_kategori: string;
  dekar_basi_mazot_tuketim: number;
  created_by: number;
}

export default function MazotTuketimKartlariPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mazotTuketimKartlari, setMazotTuketimKartlari] = useState<
    MazotTuketimKarti[]
  >([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<MazotTuketimKarti>>({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session) {
      fetchMazotTuketimKartlari();
    }
  }, [session, status, router]);

  const fetchMazotTuketimKartlari = async () => {
    try {
      const response = await fetch("/api/mazot-tuketim-kartlari");
      if (response.ok) {
        const data = await response.json();
        setMazotTuketimKartlari(data);
      } else {
        toast.error("Mazot tüketim kartları yüklenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error(
        "Mazot tüketim kartları yüklenirken bir hata oluştu:",
        error
      );
      toast.error("Mazot tüketim kartları yüklenirken bir hata oluştu.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/mazot-tuketim-kartlari", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, created_by: session?.user?.id }),
      });
      if (response.ok) {
        toast.success("Mazot tüketim kartı başarıyla eklendi.");
        setIsDialogOpen(false);
        fetchMazotTuketimKartlari();
        setFormData({});
      } else {
        toast.error("Mazot tüketim kartı eklenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Mazot tüketim kartı eklenirken bir hata oluştu:", error);
      toast.error("Mazot tüketim kartı eklenirken bir hata oluştu.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-gray-800 text-neon-cyan border border-neon-blue">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-neon-pink">
            Mazot Tüketim Kartları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-neon-green text-black hover:bg-neon-green/80">
                  Yeni Mazot Tüketim Kartı Ekle
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-neon-cyan border border-neon-blue">
                <DialogHeader>
                  <DialogTitle className="text-neon-pink">
                    Yeni Mazot Tüketim Kartı Ekle
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="ad">Ad</Label>
                    <Input
                      id="ad"
                      name="ad"
                      required
                      onChange={handleInputChange}
                      className="bg-gray-700 text-neon-cyan border-neon-blue"
                    />
                  </div>
                  <div>
                    <Label htmlFor="kategori">Kategori</Label>
                    <Input
                      id="kategori"
                      name="kategori"
                      required
                      onChange={handleInputChange}
                      className="bg-gray-700 text-neon-cyan border-neon-blue"
                    />
                  </div>
                  <div>
                    <Label htmlFor="alt_kategori">Alt Kategori</Label>
                    <Input
                      id="alt_kategori"
                      name="alt_kategori"
                      required
                      onChange={handleInputChange}
                      className="bg-gray-700 text-neon-cyan border-neon-blue"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dekar_basi_mazot_tuketim">
                      Dekar Başı Mazot Tüketimi (Lt)
                    </Label>
                    <Input
                      id="dekar_basi_mazot_tuketim"
                      name="dekar_basi_mazot_tuketim"
                      type="number"
                      step="0.01"
                      required
                      onChange={handleInputChange}
                      className="bg-gray-700 text-neon-cyan border-neon-blue"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-neon-green text-black hover:bg-neon-green/80"
                  >
                    Ekle
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-neon-pink">Ad</TableHead>
                <TableHead className="text-neon-pink">Kategori</TableHead>
                <TableHead className="text-neon-pink">Alt Kategori</TableHead>
                <TableHead className="text-neon-pink">
                  Dekar Başı Mazot Tüketimi (Lt)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mazotTuketimKartlari.map((kart) => (
                <TableRow key={kart._id}>
                  <TableCell>{kart.ad}</TableCell>
                  <TableCell>{kart.kategori}</TableCell>
                  <TableCell>{kart.alt_kategori}</TableCell>
                  <TableCell>
                    {kart.dekar_basi_mazot_tuketim.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
