"use client"

import { useState } from "react"
import { PlusCircle, Pencil, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format, addHours, set } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Tarla verileri
const fields = [
  { id: 1, name: "Kuzey Tarla", area: 100, crop: "Buğday", wellId: 1, owners: ["Ahmet", "Mehmet"] },
  { id: 2, name: "Güney Bahçe", area: 50, crop: "Mısır", wellId: 2, owners: ["Mehmet", "Ayşe"] },
  { id: 3, name: "Doğu Çayır", area: 75, crop: "Yonca", wellId: 1, owners: ["Ahmet"] },
  { id: 4, name: "Batı Tarla", area: 60, crop: "Arpa", wellId: 2, owners: ["Ayşe"] },
  { id: 5, name: "Merkez Bahçe", area: 40, crop: "Sebze", wellId: 1, owners: ["Ahmet", "Mehmet", "Ayşe"] },
]

// Kuyu verileri
const wells = [
  { id: 1, name: "Kuyu 1" },
  { id: 2, name: "Kuyu 2" },
]

// Sezon verileri
const seasons = [
  { id: 1, name: "2023 İlkbahar", startDate: "2023-03-01", endDate: "2023-05-31" },
  { id: 2, name: "2023 Yaz", startDate: "2023-06-01", endDate: "2023-08-31" },
  { id: 3, name: "2023 Sonbahar", startDate: "2023-09-01", endDate: "2023-11-30" },
]

// Envanter verileri
const inventory = [
  { id: 1, name: "Tümosan 9115", category: "Kalıcı Malzeme", subCategory: "Traktör" },
  { id: 2, name: "Diskaro", category: "Traktör Malzemesi", subCategory: "Tarla İşleme" },
  { id: 3, name: "Holder", category: "Traktör Malzemesi", subCategory: "İlaç Gübre" },
  { id: 4, name: "Römork", category: "Kalıcı Malzeme", subCategory: "Traktör" },
  { id: 5, name: "Kobra", category: "Traktör Malzemesi", subCategory: "Tarla İşleme" },
]

const operations = [
  { id: 1, name: "Sürme" },
  { id: 2, name: "Ekim" },
  { id: 3, name: "İlaçlama" },
  { id: 4, name: "Gübreleme" },
  { id: 5, name: "Hasat" },
  { id: 6, name: "Sulama" },
]

const users = [
  { id: 1, name: "Ahmet", role: "Ortak" },
  { id: 2, name: "Mehmet", role: "Ortak" },
  { id: 3, name: "Ayşe", role: "Ortak" },
  { id: 4, name: "İşçi 1", role: "İşçi" },
  { id: 5, name: "İşçi 2", role: "İşçi" },
  { id: 6, name: "İşçi 3", role: "İşçi" },
  { id: 7, name: "İşçi 4", role: "İşçi" },
]

// Sulama verileri oluşturma fonksiyonunu güncelleyelim
const createIrrigationData = () => {
  const irrigationData = []
  for (let i = 0; i < 15; i++) {
    const field = fields[Math.floor(Math.random() * fields.length)]
    const season = seasons[Math.floor(Math.random() * seasons.length)]
    const date = new Date(
      new Date(season.startDate).getTime() +
        Math.random() * (new Date(season.endDate).getTime() - new Date(season.startDate).getTime()),
    )
    irrigationData.push({
      id: i + 1,
      fieldId: field.id,
      wellId: field.wellId,
      seasonId: season.id,
      date: date,
      duration: Math.floor(Math.random() * 5) + 1, // 1-5 saat arası
      waterAmount: Math.floor(Math.random() * 50) + 50, // 50-100 m³ arası
    })
  }
  return irrigationData
}

const irrigationData = createIrrigationData()

// İş akışı verilerini güncelleyelim
const initialWorkflows = [
  {
    id: 1,
    fieldId: 1,
    operation: "Sürme",
    equipment: "Tümosan 9115",
    assignedUsers: ["İşçi 1", "İşçi 2"],
    date: new Date(2023, 5, 15),
    duration: 4,
    status: "Tamamlandı",
    notes: "İşlem sorunsuz tamamlandı.",
    seasonId: 2,
  },
  {
    id: 2,
    fieldId: 2,
    operation: "Ekim",
    equipment: "Diskaro",
    assignedUsers: ["İşçi 3"],
    date: new Date(2023, 5, 20),
    duration: 6,
    status: "Planlandı",
    notes: "Hava durumuna göre tarih değişebilir.",
    seasonId: 2,
  },
  ...irrigationData.map((irrigation, index) => ({
    id: index + 3,
    fieldId: irrigation.fieldId,
    operation: "Sulama",
    equipment: "Sulama Sistemi",
    assignedUsers: [users[Math.floor(Math.random() * users.length)].name],
    date: irrigation.date,
    duration: irrigation.duration,
    status: "Tamamlandı",
    notes: `${irrigation.waterAmount} m³ su kullanıldı.`,
    waterAmount: irrigation.waterAmount,
    seasonId: irrigation.seasonId,
  })),
]

