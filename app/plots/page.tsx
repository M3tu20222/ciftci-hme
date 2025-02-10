"use client"

import { useState } from "react"
import { PlusCircleIcon, PencilIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

const wells = [
  { id: 1, name: "Kuyu 1" },
  { id: 2, name: "Kuyu 2" },
]

const plots = [
  {
    id: 1,
    name: "Kuzey Tarla",
    area: 100,
    owners: ["Ahmet", "Mehmet"],
    crop: "Buğday",
    status: "Aktif",
    irrigated: 80,
    rented: false,
    parcel: "A-123",
    season: "2023-2024",
    wellId: Math.random() < 0.5 ? 1 : 2, // Rastgele kuyu ataması
  },
  {
    id: 2,
    name: "Güney Bahçe",
    area: 50,
    owners: ["Mehmet", "Ayşe"],
    crop: "Mısır",
    status: "Hazırlık",
    irrigated: 0,
    rented: true,
    parcel: "B-456",
    season: "2023-2024",
    wellId: Math.random() < 0.5 ? 1 : 2, // Rastgele kuyu ataması
  },
  {
    id: 3,
    name: "Doğu Çayır",
    area: 75,
    owners: ["Ahmet"],
    crop: "Yonca",
    status: "Hasat",
    irrigated: 100,
    rented: false,
    parcel: "C-789",
    season: "2023-2024",
    wellId: Math.random() < 0.5 ? 1 : 2, // Rastgele kuyu ataması
  },
  {
    id: 4,
    name: "Batı Tarla",
    area: 60,
    owners: ["Ayşe"],
    crop: "Arpa",
    status: "Aktif",
    irrigated: 50,
    rented: false,
    parcel: "D-101",
    season: "2023-2024",
    wellId: Math.random() < 0.5 ? 1 : 2, // Rastgele kuyu ataması
  },
  {
    id: 5,
    name: "Merkez Bahçe",
    area: 40,
    owners: ["Ahmet", "Mehmet", "Ayşe"],
    crop: "Sebze",
    status: "Aktif",
    irrigated: 70,
    rented: false,
    parcel: "E-202",
    season: "2023-2024",
    wellId: Math.random() < 0.5 ? 1 : 2, // Rastgele kuyu ataması
  },
]

const seasons = [
  { id: 1, name: "2023-2024", startDate: "2023-09-01", endDate: "2024-08-31", active: true, year: 2023 },
  { id: 2, name: "2024-2025", startDate: "2024-09-01", endDate: "2025-08-31", active: false, year: 2024 },
]

const allOwners = ["Ahmet", "Mehmet", "Ayşe"]
const statusOptions = ["Aktif", "Hazırlık", "Hasat"]

export default function PlotsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [ownerFilter, setOwnerFilter] = useState("all")
  const [editingPlot, setEditingPlot] = useState(null)
  const [newSeason, setNewSeason] = useState({ year: new Date().getFullYear() })

  const filteredPlots = plots.filter(
    (plot) =>
      plot.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (ownerFilter === "all" || plot.owners.includes(ownerFilter)),
  )

  const handleAddSeason = (e) => {
    e.preventDefault()
    const newSeasonData = {
      id: seasons.length + 1,
      name: `${newSeason.year}-${newSeason.year + 1}`,
      startDate: `${newSeason.year}-09-01`,
      endDate: `${newSeason.year + 1}-08-31`,
      active: false,
      year: newSeason.year,
    }
    seasons.push(newSeasonData)
    setNewSeason({ year: new Date().getFullYear() })
    // In a real application, you would update the state or make an API call here
    alert(`Yeni sezon eklendi: ${newSeasonData.name}`)
  }

  const handleWellChange = (value: string) => {
    setEditingPlot({ ...editingPlot, wellId: Number(value) })
  }

  const handleEditPlot = (e) => {
    e.preventDefault()
    // In a real application, you would update the state or make an API call here
    alert(`Tarla düzenlendi: ${editingPlot.name}`)
    setEditingPlot(null)
  }

  return (
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-5xl font-bold text-center mb-12 text-neon-pink title-glow">Tarla ve Sezon Yönetimi</h1>

        {/* Seasons Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-neon-blue glow-text-subtle">Sezonlar (İş Akışı için)</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-transparent text-neon-blue border-2 border-neon-blue hover:bg-neon-blue hover:text-background transition-all duration-300 shadow-neon-blue">
                  <PlusCircleIcon className="mr-2 h-5 w-5" />
                  Yeni Sezon Ekle
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background/95 border-2 border-neon-blue shadow-neon-blue backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-neon-blue glow-text-blue">
                    Yeni Sezon Ekle
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddSeason}>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-neon-yellow text-sm font-semibold">Sezon Yılı</Label>
                      <Input
                        type="number"
                        min={2000}
                        max={2100}
                        value={newSeason.year}
                        onChange={(e) => setNewSeason({ year: Number.parseInt(e.target.value) })}
                        className="border-2 border-neon-yellow bg-background/50 text-neon-yellow focus:ring-neon-yellow"
                        placeholder="Örn: 2024"
                      />
                    </div>
                  </div>
                  <DialogFooter className="mt-8">
                    <Button
                      type="submit"
                      className="w-full bg-transparent text-neon-blue border-2 border-neon-blue hover:bg-neon-blue hover:text-background transition-all duration-300 shadow-neon-blue"
                    >
                      Ekle
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {seasons.map((season) => (
              <Card
                key={season.id}
                className="border-2 border-neon-blue shadow-lg hover:shadow-neon-blue transition-shadow duration-300 bg-gray-900"
              >
                <CardHeader>
                  <CardTitle className="text-neon-blue glow-text-subtle">{season.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-neon-pink">Başlangıç:</span>
                      <span className="text-neon-yellow font-bold">
                        {new Date(season.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-neon-cyan">Bitiş:</span>
                      <span className="text-neon-yellow font-bold">
                        {new Date(season.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-neon-purple">Durum:</span>
                      <span className="text-neon-yellow">{season.active ? "Aktif" : "Pasif"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-neon-green">Yıl:</span>
                      <span className="text-neon-yellow">{season.year}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Plots Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-neon-purple glow-text-subtle">Tarlalar</h2>
            <div className="flex space-x-4">
              <Input
                type="text"
                placeholder="Tarla ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 text-neon-blue placeholder-neon-blue/50 border-neon-blue focus:ring-neon-green"
              />
              <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                <SelectTrigger className="w-[180px] bg-gray-800 text-neon-green border-neon-green">
                  <SelectValue placeholder="Sahip Filtrele" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
                  <SelectItem value="all">Tümü</SelectItem>
                  {allOwners.map((owner) => (
                    <SelectItem key={owner} value={owner}>
                      {owner}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlots.map((plot) => (
              <Card
                key={plot.id}
                className="border-2 border-neon-purple shadow-lg hover:shadow-neon-purple transition-shadow duration-300 bg-gray-900"
              >
                <CardHeader>
                  <CardTitle className="text-neon-purple">{plot.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neon-blue">Dekar: {plot.area}</p>
                  <p className="text-neon-green">Ürün: {plot.crop}</p>
                  <p className="text-neon-yellow">Durum: {plot.status}</p>
                  <p className="text-neon-pink">Sulanan: {plot.irrigated}%</p>
                  <p className="text-neon-blue">Kiralık: {plot.rented ? "Evet" : "Hayır"}</p>
                  <p className="text-neon-green">Ada-Parsel: {plot.parcel}</p>
                  <p className="text-neon-yellow">Sezon: {plot.season}</p>
                  <p className="text-neon-cyan">Kuyu: {wells.find((w) => w.id === plot.wellId)?.name}</p>
                  <div className="mt-2">
                    <h4 className="text-neon-pink font-semibold">Sahipler:</h4>
                    {plot.owners.map((owner, index) => (
                      <p key={index} className="text-neon-blue">
                        {owner}
                      </p>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setEditingPlot(plot)}
                        className="w-full bg-transparent text-neon-cyan border-2 border-neon-cyan hover:bg-neon-cyan hover:text-background transition-all duration-300 shadow-neon-cyan"
                      >
                        <PencilIcon className="mr-2 h-4 w-4" />
                        <span>Düzenle</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-2 border-neon-cyan shadow-neon-cyan backdrop-blur-sm">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-neon-cyan glow-text-cyan">
                          Tarla Düzenle
                        </DialogTitle>
                      </DialogHeader>
                      {editingPlot && (
                        <form onSubmit={handleEditPlot}>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="name" className="text-neon-yellow">
                                Tarla Adı
                              </Label>
                              <Input
                                id="name"
                                value={editingPlot.name}
                                onChange={(e) => setEditingPlot({ ...editingPlot, name: e.target.value })}
                                className="bg-gray-800 text-neon-blue border-neon-blue"
                              />
                            </div>
                            <div>
                              <Label htmlFor="area" className="text-neon-yellow">
                                Dekar
                              </Label>
                              <Input
                                id="area"
                                type="number"
                                value={editingPlot.area}
                                onChange={(e) => setEditingPlot({ ...editingPlot, area: Number(e.target.value) })}
                                className="bg-gray-800 text-neon-blue border-neon-blue"
                              />
                            </div>
                            <div>
                              <Label htmlFor="crop" className="text-neon-yellow">
                                Ürün
                              </Label>
                              <Input
                                id="crop"
                                value={editingPlot.crop}
                                onChange={(e) => setEditingPlot({ ...editingPlot, crop: e.target.value })}
                                className="bg-gray-800 text-neon-blue border-neon-blue"
                              />
                            </div>
                            <div>
                              <Label htmlFor="status" className="text-neon-yellow">
                                Durum
                              </Label>
                              <Select
                                value={editingPlot.status}
                                onValueChange={(value) => setEditingPlot({ ...editingPlot, status: value })}
                              >
                                <SelectTrigger className="bg-gray-800 text-neon-green border-neon-green">
                                  <SelectValue placeholder="Durum seçin" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
                                  {statusOptions.map((status) => (
                                    <SelectItem key={status} value={status}>
                                      {status}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="irrigated" className="text-neon-yellow">
                                Sulanan (%)
                              </Label>
                              <Input
                                id="irrigated"
                                type="number"
                                min="0"
                                max="100"
                                value={editingPlot.irrigated}
                                onChange={(e) => setEditingPlot({ ...editingPlot, irrigated: Number(e.target.value) })}
                                className="bg-gray-800 text-neon-blue border-neon-blue"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="rented"
                                checked={editingPlot.rented}
                                onCheckedChange={(checked) => setEditingPlot({ ...editingPlot, rented: checked })}
                                className="bg-gray-800 text-neon-blue border-neon-blue"
                              />
                              <Label htmlFor="rented" className="text-neon-yellow">
                                Kiralık
                              </Label>
                            </div>
                            <div>
                              <Label htmlFor="parcel" className="text-neon-yellow">
                                Ada-Parsel
                              </Label>
                              <Input
                                id="parcel"
                                value={editingPlot.parcel}
                                onChange={(e) => setEditingPlot({ ...editingPlot, parcel: e.target.value })}
                                className="bg-gray-800 text-neon-blue border-neon-blue"
                              />
                            </div>
                            <div>
                              <Label htmlFor="season" className="text-neon-yellow">
                                Sezon
                              </Label>
                              <Select
                                value={editingPlot.season}
                                onValueChange={(value) => setEditingPlot({ ...editingPlot, season: value })}
                              >
                                <SelectTrigger className="bg-gray-800 text-neon-green border-neon-green">
                                  <SelectValue placeholder="Sezon seçin" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
                                  {seasons.map((season) => (
                                    <SelectItem key={season.id} value={season.name}>
                                      {season.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="well" className="text-neon-yellow">
                                Kuyu
                              </Label>
                              <Select value={editingPlot.wellId.toString()} onValueChange={handleWellChange}>
                                <SelectTrigger className="bg-gray-800 text-neon-green border-neon-green">
                                  <SelectValue placeholder="Kuyu seçin" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
                                  {wells.map((well) => (
                                    <SelectItem key={well.id} value={well.id.toString()}>
                                      {well.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-neon-yellow">Sahipler</Label>
                              {allOwners.map((owner) => (
                                <div key={owner} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`owner-${owner}`}
                                    checked={editingPlot.owners.includes(owner)}
                                    onCheckedChange={(checked) => {
                                      const newOwners = checked
                                        ? [...editingPlot.owners, owner]
                                        : editingPlot.owners.filter((o) => o !== owner)
                                      setEditingPlot({ ...editingPlot, owners: newOwners })
                                    }}
                                    className="bg-gray-800 text-neon-blue border-neon-blue"
                                  />
                                  <Label htmlFor={`owner-${owner}`} className="text-neon-yellow">
                                    {owner}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                          <DialogFooter className="mt-6">
                            <Button
                              type="submit"
                              className="w-full bg-transparent text-neon-cyan border-2 border-neon-cyan hover:bg-neon-cyan hover:text-background transition-all duration-300 shadow-neon-cyan"
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
      </div>
  )
}

