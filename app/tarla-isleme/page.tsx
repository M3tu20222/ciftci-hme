"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TarlaIslemePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [tarlaId, setTarlaId] = useState("");
  const [islemTipi, setIslemTipi] = useState("");
  const [tarih, setTarih] = useState<Date | undefined>(new Date());
  const [aciklama, setAciklama] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      console.log("No session");
      return;
    }

    try {
      const res = await fetch("/api/tarla-isleme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tarlaId,
          islemTipi,
          tarih,
          aciklama,
        }),
      });

      if (res.ok) {
        router.push("/tarla-isleme");
      }
    } catch (error) {
      console.error("Failed to add tarla isleme:", error);
    }
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tarla İşleme Ekle</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="tarlaId">Tarla ID</Label>
          <Input
            id="tarlaId"
            type="text"
            value={tarlaId}
            onChange={(e) => setTarlaId(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="islemTipi">İşlem Tipi</Label>
          <Select onValueChange={(value) => setIslemTipi(value)}>
            <SelectTrigger>
              <SelectValue placeholder="İşlem tipi seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ekim">Ekim</SelectItem>
              <SelectItem value="gübreleme">Gübreleme</SelectItem>
              <SelectItem value="ilaçlama">İlaçlama</SelectItem>
              <SelectItem value="hasat">Hasat</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Tarih</Label>
          <Calendar
            selected={tarih}
            onSelect={(date) => setTarih(date)}
            className="rounded-md border"
          />
        </div>
        <div>
          <Label htmlFor="aciklama">Açıklama</Label>
          <Input
            id="aciklama"
            value={aciklama}
            onChange={(e) => setAciklama(e.target.value)}
          />
        </div>
        <Button type="submit">Ekle</Button>
      </form>
    </div>
  );
}