export default function WorkflowPage() {
  const [workflows, setWorkflows] = useState(initialWorkflows)
  const [newWorkflow, setNewWorkflow] = useState({
    fieldId: "",
    operation: "",
    equipment: "",
    assignedUsers: "",
    date: new Date(),
    duration: 0,
    status: "Planlandı",
    notes: "",
    waterAmount: 0,
    seasonId: "",
    startTime: null,
    endTime: null,
  })
  const [editingWorkflow, setEditingWorkflow] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [operationFilter, setOperationFilter] = useState("all")
  const [fieldFilter, setFieldFilter] = useState("all")
  const [seasonFilter, setSeasonFilter] = useState("all")

  const handleAddWorkflow = (e) => {
    e.preventDefault()
    const workflowToAdd = {
      ...newWorkflow,
      id: workflows.length + 1,
      assignedUsers: newWorkflow.assignedUsers ? [newWorkflow.assignedUsers] : [],
    }
    setWorkflows([...workflows, workflowToAdd])
    setNewWorkflow({
      fieldId: "",
      operation: "",
      equipment: "",
      assignedUsers: "",
      date: new Date(),
      duration: 0,
      status: "Planlandı",
      notes: "",
      waterAmount: 0,
      seasonId: "",
      startTime: null,
      endTime: null,
    })
  }

  const handleEditWorkflow = (e) => {
    e.preventDefault()
    const updatedWorkflows = workflows.map((workflow) =>
      workflow.id === editingWorkflow.id ? editingWorkflow : workflow,
    )
    setWorkflows(updatedWorkflows)
    setEditingWorkflow(null)
  }

  const handleStatusChange = (workflowId, newStatus) => {
    const updatedWorkflows = workflows.map((workflow) =>
      workflow.id === workflowId ? { ...workflow, status: newStatus } : workflow,
    )
    setWorkflows(updatedWorkflows)
  }

  // Filtreleme fonksiyonunu güncelleyelim
  const filteredWorkflows = workflows.filter(
    (workflow) =>
      (fieldFilter === "all" || workflow.fieldId.toString() === fieldFilter) &&
      (seasonFilter === "all" || workflow.seasonId.toString() === seasonFilter) &&
      (statusFilter === "all" || workflow.status === statusFilter) &&
      (operationFilter === "all" || workflow.operation === operationFilter),
  )

  return (
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-pink title-glow">İş Akışı Yönetimi</h1>

        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
          <Input
            type="text"
            placeholder="İş akışı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/3 bg-gray-800 text-neon-blue placeholder-neon-blue/50 border-neon-blue focus:ring-neon-green"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px] bg-gray-800 text-neon-green border-neon-green">
              <SelectValue placeholder="Durum Filtrele" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="Planlandı">Planlandı</SelectItem>
              <SelectItem value="Tamamlandı">Tamamlandı</SelectItem>
              <SelectItem value="İptal Edildi">İptal Edildi</SelectItem>
            </SelectContent>
          </Select>
          <Select value={operationFilter} onValueChange={setOperationFilter}>
            <SelectTrigger className="w-full sm:w-[200px] bg-gray-800 text-neon-green border-neon-green">
              <SelectValue placeholder="İşlem Filtrele" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
              <SelectItem value="all">Tümü</SelectItem>
              {operations.map((operation) => (
                <SelectItem key={operation.id} value={operation.name}>
                  {operation.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={fieldFilter} onValueChange={setFieldFilter}>
            <SelectTrigger className="w-full sm:w-[200px] bg-gray-800 text-neon-green border-neon-green">
              <SelectValue placeholder="Tarla Filtrele" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
              <SelectItem value="all">Tümü</SelectItem>
              {fields.map((field) => (
                <SelectItem key={field.id} value={field.id.toString()}>
                  {field.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={seasonFilter} onValueChange={setSeasonFilter}>
            <SelectTrigger className="w-full sm:w-[200px] bg-gray-800 text-neon-green border-neon-green">
              <SelectValue placeholder="Sezon Filtrele" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
              <SelectItem value="all">Tümü</SelectItem>
              {seasons.map((season) => (
                <SelectItem key={season.id} value={season.id.toString()}>
                  {season.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-neon-purple hover:bg-neon-pink text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Yeni İş Akışı Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-2 border-neon-blue">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-neon-blue">Yeni İş Akışı Ekle</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddWorkflow}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="field" className="text-right text-neon-green">
                      Tarla
                    </Label>
                    <Select
                      value={newWorkflow.fieldId.toString()}
                      onValueChange={(value) => setNewWorkflow({ ...newWorkflow, fieldId: Number(value) })}
                    >
                      <SelectTrigger className="col-span-3 bg-gray-800 text-neon-green border-neon-green">
                        <SelectValue placeholder="Tarla seçin" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
                        {fields.map((field) => (
                          <SelectItem key={field.id} value={field.id.toString()}>
                            {field.name} ({field.area} dekar, {field.crop})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="operation" className="text-right text-neon-green">
                      İşlem
                    </Label>
                    <Select
                      value={newWorkflow.operation}
                      onValueChange={(value) => setNewWorkflow({ ...newWorkflow, operation: value })}
                    >
                      <SelectTrigger className="col-span-3 bg-gray-800 text-neon-green border-neon-green">
                        <SelectValue placeholder="İşlem seçin" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
                        {operations.map((operation) => (
                          <SelectItem key={operation.id} value={operation.name}>
                            {operation.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="equipment" className="text-right text-neon-green">
                      Ekipman
                    </Label>
                    <Select
                      value={newWorkflow.equipment}
                      onValueChange={(value) => setNewWorkflow({ ...newWorkflow, equipment: value })}
                    >
                      <SelectTrigger className="col-span-3 bg-gray-800 text-neon-green border-neon-green">
                        <SelectValue placeholder="Ekipman seçin" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
                        {inventory.map((item) => (
                          <SelectItem key={item.id} value={item.name}>
                            {item.name} ({item.category}, {item.subCategory})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="assignedUsers" className="text-right text-neon-green">
                      Atanan Kullanıcılar
                    </Label>
                    <Select
                      value={newWorkflow.assignedUsers}
                      onValueChange={(value) => setNewWorkflow({ ...newWorkflow, assignedUsers: value })}
                    >
                      <SelectTrigger className="col-span-3 bg-gray-800 text-neon-green border-neon-green">
                        <SelectValue placeholder="Kullanıcı seçin" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.name}>
                            {user.name} ({user.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right text-neon-green">
                      Tarih
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal col-span-3 bg-gray-800 border-neon-blue text-neon-green",
                            !newWorkflow.date && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-neon-pink" />
                          {newWorkflow.date ? (
                            <>
                              {format(newWorkflow.date, "PPP")}
                              {newWorkflow.operation === "Sulama" && newWorkflow.startTime && (
                                <span className="ml-2 text-neon-cyan">{format(newWorkflow.startTime, "HH:mm")}</span>
                              )}
                            </>
                          ) : (
                            <span>Tarih Seçin</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="p-4 bg-gray-900 border border-neon-blue">
                          <Calendar
                            mode="single"
                            selected={newWorkflow.date}
                            onSelect={(date) => setNewWorkflow({ ...newWorkflow, date })}
                            initialFocus
                          />
                          {newWorkflow.operation === "Sulama" && (
                            <div className="mt-4">
                              <Label htmlFor="startTime" className="text-neon-green">
                                Başlangıç Saati
                              </Label>
                              <Input
                                id="startTime"
                                type="time"
                                value={newWorkflow.startTime ? format(newWorkflow.startTime, "HH:mm") : ""}
                                onChange={(e) => {
                                  const [hours, minutes] = e.target.value.split(":")
                                  const startTime = newWorkflow.date
                                    ? set(newWorkflow.date, {
                                        hours: Number.parseInt(hours),
                                        minutes: Number.parseInt(minutes),
                                      })
                                    : null
                                  setNewWorkflow({ ...newWorkflow, startTime })
                                }}
                                className="mt-2 bg-gray-800 text-neon-cyan border-neon-blue"
                              />
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duration" className="text-right text-neon-green">
                      Süre (Saat)
                    </Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Input
                        id="duration"
                        type="number"
                        value={newWorkflow.duration}
                        onChange={(e) => {
                          const duration = Number(e.target.value)
                          let endTime = null
                          if (newWorkflow.startTime && duration) {
                            endTime = addHours(newWorkflow.startTime, duration)
                          }
                          setNewWorkflow({ ...newWorkflow, duration, endTime })
                        }}
                        className="bg-gray-800 text-neon-blue border-neon-blue"
                      />
                      {newWorkflow.operation === "Sulama" && newWorkflow.endTime && (
                        <span className="text-neon-pink">Bitiş: {format(newWorkflow.endTime, "HH:mm")}</span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="season" className="text-right text-neon-green">
                      Sezon
                    </Label>
                    <Select
                      value={newWorkflow.seasonId.toString()}
                      onValueChange={(value) => setNewWorkflow({ ...newWorkflow, seasonId: Number(value) })}
                    >
                      <SelectTrigger className="col-span-3 bg-gray-800 text-neon-green border-neon-green">
                        <SelectValue placeholder="Sezon seçin" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
                        {seasons.map((season) => (
                          <SelectItem key={season.id} value={season.id.toString()}>
                            {season.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {newWorkflow.operation === "Sulama" && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="waterAmount" className="text-right text-neon-green">
                        Su Miktarı (m³)
                      </Label>
                      <Input
                        id="waterAmount"
                        type="number"
                        value={newWorkflow.waterAmount}
                        onChange={(e) => setNewWorkflow({ ...newWorkflow, waterAmount: Number(e.target.value) })}
                        className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right text-neon-green">
                      Notlar
                    </Label>
                    <Textarea
                      id="notes"
                      value={newWorkflow.notes}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, notes: e.target.value })}
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
          {filteredWorkflows.map((workflow) => (
            <Card
              key={workflow.id}
              className="bg-gray-800 border-2 border-neon-blue shadow-lg hover:shadow-neon-blue transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-neon-pink">
                  {fields.find((f) => f.id === workflow.fieldId)?.name} - {workflow.operation}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-neon-blue">
                  Tarla: <span className="text-neon-green">{fields.find((f) => f.id === workflow.fieldId)?.name}</span>
                </p>
                <p className="text-neon-yellow">
                  Kuyu:{" "}
                  <span className="text-neon-cyan">
                    {wells.find((w) => w.id === fields.find((f) => f.id === workflow.fieldId)?.wellId)?.name}
                  </span>
                </p>
                <p className="text-neon-purple">
                  Sezon: <span className="text-neon-pink">{seasons.find((s) => s.id === workflow.seasonId)?.name}</span>
                </p>
                <p className="text-neon-blue">
                  İşlem: <span className="text-neon-green">{workflow.operation}</span>
                </p>
                <p className="text-neon-yellow">
                  Ekipman: <span className="text-neon-cyan">{workflow.equipment}</span>
                </p>
                <p className="text-neon-purple">
                  Atanan Kullanıcılar: <span className="text-neon-pink">{workflow.assignedUsers.join(", ")}</span>
                </p>
                <p className="text-neon-blue">
                  Tarih: <span className="text-neon-green">{format(workflow.date, "dd.MM.yyyy")}</span>
                </p>
                <p className="text-neon-yellow">
                  Süre: <span className="text-neon-cyan">{workflow.duration} saat</span>
                </p>
                {workflow.operation === "Sulama" && (
                  <p className="text-neon-purple">
                    Su Miktarı: <span className="text-neon-pink">{workflow.waterAmount} m³</span>
                  </p>
                )}
                <p className="text-neon-blue">
                  Durum: <span className="text-neon-green">{workflow.status}</span>
                </p>
                <p className="text-neon-yellow">
                  Notlar: <span className="text-neon-cyan">{workflow.notes}</span>
                </p>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full sm:w-auto bg-neon-cyan hover:bg-neon-blue text-black"
                      onClick={() => setEditingWorkflow(workflow)}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Düzenle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-2 border-neon-blue">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-neon-blue">İş Akışı Düzenle</DialogTitle>
                    </DialogHeader>
                    {editingWorkflow && (
                      <form onSubmit={handleEditWorkflow}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-field" className="text-right text-neon-green">
                              Tarla
                            </Label>
                            <Select
                              value={editingWorkflow.fieldId.toString()}
                              onValueChange={(value) =>
                                setEditingWorkflow({ ...editingWorkflow, fieldId: Number(value) })
                              }
                            >
                              <SelectTrigger className="col-span-3 bg-gray-800 text-neon-green border-neon-green">
                                <SelectValue placeholder="Tarla seçin" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
                                {fields.map((field) => (
                                  <SelectItem key={field.id} value={field.id.toString()}>
                                    {field.name} ({field.area} dekar, {field.crop})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-operation" className="text-right text-neon-green">
                              İşlem
                            </Label>
                            <Select
                              value={editingWorkflow.operation}
                              onValueChange={(value) => setEditingWorkflow({ ...editingWorkflow, operation: value })}
                            >
                              <SelectTrigger className="col-span-3 bg-gray-800 text-neon-green border-neon-green">
                                <SelectValue placeholder="İşlem seçin" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
                                {operations.map((operation) => (
                                  <SelectItem key={operation.id} value={operation.name}>
                                    {operation.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-equipment" className="text-right text-neon-green">
                              Ekipman
                            </Label>
                            <Select
                              value={editingWorkflow.equipment}
                              onValueChange={(value) => setEditingWorkflow({ ...editingWorkflow, equipment: value })}
                            >
                              <SelectTrigger className="col-span-3 bg-gray-800 text-neon-green border-neon-green">
                                <SelectValue placeholder="Ekipman seçin" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
                                {inventory.map((item) => (
                                  <SelectItem key={item.id} value={item.name}>
                                    {item.name} ({item.category}, {item.subCategory})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-assignedUsers" className="text-right text-neon-green">
                              Atanan Kullanıcılar
                            </Label>
                            <Select
                              value={editingWorkflow.assignedUsers[0]}
                              onValueChange={(value) =>
                                setEditingWorkflow({ ...editingWorkflow, assignedUsers: [value] })
                              }
                            >
                              <SelectTrigger className="col-span-3 bg-gray-800 text-neon-green border-neon-green">
                                <SelectValue placeholder="Kullanıcı seçin" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
                                {users.map((user) => (
                                  <SelectItem key={user.id} value={user.name}>
                                    {user.name} ({user.role})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-date" className="text-right text-neon-green">
                              Tarih
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[280px] justify-start text-left font-normal col-span-3",
                                    !editingWorkflow.date && "text-muted-foreground",
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {editingWorkflow.date ? (
                                    format(editingWorkflow.date, "PPP")
                                  ) : (
                                    <span>Tarih Seçin</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={editingWorkflow.date}
                                  onSelect={(date) => setEditingWorkflow({ ...editingWorkflow, date })}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-duration" className="text-right text-neon-green">
                              Süre (Saat)
                            </Label>
                            <Input
                              id="edit-duration"
                              type="number"
                              value={editingWorkflow.duration}
                              onChange={(e) =>
                                setEditingWorkflow({ ...editingWorkflow, duration: Number(e.target.value) })
                              }
                              className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-season" className="text-right text-neon-green">
                              Sezon
                            </Label>
                            <Select
                              value={editingWorkflow.seasonId.toString()}
                              onValueChange={(value) =>
                                setEditingWorkflow({ ...editingWorkflow, seasonId: Number(value) })
                              }
                            >
                              <SelectTrigger className="col-span-3 bg-gray-800 text-neon-green border-neon-green">
                                <SelectValue placeholder="Sezon seçin" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
                                {seasons.map((season) => (
                                  <SelectItem key={season.id} value={season.id.toString()}>
                                    {season.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {editingWorkflow.operation === "Sulama" && (
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-waterAmount" className="text-right text-neon-green">
                                Su Miktarı (m³)
                              </Label>
                              <Input
                                id="edit-waterAmount"
                                type="number"
                                value={editingWorkflow.waterAmount}
                                onChange={(e) =>
                                  setEditingWorkflow({ ...editingWorkflow, waterAmount: Number(e.target.value) })
                                }
                                className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                              />
                            </div>
                          )}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-notes" className="text-right text-neon-green">
                              Notlar
                            </Label>
                            <Textarea
                              id="edit-notes"
                              value={editingWorkflow.notes}
                              onChange={(e) => setEditingWorkflow({ ...editingWorkflow, notes: e.target.value })}
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
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                  <Button
                    className="w-full sm:w-auto bg-neon-green hover:bg-neon-blue text-black"
                    onClick={() => handleStatusChange(workflow.id, "Tamamlandı")}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Tamamla
                  </Button>
                  <Button
                    className="w-full sm:w-auto bg-neon-red hover:bg-neon-pink text-white"
                    onClick={() => handleStatusChange(workflow.id, "İptal Edildi")}
                  >
                    <XCircle className="mr-2 h-4 w-4" /> İptal Et
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
  )
}

