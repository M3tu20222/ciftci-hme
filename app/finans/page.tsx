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

// Data imports (in a real app, these would be fetched from an API or database)
const fields = [
  { id: 1, name: "Kuzey Tarla", area: 100, wellId: 1 },
  { id: 2, name: "Güney Bahçe", area: 50, wellId: 2 },
  { id: 3, name: "Doğu Çayır", area: 75, wellId: 1 },
  { id: 4, name: "Batı Tarla", area: 60, wellId: 2 },
  { id: 5, name: "Merkez Bahçe", area: 40, wellId: 1 },
]

const wells = [
  {
    id: 1,
    name: "Kuyu 1",
    invoices: [
      { startDate: new Date(2023, 0, 1), endDate: new Date(2023, 2, 31), amount: 150000 },
      { startDate: new Date(2023, 3, 1), endDate: new Date(2023, 5, 30), amount: 180000 },
      { startDate: new Date(2023, 6, 1), endDate: new Date(2023, 8, 30), amount: 200000 },
    ],
  },
  {
    id: 2,
    name: "Kuyu 2",
    invoices: [
      { startDate: new Date(2023, 0, 1), endDate: new Date(2023, 2, 31), amount: 120000 },
      { startDate: new Date(2023, 3, 1), endDate: new Date(2023, 5, 30), amount: 140000 },
      { startDate: new Date(2023, 6, 1), endDate: new Date(2023, 8, 30), amount: 160000 },
    ],
  },
]

const inventory = [
  { id: 1, name: "Tümosan 9115", category: "Kalıcı Malzeme", subCategory: "Traktör", fuelConsumption: "1" },
  { id: 2, name: "Diskaro", category: "Traktör Malzemesi", subCategory: "Tarla İşleme", fuelConsumption: "0.5" },
  { id: 3, name: "Holder", category: "Traktör Malzemesi", subCategory: "İlaç Gübre", fuelConsumption: "0.3" },
  { id: 4, name: "Römork", category: "Kalıcı Malzeme", subCategory: "Traktör", fuelConsumption: "-" },
  { id: 5, name: "Kobra", category: "Traktör Malzemesi", subCategory: "Tarla İşleme", fuelConsumption: "0.7" },
]

const workflows = [
  {
    id: 1,
    fieldId: 1,
    operation: "Sürme",
    equipment: "Tümosan 9115",
    date: new Date(2023, 5, 15),
    duration: 4,
    seasonId: 2,
  },
  {
    id: 2,
    fieldId: 2,
    operation: "Ekim",
    equipment: "Diskaro",
    date: new Date(2023, 5, 20),
    duration: 6,
    seasonId: 2,
  },
  {
    id: 3,
    fieldId: 1,
    operation: "Sulama",
    equipment: "Sulama Sistemi",
    date: new Date(2023, 6, 1),
    duration: 3,
    waterAmount: 100,
    seasonId: 2,
  },
  {
    id: 4,
    fieldId: 3,
    operation: "İlaçlama",
    equipment: "Holder",
    date: new Date(2023, 6, 5),
    duration: 2,
    seasonId: 2,
  },
  {
    id: 5,
    fieldId: 4,
    operation: "Sulama",
    equipment: "Sulama Sistemi",
    date: new Date(2023, 6, 10),
    duration: 4,
    waterAmount: 150,
    seasonId: 2,
  },
]

const seasons = [
  { id: 1, name: "2023 İlkbahar", startDate: "2023-03-01", endDate: "2023-05-31" },
  { id: 2, name: "2023 Yaz", startDate: "2023-06-01", endDate: "2023-08-31" },
  { id: 3, name: "2023 Sonbahar", startDate: "2023-09-01", endDate: "2023-11-30" },
]

