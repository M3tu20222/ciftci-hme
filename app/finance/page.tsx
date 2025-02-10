"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Dummy data (in a real application, this would come from your API or database)
const workflows = [
  {
    id: 1,
    fieldId: 1,
    operation: "Sulama",
    equipment: "Sulama Sistemi",
    date: new Date("2023-06-15"),
    duration: 4,
    waterAmount: 100,
    seasonId: 2,
  },
  {
    id: 2,
    fieldId: 2,
    operation: "Ekim",
    equipment: "Diskaro",
    date: new Date("2023-06-20"),
    duration: 6,
    seasonId: 2,
  },
  {
    id: 3,
    fieldId: 3,
    operation: "Sulama",
    equipment: "Sulama Sistemi",
    date: new Date("2023-07-01"),
    duration: 3,
    waterAmount: 75,
    seasonId: 2,
  },
  {
    id: 4,
    fieldId: 1,
    operation: "Gübreleme",
    equipment: "Holder",
    date: new Date("2023-07-10"),
    duration: 2,
    seasonId: 2,
  },
  {
    id: 5,
    fieldId: 4,
    operation: "Sulama",
    equipment: "Sulama Sistemi",
    date: new Date("2023-07-15"),
    duration: 5,
    waterAmount: 120,
    seasonId: 2,
  },
]

const inventory = [
  { id: 1, name: "Tümosan 9115", category: "Kalıcı Malzeme", subCategory: "Traktör", fuelConsumption: 5 },
  { id: 2, name: "Diskaro", category: "Traktör Malzemesi", subCategory: "Tarla İşleme", fuelConsumption: 1 },
  { id: 3, name: "Holder", category: "Traktör Malzemesi", subCategory: "İlaç Gübre", fuelConsumption: 0.3 },
  { id: 4, name: "Römork", category: "Kalıcı Malzeme", subCategory: "Traktör", fuelConsumption: 0 },
  { id: 5, name: "Kobra", category: "Traktör Malzemesi", subCategory: "Tarla İşleme", fuelConsumption: 1 },
]

const wells = [
  {
    id: 1,
    name: "Kuyu 1",
    invoices: [
      { startDate: new Date("2023-04-01"), endDate: new Date("2023-06-30"), amount: 150000 },
      { startDate: new Date("2023-07-01"), endDate: new Date("2023-09-30"), amount: 180000 },
    ],
  },
  {
    id: 2,
    name: "Kuyu 2",
    invoices: [
      { startDate: new Date("2023-04-01"), endDate: new Date("2023-06-30"), amount: 120000 },
      { startDate: new Date("2023-07-01"), endDate: new Date("2023-09-30"), amount: 140000 },
    ],
  },
]

const fields = [
  { id: 1, name: "Kuzey Tarla", area: 100, wellId: 1 },
  { id: 2, name: "Güney Bahçe", area: 50, wellId: 2 },
  { id: 3, name: "Doğu Çayır", area: 75, wellId: 1 },
  { id: 4, name: "Batı Tarla", area: 60, wellId: 2 },
  { id: 5, name: "Merkez Bahçe", area: 40, wellId: 1 },
]

const seasons = [
  { id: 1, name: "2023 İlkbahar", startDate: new Date("2023-03-01"), endDate: new Date("2023-05-31") },
  { id: 2, name: "2023 Yaz", startDate: new Date("2023-06-01"), endDate: new Date("2023-08-31") },
  { id: 3, name: "2023 Sonbahar", startDate: new Date("2023-09-01"), endDate: new Date("2023-11-30") },
]

