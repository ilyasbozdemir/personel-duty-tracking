"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Trash2 } from "lucide-react"
import { getDutyEntries, deleteDutyEntry, type DutyEntry } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import { AppSidebar } from "@/components/app-sidebar"

export default function RecordsPage() {
  const [entries, setEntries] = useState<DutyEntry[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const allEntries = getDutyEntries()
    allEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setEntries(allEntries)
  }, [])

  const handleDelete = (id: string, personnelName: string) => {
    deleteDutyEntry(id)
    const allEntries = getDutyEntries()
    allEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setEntries(allEntries)
    toast({
      title: "Silindi",
      description: `${personnelName} için nöbet kaydı silindi`,
    })
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 p-4 pt-16 lg:ml-64 lg:p-8 lg:pt-8">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-bold text-foreground mb-2 lg:text-3xl">Nöbet Kayıtları</h1>
          <p className="text-muted-foreground mb-6 text-sm lg:mb-8 lg:text-base">Tüm nöbet kayıtlarını görüntüleyin</p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground lg:text-xl">Tüm Kayıtlar ({entries.length})</h2>
            </div>

            {entries.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground text-sm">
                  Henüz nöbet kaydı bulunmuyor. Yeni nöbet sayfasından kayıt ekleyebilirsiniz.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {entries.map((entry) => (
                  <Card key={entry.id}>
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-base font-semibold text-foreground lg:text-lg">
                              {entry.personnelName}
                            </span>
                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                              {entry.dutyTypeName}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                            <span className="break-words">
                              {new Date(entry.date).toLocaleDateString("tr-TR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                              {entry.dateEnd && (
                                <>
                                  {" - "}
                                  {new Date(entry.dateEnd).toLocaleDateString("tr-TR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </>
                              )}
                            </span>
                            <span className="capitalize font-medium">{entry.day}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Kaydedildi: {new Date(entry.createdAt).toLocaleString("tr-TR")}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(entry.id, entry.personnelName)}
                          className="text-destructive hover:text-destructive shrink-0"
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
