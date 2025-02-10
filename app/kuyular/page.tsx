"use client"

import { useState } from "react"
import { PlusCircle, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Rastgele fatura tutarı oluşturan yardımcı fonksiyon
const getRandomInvoiceAmount = () => {
  return Math.floor(Math.random() * (300000 - 100000 + 1) + 100000)
}

// Başlangıç kuyu listesi
const initialWells = [
  {
    id: 1,
    name: "Kuyu 1",
    invoices: [
      { startDate: new Date(2023, 0, 1), endDate: new Date(2023, 2, 31), amount: getRandomInvoiceAmount() },
      { startDate: new Date(2023, 3, 1), endDate: new Date(2023, 5, 30), amount: getRandomInvoiceAmount() },
      { startDate: new Date(2023, 6, 1), endDate: new Date(2023, 8, 30), amount: getRandomInvoiceAmount() },
    ],
  },
  {
    id: 2,
    name: "Kuyu 2",
    invoices: [
      { startDate: new Date(2023, 0, 1), endDate: new Date(2023, 2, 31), amount: getRandomInvoiceAmount() },
      { startDate: new Date(2023, 3, 1), endDate: new Date(2023, 5, 30), amount: getRandomInvoiceAmount() },
      { startDate: new Date(2023, 6, 1), endDate: new Date(2023, 8, 30), amount: getRandomInvoiceAmount() },
    ],
  },
]

export default function WellsPage() {
  const [wells, setWells] = useState(initialWells)
  const [editingWell, setEditingWell] = useState(null)
  const [newInvoice, setNewInvoice] = useState({ startDate: new Date(), endDate: new Date(), amount: 0 })

  const handleAddInvoice = (wellId) => {
    const updatedWells = wells.map((well) => {
      if (well.id === wellId) {
        const lastInvoice = well.invoices[well.invoices.length - 1]
        const newStartDate = new Date(lastInvoice.endDate)
        newStartDate.setDate(newStartDate.getDate() + 1)
        const newEndDate = new Date(newStartDate)
        newEndDate.setMonth(newEndDate.getMonth() + 3)
        return {
          ...well,
          invoices: [
            ...well.invoices,
            { startDate: newStartDate, endDate: newEndDate, amount: getRandomInvoiceAmount() },
          ],
        }
      }
      return well
    })
    setWells(updatedWells)
  }

  const handleEditInvoice = (e) => {
    e.preventDefault()
    const updatedWells = wells.map((well) => (well.id === editingWell.id ? editingWell : well))
    setWells(updatedWells)
    setEditingWell(null)
  }

  return (
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-pink title-glow">Kuyu Yönetimi</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wells.map((well) => (
            <Card
              key={well.id}
              className="bg-gray-800 border-2 border-neon-blue shadow-lg hover:shadow-neon-blue transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-neon-pink">{well.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <h3 className="text-neon-green text-lg font-semibold">Faturalar:</h3>
                {well.invoices.map((invoice, index) => (
                  <div key={index} className="text-neon-blue">
                    <p>
                      {format(invoice.startDate, "dd.MM.yyyy")} - {format(invoice.endDate, "dd.MM.yyyy")}
                    </p>
                    <p className="text-neon-yellow">Tutar: {invoice.amount.toLocaleString("tr-TR")} TL</p>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-neon-cyan hover:bg-neon-blue text-black"
                      onClick={() => setEditingWell({ ...well, editingInvoiceIndex: well.invoices.length - 1 })}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Son Faturayı Düzenle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-2 border-neon-blue">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-neon-blue">Fatura Düzenle</DialogTitle>
                    </DialogHeader>
                    {editingWell && (
                      <form onSubmit={handleEditInvoice}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="start-date" className="text-right text-neon-green">
                              Başlangıç Tarihi
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[280px] justify-start text-left font-normal",
                                    !editingWell.invoices[editingWell.editingInvoiceIndex].startDate &&
                                      "text-muted-foreground",
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {editingWell.invoices[editingWell.editingInvoiceIndex].startDate ? (
                                    format(editingWell.invoices[editingWell.editingInvoiceIndex].startDate, "PPP")
                                  ) : (
                                    <span>Tarih Seçin</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={editingWell.invoices[editingWell.editingInvoiceIndex].startDate}
                                  onSelect={(date) =>
                                    setEditingWell({
                                      ...editingWell,
                                      invoices: editingWell.invoices.map((invoice, idx) =>
                                        idx === editingWell.editingInvoiceIndex
                                          ? { ...invoice, startDate: date }
                                          : invoice,
                                      ),
                                    })
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="end-date" className="text-right text-neon-green">
                              Bitiş Tarihi
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[280px] justify-start text-left font-normal",
                                    !editingWell.invoices[editingWell.editingInvoiceIndex].endDate &&
                                      "text-muted-foreground",
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {editingWell.invoices[editingWell.editingInvoiceIndex].endDate ? (
                                    format(editingWell.invoices[editingWell.editingInvoiceIndex].endDate, "PPP")
                                  ) : (
                                    <span>Tarih Seçin</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={editingWell.invoices[editingWell.editingInvoiceIndex].endDate}
                                  onSelect={(date) =>
                                    setEditingWell({
                                      ...editingWell,
                                      invoices: editingWell.invoices.map((invoice, idx) =>
                                        idx === editingWell.editingInvoiceIndex
                                          ? { ...invoice, endDate: date }
                                          : invoice,
                                      ),
                                    })
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right text-neon-green">
                              Tutar (TL)
                            </Label>
                            <Input
                              id="amount"
                              type="number"
                              value={editingWell.invoices[editingWell.editingInvoiceIndex].amount}
                              onChange={(e) =>
                                setEditingWell({
                                  ...editingWell,
                                  invoices: editingWell.invoices.map((invoice, idx) =>
                                    idx === editingWell.editingInvoiceIndex
                                      ? { ...invoice, amount: Number(e.target.value) }
                                      : invoice,
                                  ),
                                })
                              }
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
                <Button
                  className="bg-neon-purple hover:bg-neon-pink text-white"
                  onClick={() => handleAddInvoice(well.id)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Yeni Fatura Ekle
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
  )
}

