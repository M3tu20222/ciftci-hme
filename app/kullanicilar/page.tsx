"use client"

import { useState } from "react"
import { PlusCircle, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Kullanıcı rolleri
const roles = ["Admin", "Ortak", "İşçi"]

// Başlangıç kullanıcı listesi
const initialUsers = [
  { id: 1, name: "Admin", email: "admin@ciftlik.com", role: "Admin" },
  { id: 2, name: "Ahmet", email: "ahmet@ciftlik.com", role: "Ortak" },
  { id: 3, name: "Mehmet", email: "mehmet@ciftlik.com", role: "Ortak" },
  { id: 4, name: "Ayşe", email: "ayse@ciftlik.com", role: "Ortak" },
  { id: 5, name: "İşçi 1", email: "isci1@ciftlik.com", role: "İşçi" },
  { id: 6, name: "İşçi 2", email: "isci2@ciftlik.com", role: "İşçi" },
  { id: 7, name: "İşçi 3", email: "isci3@ciftlik.com", role: "İşçi" },
  { id: 8, name: "İşçi 4", email: "isci4@ciftlik.com", role: "İşçi" },
]

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [editingUser, setEditingUser] = useState(null)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
  })

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) && (roleFilter === "all" || user.role === roleFilter),
  )

  const handleAddUser = (e) => {
    e.preventDefault()
    const userToAdd = {
      ...newUser,
      id: users.length + 1,
    }
    setUsers([...users, userToAdd])
    setNewUser({
      name: "",
      email: "",
      role: "",
    })
  }

  const handleEditUser = (e) => {
    e.preventDefault()
    const updatedUsers = users.map((user) => (user.id === editingUser.id ? editingUser : user))
    setUsers(updatedUsers)
    setEditingUser(null)
  }

  return (
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-neon-pink title-glow">Kullanıcı Yönetimi</h1>

        <div className="flex justify-between items-center mb-4">
          <Input
            type="text"
            placeholder="Kullanıcı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3 bg-gray-800 text-neon-blue placeholder-neon-blue/50 border-neon-blue focus:ring-neon-green"
          />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[200px] bg-gray-800 text-neon-green border-neon-green">
              <SelectValue placeholder="Rol Filtrele" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
              <SelectItem value="all">Tümü</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-neon-purple hover:bg-neon-pink text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Yeni Kullanıcı Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-2 border-neon-blue">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-neon-blue">Yeni Kullanıcı Ekle</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddUser}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right text-neon-green">
                      İsim
                    </Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right text-neon-green">
                      E-posta
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right text-neon-green">
                      Rol
                    </Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger className="col-span-3 bg-gray-800 text-neon-green border-neon-green">
                        <SelectValue placeholder="Rol seçin" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
          {filteredUsers.map((user) => (
            <Card
              key={user.id}
              className="bg-gray-800 border-2 border-neon-blue shadow-lg hover:shadow-neon-blue transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-neon-pink">{user.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-neon-blue">
                  E-posta: <span className="text-neon-green">{user.email}</span>
                </p>
                <p className="text-neon-yellow">
                  Rol: <span className="text-neon-cyan">{user.role}</span>
                </p>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-neon-cyan hover:bg-neon-blue text-black"
                      onClick={() => setEditingUser(user)}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Düzenle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-2 border-neon-blue">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-neon-blue">Kullanıcı Düzenle</DialogTitle>
                    </DialogHeader>
                    {editingUser && (
                      <form onSubmit={handleEditUser}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right text-neon-green">
                              İsim
                            </Label>
                            <Input
                              id="edit-name"
                              value={editingUser.name}
                              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                              className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-email" className="text-right text-neon-green">
                              E-posta
                            </Label>
                            <Input
                              id="edit-email"
                              type="email"
                              value={editingUser.email}
                              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                              className="col-span-3 bg-gray-800 text-neon-blue border-neon-blue"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-role" className="text-right text-neon-green">
                              Rol
                            </Label>
                            <Select
                              value={editingUser.role}
                              onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                            >
                              <SelectTrigger className="col-span-3 bg-gray-800 text-neon-green border-neon-green">
                                <SelectValue placeholder="Rol seçin" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 text-neon-green border-neon-green">
                                {roles.map((role) => (
                                  <SelectItem key={role} value={role}>
                                    {role}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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