export default function FinancePage() {
  const [selectedSeason, setSelectedSeason] = useState(seasons[1].id.toString())
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(seasons[1].startDate)
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(seasons[1].endDate)

  const filteredWorkflows = useMemo(() => {
    return workflows.filter(
      (workflow) =>
        workflow.seasonId.toString() === selectedSeason &&
        workflow.date >= selectedStartDate! &&
        workflow.date <= selectedEndDate!,
    )
  }, [selectedSeason, selectedStartDate, selectedEndDate])

  const calculateFuelCost = (equipment: string, duration: number) => {
    const item = inventory.find((i) => i.name === equipment)
    if (!item) return 0
    return item.fuelConsumption * duration * 30 // Assuming fuel cost is 30 TL per liter
  }

  const calculateWaterCost = (fieldId: number, waterAmount: number) => {
    const field = fields.find((f) => f.id === fieldId)
    if (!field) return 0
    const well = wells.find((w) => w.id === field.wellId)
    if (!well) return 0
    const invoice = well.invoices.find((i) => i.startDate <= selectedStartDate! && i.endDate >= selectedEndDate!)
    if (!invoice) return 0
    const dailyRate = (invoice.amount / (invoice.endDate.getTime() - invoice.startDate.getTime())) * 86400000 // Convert to daily rate
    return dailyRate * (waterAmount / 1000) // Assuming water amount is in m³
  }

  const totalFuelCost = filteredWorkflows.reduce(
    (sum, workflow) => sum + calculateFuelCost(workflow.equipment, workflow.duration),
    0,
  )

  const totalWaterCost = filteredWorkflows.reduce(
    (sum, workflow) => sum + (workflow.waterAmount ? calculateWaterCost(workflow.fieldId, workflow.waterAmount) : 0),
    0,
  )

  const totalCost = totalFuelCost + totalWaterCost

  return (
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-pink title-glow">Finansal Rapor</h1>

        <div className="flex justify-between items-center mb-6">
          <Select value={selectedSeason} onValueChange={setSelectedSeason}>
            <SelectTrigger className="w-[200px] bg-gray-800 text-neon-green border-neon-green">
              <SelectValue placeholder="Sezon Seçin" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
              {seasons.map((season) => (
                <SelectItem key={season.id} value={season.id.toString()}>
                  {season.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !selectedStartDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedStartDate ? format(selectedStartDate, "PPP") : <span>Başlangıç Tarihi</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={selectedStartDate} onSelect={setSelectedStartDate} initialFocus />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !selectedEndDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedEndDate ? format(selectedEndDate, "PPP") : <span>Bitiş Tarihi</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar mode="single" selected={selectedEndDate} onSelect={setSelectedEndDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gray-800 border-2 border-neon-blue shadow-neon-blue">
            <CardHeader>
              <CardTitle className="text-neon-blue">Toplam Yakıt Maliyeti</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-neon-green">{totalFuelCost.toLocaleString("tr-TR")} TL</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-2 border-neon-blue shadow-neon-blue">
            <CardHeader>
              <CardTitle className="text-neon-blue">Toplam Su Maliyeti</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-neon-green">{totalWaterCost.toLocaleString("tr-TR")} TL</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-2 border-neon-blue shadow-neon-blue">
            <CardHeader>
              <CardTitle className="text-neon-blue">Toplam Maliyet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-neon-green">{totalCost.toLocaleString("tr-TR")} TL</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-2 border-neon-blue shadow-neon-blue">
          <CardHeader>
            <CardTitle className="text-neon-blue">İş Akışı Detayları</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-neon-pink">Tarih</TableHead>
                  <TableHead className="text-neon-pink">Tarla</TableHead>
                  <TableHead className="text-neon-pink">İşlem</TableHead>
                  <TableHead className="text-neon-pink">Ekipman</TableHead>
                  <TableHead className="text-neon-pink">Süre (Saat)</TableHead>
                  <TableHead className="text-neon-pink">Su Miktarı (m³)</TableHead>
                  <TableHead className="text-neon-pink">Yakıt Maliyeti</TableHead>
                  <TableHead className="text-neon-pink">Su Maliyeti</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkflows.map((workflow) => (
                  <TableRow key={workflow.id}>
                    <TableCell className="text-neon-green">{format(workflow.date, "dd.MM.yyyy")}</TableCell>
                    <TableCell className="text-neon-yellow">
                      {fields.find((f) => f.id === workflow.fieldId)?.name}
                    </TableCell>
                    <TableCell className="text-neon-cyan">{workflow.operation}</TableCell>
                    <TableCell className="text-neon-purple">{workflow.equipment}</TableCell>
                    <TableCell className="text-neon-blue">{workflow.duration}</TableCell>
                    <TableCell className="text-neon-green">{workflow.waterAmount || "-"}</TableCell>
                    <TableCell className="text-neon-yellow">
                      {calculateFuelCost(workflow.equipment, workflow.duration).toLocaleString("tr-TR")} TL
                    </TableCell>
                    <TableCell className="text-neon-cyan">
                      {workflow.waterAmount
                        ? calculateWaterCost(workflow.fieldId, workflow.waterAmount).toLocaleString("tr-TR")
                        : "-"}{" "}
                      TL
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
  )
}

