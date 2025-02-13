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
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface EnvanterItem {
  _id: string;
  name: string;
  category: string;
  subCategory: string;
  owners: string[];
  quantity: number;
  unit: string;
  currentValue: number;
  fuelConsumption: number;
}

export default function EnvanterYonetimiPage() {
  const [envanterItems, setEnvanterItems] = useState<EnvanterItem[]>([]);
  const [editingItem, setEditingItem] = useState<EnvanterItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<EnvanterItem>>({
    name: "",
    category: "",
    subCategory: "",
    owners: [],
    quantity: 0,
    unit: "",
    currentValue: 0,
    fuelConsumption: 0,
  });
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchEnvanterItems();
  }, [session, status, router]);

  const fetchEnvanterItems = async () => {
    try {
      const response = await fetch("/api/envanter");
      if (!response.ok) {
        throw new Error("Envanter öğelerini getirme hatası");
      }
      const data = await response.json();
      setEnvanterItems(data);
    } catch (error) {
      console.error("Envanter öğelerini getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Envanter öğelerini getirirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/envanter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) throw new Error("Envanter öğesi ekleme hatası");
      await fetchEnvanterItems();
      setNewItem({
        name: "",
        category: "",
        subCategory: "",
        owners: [],
        quantity: 0,
        unit: "",
        currentValue: 0,
        fuelConsumption: 0,
      });
      setIsAddDialogOpen(false);
      toast({
        title: "Başarılı",
        description: "Yeni envanter öğesi başarıyla eklendi.",
      });
    } catch (error) {
      console.error("Envanter öğesi ekleme hatası:", error);
      toast({
        title: "Hata",
        description: "Envanter öğesi eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const response = await fetch(`/api/envanter/${editingItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });
      if (!response.ok) throw new Error("Envanter öğesi güncelleme hatası");
      await fetchEnvanterItems();
      setEditingItem(null);
      toast({
        title: "Başarılı",
        description: "Envanter öğesi başarıyla güncellendi.",
      });
    } catch (error) {
      console.error("Envanter öğesi güncelleme hatası:", error);
      toast({
        title: "Hata",
        description: "Envanter öğesi güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Bu envanter öğesini silmek istediğinizden emin misiniz?"))
      return;
    try {
      const response = await fetch(`/api/envanter/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Envanter öğesi silme hatası");
      await fetchEnvanterItems();
      toast({
        title: "Başarılı",
        description: "Envanter öğesi başarıyla silindi.",
      });
    } catch (error) {
      console.error("Envanter öğesi silme hatası:", error);
      toast({
        title: "Hata",
        description: "Envanter öğesi silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-green title-glow">
          Envanter Yönetimi
        </h1>

        <div className="flex justify-end mb-4">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-neon-purple hover:bg-neon-pink text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Yeni Öğe Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-2 border-neon-green">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-neon-green">
                  Yeni Envanter Öğesi Ekle
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddItem}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right text-neon-blue">
                      Ad
                    </Label>
                    <Input
                      id="name"
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem({ ...newItem, name: e.target.value })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="category"
                      className="text-right text-neon-blue"
                    >
                      Kategori
                    </Label>
                    <Input
                      id="category"
                      value={newItem.category}
                      onChange={(e) =>
                        setNewItem({ ...newItem, category: e.target.value })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="subCategory"
                      className="text-right text-neon-blue"
                    >
                      Alt Kategori
                    </Label>
                    <Input
                      id="subCategory"
                      value={newItem.subCategory}
                      onChange={(e) =>
                        setNewItem({ ...newItem, subCategory: e.target.value })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="owners"
                      className="text-right text-neon-blue"
                    >
                      Sahipler
                    </Label>
                    <Input
                      id="owners"
                      value={newItem.owners?.join(", ")}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          owners: e.target.value.split(", "),
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="quantity"
                      className="text-right text-neon-blue"
                    >
                      Miktar
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          quantity: Number(e.target.value),
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="unit" className="text-right text-neon-blue">
                      Birim
                    </Label>
                    <Input
                      id="unit"
                      value={newItem.unit}
                      onChange={(e) =>
                        setNewItem({ ...newItem, unit: e.target.value })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="currentValue"
                      className="text-right text-neon-blue"
                    >
                      Mevcut Değer
                    </Label>
                    <Input
                      id="currentValue"
                      type="number"
                      value={newItem.currentValue}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          currentValue: Number(e.target.value),
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="fuelConsumption"
                      className="text-right text-neon-blue"
                    >
                      Yakıt Tüketimi
                    </Label>
                    <Input
                      id="fuelConsumption"
                      type="number"
                      value={newItem.fuelConsumption}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          fuelConsumption: Number(e.target.value),
                        })
                      }
                      className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
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
          {envanterItems.map((item) => (
            <Card
              key={item._id}
              className="bg-gray-800 border-2 border-neon-green shadow-lg hover:shadow-neon-green transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-neon-pink">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-neon-blue">
                  Kategori:{" "}
                  <span className="text-neon-pink">{item.category}</span>
                </p>
                <p className="text-neon-blue">
                  Alt Kategori:{" "}
                  <span className="text-neon-pink">{item.subCategory}</span>
                </p>
                <p className="text-neon-blue">
                  Sahipler:{" "}
                  <span className="text-neon-pink">
                    {item.owners.join(", ")}
                  </span>
                </p>
                <p className="text-neon-blue">
                  Miktar:{" "}
                  <span className="text-neon-pink">{item.quantity}</span>
                </p>
                <p className="text-neon-blue">
                  Birim: <span className="text-neon-pink">{item.unit}</span>
                </p>
                <p className="text-neon-blue">
                  Mevcut Değer:{" "}
                  <span className="text-neon-pink">{item.currentValue}</span>
                </p>
                <p className="text-neon-blue">
                  Yakıt Tüketimi:{" "}
                  <span className="text-neon-pink">{item.fuelConsumption}</span>
                </p>
              </CardContent>
              <CardFooter className="space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-neon-cyan hover:bg-neon-blue text-black"
                      onClick={() => setEditingItem(item)}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Düzenle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-2 border-neon-green">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-neon-green">
                        Envanter Öğesi Düzenle
                      </DialogTitle>
                    </DialogHeader>
                    {editingItem && (
                      <form onSubmit={handleEditItem}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-name"
                              className="text-right text-neon-blue"
                            >
                              Ad
                            </Label>
                            <Input
                              id="edit-name"
                              value={editingItem.name}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  name: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-category"
                              className="text-right text-neon-blue"
                            >
                              Kategori
                            </Label>
                            <Input
                              id="edit-category"
                              value={editingItem.category}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  category: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-subCategory"
                              className="text-right text-neon-blue"
                            >
                              Alt Kategori
                            </Label>
                            <Input
                              id="edit-subCategory"
                              value={editingItem.subCategory}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  subCategory: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-owners"
                              className="text-right text-neon-blue"
                            >
                              Sahipler
                            </Label>
                            <Input
                              id="edit-owners"
                              value={editingItem.owners.join(", ")}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  owners: e.target.value.split(", "),
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-quantity"
                              className="text-right text-neon-blue"
                            >
                              Miktar
                            </Label>
                            <Input
                              id="edit-quantity"
                              type="number"
                              value={editingItem.quantity}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  quantity: Number(e.target.value),
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-unit"
                              className="text-right text-neon-blue"
                            >
                              Birim
                            </Label>
                            <Input
                              id="edit-unit"
                              value={editingItem.unit}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  unit: e.target.value,
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-currentValue"
                              className="text-right text-neon-blue"
                            >
                              Mevcut Değer
                            </Label>
                            <Input
                              id="edit-currentValue"
                              type="number"
                              value={editingItem.currentValue}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  currentValue: Number(e.target.value),
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-fuelConsumption"
                              className="text-right text-neon-blue"
                            >
                              Yakıt Tüketimi
                            </Label>
                            <Input
                              id="edit-fuelConsumption"
                              type="number"
                              value={editingItem.fuelConsumption}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  fuelConsumption: Number(e.target.value),
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-pink border-neon-blue"
                            />
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
                  onClick={() => handleDeleteItem(item._id)}
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
