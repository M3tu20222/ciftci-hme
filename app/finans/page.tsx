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
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { tr } from "date-fns/locale";

interface Transaction {
  _id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
}

export default function FinansPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    date: new Date().toISOString(),
    description: "",
    amount: 0,
    type: "income",
    category: "",
  });
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch("/api/transactions");
      if (!response.ok) throw new Error("İşlemleri getirme hatası");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("İşlemleri getirme hatası:", error);
      toast({
        title: "Hata",
        description: "İşlemleri getirirken bir hata oluştu.",
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
    fetchTransactions();
  }, [session, status, router, fetchTransactions]);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });
      if (!response.ok) throw new Error("İşlem ekleme hatası");
      await fetchTransactions();
      setNewTransaction({
        date: new Date().toISOString(),
        description: "",
        amount: 0,
        type: "income",
        category: "",
      });
      toast({
        title: "Başarılı",
        description: "Yeni işlem başarıyla eklendi.",
      });
    } catch (error) {
      console.error("İşlem ekleme hatası:", error);
      toast({
        title: "Hata",
        description: "İşlem eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const filterTransactions = () => {
    if (selectedDate) {
      const start = startOfDay(selectedDate);
      const end = endOfDay(selectedDate);
      return transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return isWithinInterval(transactionDate, { start, end });
      });
    }
    return transactions;
  };

  const calculateTotal = (type: "income" | "expense") => {
    return filterTransactions()
      .filter((t) => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-blue title-glow">
          Finans Yönetimi
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-2 border-neon-green">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-neon-green">
                Yeni İşlem Ekle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-neon-blue">
                    Tarih
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={format(
                      new Date(newTransaction.date || ""),
                      "yyyy-MM-dd"
                    )}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        date: new Date(e.target.value).toISOString(),
                      })
                    }
                    className="bg-gray-700 text-neon-pink border-neon-blue"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-neon-blue">
                    Açıklama
                  </Label>
                  <Input
                    id="description"
                    value={newTransaction.description}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        description: e.target.value,
                      })
                    }
                    className="bg-gray-700 text-neon-pink border-neon-blue"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-neon-blue">
                    Tutar
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        amount: Number(e.target.value),
                      })
                    }
                    className="bg-gray-700 text-neon-pink border-neon-blue"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-neon-blue">
                    Tür
                  </Label>
                  <Select
                    value={newTransaction.type}
                    onValueChange={(value: "income" | "expense") =>
                      setNewTransaction({ ...newTransaction, type: value })
                    }
                  >
                    <SelectTrigger className="bg-gray-700 text-neon-pink border-neon-blue">
                      <SelectValue placeholder="İşlem türü seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Gelir</SelectItem>
                      <SelectItem value="expense">Gider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-neon-blue">
                    Kategori
                  </Label>
                  <Input
                    id="category"
                    value={newTransaction.category}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        category: e.target.value,
                      })
                    }
                    className="bg-gray-700 text-neon-pink border-neon-blue"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-neon-green hover:bg-neon-blue text-black"
                >
                  İşlem Ekle
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-2 border-neon-pink">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-neon-pink">
                Tarih Seçin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border border-neon-blue bg-gray-700 text-neon-pink"
              />
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-2 border-neon-cyan">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-neon-cyan">
              İşlem Listesi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filterTransactions().map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex justify-between items-center p-4 bg-gray-700 rounded-md border border-neon-blue"
                >
                  <div>
                    <p className="text-neon-green">{transaction.description}</p>
                    <p className="text-neon-pink text-sm">
                      {format(new Date(transaction.date), "d MMMM yyyy", {
                        locale: tr,
                      })}
                    </p>
                    <p className="text-neon-blue text-sm">
                      {transaction.category}
                    </p>
                  </div>
                  <p
                    className={`text-lg font-bold ${
                      transaction.type === "income"
                        ? "text-neon-green"
                        : "text-neon-red"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {transaction.amount.toFixed(2)} TL
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-neon-green text-lg font-bold">
              Toplam Gelir: {calculateTotal("income").toFixed(2)} TL
            </p>
            <p className="text-neon-red text-lg font-bold">
              Toplam Gider: {calculateTotal("expense").toFixed(2)} TL
            </p>
          </CardFooter>
        </Card>
      </div>
      <Toaster />
    </Layout>
  );
}