export default function FinancePage() {
  const [selectedField, setSelectedField] = useState("all")
  const [selectedDateRange, setSelectedDateRange] = useState({ from: null, to: null })

  // Calculate financial data
  const financialData = useMemo(() => {
    let filteredWorkflows = workflows

    if (selectedField !== "all") {
      filteredWorkflows = filteredWorkflows.filter((w) => w.fieldId.toString() === selectedField)
    }

    if (selectedDateRange.from && selectedDateRange.to) {
      filteredWorkflows = filteredWorkflows.filter((w) => {
        const workflowDate = new Date(w.date)
        return workflowDate >= selectedDateRange.from && workflowDate <= selectedDateRange.to
      })
    }

    const fuelCosts = filteredWorkflows.reduce((total, workflow) => {
      const field = fields.find((f) => f.id === workflow.fieldId)
      const equipment = inventory.find((i) => i.name === workflow.equipment)
      if (field && equipment && equipment.fuelConsumption !== "-") {
        const fuelConsumption = Number.parseFloat(equipment.fuelConsumption)
        const fuelCost = field.area * fuelConsumption * workflow.duration * 20 // Assuming 20 TL per liter of fuel
        return total + fuelCost
      }
      return total
    }, 0)

    const irrigationCosts = filteredWorkflows.reduce((total, workflow) => {
      if (workflow.operation === "Sulama" && workflow.waterAmount) {
        const field = fields.find((f) => f.id === workflow.fieldId)
        if (field) {
          const well = wells.find((w) => w.id === field.wellId)
          if (well) {
            const relevantInvoice = well.invoices.find(
              (inv) => workflow.date >= inv.startDate && workflow.date <= inv.endDate,
            )
            if (relevantInvoice) {
              const costPerCubicMeter = relevantInvoice.amount / 1000 // Assuming the invoice amount is for 1000 cubic meters
              return total + workflow.waterAmount * costPerCubicMeter
            }
          }
        }
      }
      return total
    }, 0)

    return { fuelCosts, irrigationCosts }
  }, [selectedField, selectedDateRange])

  return (
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-pink title-glow">Finansal Yönetim</h1>

        <div className="flex justify-between items-center mb-6">
          <Select value={selectedField} onValueChange={setSelectedField}>
            <SelectTrigger className="w-[200px] bg-gray-800 text-neon-green border-neon-green">
              <SelectValue placeholder="Tarla Seçin" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
              <SelectItem value="all">Tüm Tarlalar</SelectItem>
              {fields.map((field) => (
                <SelectItem key={field.id} value={field.id.toString()}>
                  {field.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  "bg-gray-800 border-2 border-neon-blue text-neon-green",
                  "hover:bg-gray-700 hover:border-neon-pink hover:text-neon-pink",
                  "transition-all duration-300",
                  !selectedDateRange && "text-neon-blue",
                )}
              >
                <CalendarIcon className="mr-2 h-5 w-5 text-neon-pink" />
                <span className="glow-text-subtle">
                  {selectedDateRange?.from ? (
                    selectedDateRange.to ? (
                      <>
                        {format(selectedDateRange.from, "dd MMM yyyy")} - {format(selectedDateRange.to, "dd MMM yyyy")}
                      </>
                    ) : (
                      format(selectedDateRange.from, "dd MMM yyyy")
                    )
                  ) : (
                    "Tarih Aralığı Seçin"
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={selectedDateRange?.from}
                selected={selectedDateRange}
                onSelect={setSelectedDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-2 border-neon-blue shadow-lg hover:shadow-neon-blue transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-neon-pink">Yakıt Maliyetleri</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-neon-green">
                {financialData.fuelCosts.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-2 border-neon-blue shadow-lg hover:shadow-neon-blue transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-neon-pink">Sulama Maliyetleri</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-neon-green">
                {financialData.irrigationCosts.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-2 border-neon-blue shadow-lg hover:shadow-neon-blue transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-neon-pink">Detaylı Maliyet Tablosu</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-neon-blue">Tarla</TableHead>
                  <TableHead className="text-neon-blue">İşlem</TableHead>
                  <TableHead className="text-neon-blue">Tarih</TableHead>
                  <TableHead className="text-neon-blue">Ekipman</TableHead>
                  <TableHead className="text-neon-blue">Yakıt Maliyeti</TableHead>
                  <TableHead className="text-neon-blue">Sulama Maliyeti</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workflows
                  .filter((w) => selectedField === "all" || w.fieldId.toString() === selectedField)
                  .filter((w) => {
                    if (!selectedDateRange.from || !selectedDateRange.to) return true
                    return w.date >= selectedDateRange.from && w.date <= selectedDateRange.to
                  })
                  .map((workflow) => {
                    const field = fields.find((f) => f.id === workflow.fieldId)
                    const equipment = inventory.find((i) => i.name === workflow.equipment)
                    let fuelCost = 0
                    let irrigationCost = 0

                    if (field && equipment && equipment.fuelConsumption !== "-") {
                      const fuelConsumption = Number.parseFloat(equipment.fuelConsumption)
                      fuelCost = field.area * fuelConsumption * workflow.duration * 20 // Assuming 20 TL per liter of fuel
                    }

                    if (workflow.operation === "Sulama" && workflow.waterAmount) {
                      const well = wells.find((w) => w.id === field?.wellId)
                      if (well) {
                        const relevantInvoice = well.invoices.find(
                          (inv) => workflow.date >= inv.startDate && workflow.date <= inv.endDate,
                        )
                        if (relevantInvoice) {
                          const costPerCubicMeter = relevantInvoice.amount / 1000 // Assuming the invoice amount is for 1000 cubic meters
                          irrigationCost = workflow.waterAmount * costPerCubicMeter
                        }
                      }
                    }

                    return (
                      <TableRow key={workflow.id}>
                        <TableCell className="text-neon-green">{field?.name}</TableCell>
                        <TableCell className="text-neon-yellow">{workflow.operation}</TableCell>
                        <TableCell className="text-neon-cyan">{format(workflow.date, "dd.MM.yyyy")}</TableCell>
                        <TableCell className="text-neon-purple">{workflow.equipment}</TableCell>
                        <TableCell className="text-neon-pink">
                          {fuelCost.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                        </TableCell>
                        <TableCell className="text-neon-pink">
                          {irrigationCost.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
  )
}

