"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const inventoryData = [
  {
    id: 1,
    name: "Tümosan 9115",
    category: "Kalıcı Malzeme",
    subCategory: "Traktör",
    owners: ["Ahmet 50%", "Mehmet 50%"],
    quantity: 1,
    unit: "Adet",
    currentValue: "1.000.000 TL",
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
    currentValue: "100.000 TL",
    fuelConsumption: "1 L/Dekar",
  },
  {
    id: 3,
    name: "Holder",
    category: "Traktör Malzemesi",
    subCategory: "İlaç Gübre",
    owners: ["Ayşe 100%"],
    quantity: 1,
    unit: "Adet",
    currentValue: "75.000 TL",
    fuelConsumption: "0.3 L/Dekar",
  },
  {
    id: 4,
    name: "Römork",
    category: "Kalıcı Malzeme",
    subCategory: "Traktör",
    owners: ["Ahmet 33.3%", "Ayşe 33.3%", "Mehmet 33.3%"],
    quantity: 1,
    unit: "Adet",
    currentValue: "67.000 TL",
    fuelConsumption: "-",
  },
  {
    id: 5,
    name: "Kobra",
    category: "Traktör Malzemesi",
    subCategory: "Tarla İşleme",
    owners: ["Ahmet 33.3%", "Mehmet 33.3%", "Ayşe 33.3%"],
    quantity: 1,
    unit: "Adet",
    currentValue: "250.000 TL",
    fuelConsumption: "1 L/Dekar",
  },
  // ... Add the rest of the inventory items here
]

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredInventory = inventoryData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "all" || item.category === categoryFilter),
  )

  const categories = Array.from(new Set(inventoryData.map((item) => item.category)))

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
                  Mevcut Değer: <span className="text-neon-green">{item.currentValue}</span>
                </p>
                <p className="text-neon-yellow">
                  Mazot Tüketim: <span className="text-neon-cyan">{item.fuelConsumption}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
  )
}

