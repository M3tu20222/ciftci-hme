"use client"

import { useState } from "react"
import { PlusCircle, Pencil } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Envanter verisi (gerçek uygulamada bu veri bir API'den gelecektir)
const initialInventory = [
  {
    id: 1,
    name: "Tümosan 9115",
    category: "Kalıcı Malzeme",
    subCategory: "Traktör",
    owners: ["Ahmet 50%", "Mehmet 50%"],
    quantity: 1,
    unit: "Adet",
    currentValue: "1000000",
    fuelConsumption: "-",
  },
  {
    id: 2,
    name: "Diskaro",
    category: "Traktör Malzemesi",
    subCategory: "Tarla İşleme",
    owners: ["Ayşe 100%"],
    quantity: 1,
    unit: "Adet",
    currentValue: "100000",
    fuelConsumption: "1",
  },
  // Diğer envanter öğeleri buraya eklenebilir
]

export default function InventoryManagementPage() {
  const [inventory, setInventory] = useState(initialInventory)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [editingItem, setEditingItem] = useState(null)
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    subCategory: "",
    owners: "",
    quantity: 1,
    unit: "Adet",
    currentValue: "",
    fuelConsumption: "",
  })

  const categories = Array.from(new Set(inventory.map((item) => item.category)))

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "all" || item.category === categoryFilter),
  )

  const handleAddItem = (e) => {
    e.preventDefault()
    const itemToAdd = {
      ...newItem,
      id: inventory.length + 1,
      owners: newItem.owners.split(",").map((owner) => owner.trim()),
    }
    setInventory([...inventory, itemToAdd])
    setNewItem({
      name: "",
      category: "",
      subCategory: "",
      owners: "",
      quantity: 1,
      unit: "Adet",
      currentValue: "",
      fuelConsumption: "",
    })
  }

  const handleEditItem = (e) => {
    e.preventDefault()
    const updatedInventory = inventory.map((item) =>
      item.id === editingItem.id ? { ...editingItem, owners: editingItem.owners.join(", ") } : item,
    )
    setInventory(updatedInventory)
    setEditingItem(null)
  }

  return (
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-pink title-glow">Envanter Yönetimi</h1>

        <div className="flex justify-between items-center mb-4">
          <Input
            type="text"
            placeholder="Envanter ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3 bg-gray-800 text-neon-blue placeholder-neon-blue/50 border-neon-blue focus:ring-neon-green"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px] bg-gray-800 text-neon-green border-neon-green">
              <SelectValue placeholder="Kategori Filtrele" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
              <SelectItem value="all">Tümü</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-neon-purple hover:bg-neon-pink text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Yeni Öğe Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-2 border-neon-blue">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-neon-blue">Yeni Envanter Öğesi Ekle</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddItem}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right text-neon-green">
                      İsim
                    </Label>
                    <Input
                      id="name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right text-neon-green">
                      Kategori
                    </Label>
                    <Input
                      id="category"
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subCategory" className="text-right text-neon-green">
                      Alt Kategori
                    </Label>
                    <Input
                      id="subCategory"
                      value={newItem.subCategory}
                      onChange={(e) => setNewItem({ ...newItem, subCategory: e.target.value })}
                      className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="owners" className="text-right text-neon-green">
                      Sahipler
                    </Label>
                    <Input
                      id="owners"
                      value={newItem.owners}
                      onChange={(e) => setNewItem({ ...newItem, owners: e.target.value })}
                      className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                      placeholder="Örn: Ahmet 50%, Mehmet 50%"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right text-neon-green">
                      Miktar
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: Number.parseInt(e.target.value) })}
                      className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="unit" className="text-right text-neon-green">
                      Birim
                    </Label>
                    <Input
                      id="unit"
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="currentValue" className="text-right text-neon-green">
                      Mevcut Değer (TL)
                    </Label>
                    <Input
                      id="currentValue"
                      type="number"
                      value={newItem.currentValue}
                      onChange={(e) => setNewItem({ ...newItem, currentValue: e.target.value })}
                      className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="fuelConsumption" className="text-right text-neon-green">
                      Yakıt Tüketimi (L/Dekar)
                    </Label>
                    <Input
                      id="fuelConsumption"
                      value={newItem.fuelConsumption}
                      onChange={(e) => setNewItem({ ...newItem, fuelConsumption: e.target.value })}
                      className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-neon-green hover:bg-neon-blue text-black">
                    Ekle
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInventory.map((item) => (
            <Card
              key={item.id}
              className="bg-gray-800 border-2 border-neon-blue shadow-lg hover:shadow-neon-blue transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-neon-pink">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-neon-blue">
                  Kategori: <span className="text-neon-green">{item.category}</span>
                </p>
                <p className="text-neon-blue">
                  Alt Kategori: <span className="text-neon-green">{item.subCategory}</span>
                </p>
                <p className="text-neon-yellow">
                  Sahipler: <span className="text-neon-cyan">{item.owners.join(", ")}</span>
                </p>
                <p className="text-neon-purple">
                  Miktar:{" "}
                  <span className="text-neon-pink">
                    {item.quantity} {item.unit}
                  </span>
                </p>
                <p className="text-neon-blue">
                  Mevcut Değer:{" "}
                  <span className="text-neon-green">
                    {Number.parseInt(item.currentValue).toLocaleString("tr-TR")} TL
                  </span>
                </p>
                <p className="text-neon-yellow">
                  Yakıt Tüketimi:{" "}
                  <span className="text-neon-cyan">
                    {item.fuelConsumption === "-" ? "-" : `${item.fuelConsumption} L/Dekar`}
                  </span>
                </p>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-neon-cyan hover:bg-neon-blue text-black"
                      onClick={() => setEditingItem(item)}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Düzenle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-2 border-neon-blue">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-neon-blue">Envanter Öğesini Düzenle</DialogTitle>
                    </DialogHeader>
                    {editingItem && (
                      <form onSubmit={handleEditItem}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right text-neon-green">
                              İsim
                            </Label>
                            <Input
                              id="edit-name"
                              value={editingItem.name}
                              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                              className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-category" className="text-right text-neon-green">
                              Kategori
                            </Label>
                            <Input
                              id="edit-category"
                              value={editingItem.category}
                              onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                              className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-subCategory" className="text-right text-neon-green">
                              Alt Kategori
                            </Label>
                            <Input
                              id="edit-subCategory"
                              value={editingItem.subCategory}
                              onChange={(e) => setEditingItem({ ...editingItem, subCategory: e.target.value })}
                              className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-owners" className="text-right text-neon-green">
                              Sahipler
                            </Label>
                            <Input
                              id="edit-owners"
                              value={editingItem.owners.join(", ")}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  owners: e.target.value.split(",").map((owner) => owner.trim()),
                                })
                              }
                              className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                              placeholder="Örn: Ahmet 50%, Mehmet 50%"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-quantity" className="text-right text-neon-green">
                              Miktar
                            </Label>
                            <Input
                              id="edit-quantity"
                              type="number"
                              value={editingItem.quantity}
                              onChange={(e) =>
                                setEditingItem({ ...editingItem, quantity: Number.parseInt(e.target.value) })
                              }
                              className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-unit" className="text-right text-neon-green">
                              Birim
                            </Label>
                            <Input
                              id="edit-unit"
                              value={editingItem.unit}
                              onChange={(e) => setEditingItem({ ...editingItem, unit: e.target.value })}
                              className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-currentValue" className="text-right text-neon-green">
                              Mevcut Değer (TL)
                            </Label>
                            <Input
                              id="edit-currentValue"
                              type="number"
                              value={editingItem.currentValue}
                              onChange={(e) => setEditingItem({ ...editingItem, currentValue: e.target.value })}
                              className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-fuelConsumption" className="text-right text-neon-green">
                              Yakıt Tüketimi (L/Dekar)
                            </Label>
                            <Input
                              id="edit-fuelConsumption"
                              value={editingItem.fuelConsumption}
                              onChange={(e) => setEditingItem({ ...editingItem, fuelConsumption: e.target.value })}
                              className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" className="bg-neon-green hover:bg-neon-blue text-black">
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
  )
}

