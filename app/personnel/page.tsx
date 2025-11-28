"use client"

import { CardHeader } from "@/components/ui/card"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Users } from "lucide-react"
import { getPersonnel, addPersonnel, deletePersonnel, type Personnel } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import { AppSidebar } from "@/components/app-sidebar"

export default function PersonnelPage() {
  const [personnel, setPersonnel] = useState<Personnel[]>([])
  const [newName, setNewName] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    setPersonnel(getPersonnel())
  }, [])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen personel adı girin",
      })
      return
    }

    addPersonnel(newName.trim())
    setPersonnel(getPersonnel())
    setNewName("")
    toast({
      title: "Başarılı",
      description: `${newName} personel listesine eklendi`,
    })
  }

  const handleDelete = (id: string, name: string) => {
    deletePersonnel(id)
    setPersonnel(getPersonnel())
    toast({
      title: "Silindi",
      description: `${name} personel listesinden çıkarıldı`,
    })
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 p-4 pt-16 lg:ml-64 lg:p-8 lg:pt-8">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-bold text-foreground mb-2 lg:text-3xl">Personel Yönetimi</h1>
          <p className="text-muted-foreground mb-6 text-sm lg:mb-8 lg:text-base">
            Personel listesini görüntüleyin ve düzenleyin
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Yeni Personel Ekle</CardTitle>
              <CardDescription>Nöbet tutacak personeli listeye ekleyin</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdd} className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="name" className="sr-only">
                    Personel Adı
                  </Label>
                  <Input
                    id="name"
                    placeholder="Örn: Ahmet Yılmaz"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <Button type="submit" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ekle
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold text-foreground">Personel Listesi ({personnel.length})</h2>
            </div>

            {personnel.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Henüz personel eklenmemiş. Yukarıdaki formdan personel ekleyebilirsiniz.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {personnel.map((person) => (
                  <Card key={person.id}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{person.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Eklendi: {new Date(person.createdAt).toLocaleDateString("tr-TR")}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(person.id, person.name)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
