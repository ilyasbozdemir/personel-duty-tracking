"use client"

import type React from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { getImages, addImage, deleteImage, type UploadedImage } from "@/lib/storage"
import { Trash2, ImageIcon } from "lucide-react"
import Image from "next/image"

export default function MediaPage() {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [description, setDescription] = useState("")
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    setImages(getImages())
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    const reader = new FileReader()
    reader.onloadend = () => {
      const dataUrl = reader.result as string
      addImage(dataUrl, description)
      setImages(getImages())
      setDescription("")
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleDelete = (id: string) => {
    if (confirm("Bu görseli silmek istediğinizden emin misiniz?")) {
      deleteImage(id)
      setImages(getImages())
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 p-4 pt-16 lg:ml-64 lg:p-8 lg:pt-8">
        <h1 className="text-2xl font-bold text-foreground mb-2 lg:text-3xl">Medya ve Görseller</h1>
        <p className="text-muted-foreground mb-6 text-sm lg:mb-8 lg:text-base">
          Nöbet programı görsellerini yükleyin ve görüntüleyin
        </p>

        <div className="grid gap-4 lg:gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Görsel Yükle</CardTitle>
              <CardDescription>Nöbet programı fotoğrafını yükleyin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Açıklama (Opsiyonel)</Label>
                <Textarea
                  id="description"
                  placeholder="Bu görsel hakkında not ekleyin..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Görsel Seç</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="flex-1"
                  />
                  {uploading && <span className="text-sm text-muted-foreground">Yükleniyor...</span>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Yükleme Bilgisi</CardTitle>
              <CardDescription>Görselleriniz tarayıcıda saklanır</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Toplam görsel: <span className="font-medium text-foreground">{images.length}</span>
                </p>
                <p>Veriler localStorage kullanılarak saklanır</p>
                <p>Tarayıcı önbelleğini temizlerseniz görseller silinir</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 lg:mt-8">
          <h2 className="text-xl font-bold mb-4">Yüklenen Görseller</h2>

          {images.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Henüz görsel yüklenmemiş</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:gap-6 lg:grid-cols-3">
              {images.map((img) => (
                <Card key={img.id}>
                  <CardContent className="p-4">
                    <div className="relative aspect-video mb-3 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={img.dataUrl || "/placeholder.svg"}
                        alt={img.description || "Nöbet programı"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {img.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{img.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(img.uploadedAt).toLocaleDateString("tr-TR")}
                      </span>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(img.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
