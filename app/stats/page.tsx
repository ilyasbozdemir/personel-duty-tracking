"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3 } from "lucide-react"
import { getAllStats } from "@/lib/storage"
import { AppSidebar } from "@/components/app-sidebar"

export default function StatsPage() {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState<number | undefined>(undefined)
  const [stats, setStats] = useState<ReturnType<typeof getAllStats>>([])

  useEffect(() => {
    setStats(getAllStats(year, month))
  }, [year, month])

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)
  const months = [
    { value: 0, label: "Ocak" },
    { value: 1, label: "Şubat" },
    { value: 2, label: "Mart" },
    { value: 3, label: "Nisan" },
    { value: 4, label: "Mayıs" },
    { value: 5, label: "Haziran" },
    { value: 6, label: "Temmuz" },
    { value: 7, label: "Ağustos" },
    { value: 8, label: "Eylül" },
    { value: 9, label: "Ekim" },
    { value: 10, label: "Kasım" },
    { value: 11, label: "Aralık" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 p-4 pt-16 lg:ml-64 lg:p-8 lg:pt-8">
        <div className="max-w-6xl">
          <h1 className="text-2xl font-bold text-foreground mb-2 lg:text-3xl">Nöbet İstatistikleri</h1>
          <p className="text-muted-foreground mb-6 text-sm lg:mb-8 lg:text-base">Personel bazında nöbet raporları</p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Filtreler</CardTitle>
              <CardDescription>İstatistikleri ay ve yıla göre filtreleyin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <Select value={year.toString()} onValueChange={(v) => setYear(Number.parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Yıl seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <Select
                    value={month !== undefined ? month.toString() : "all"}
                    onValueChange={(v) => setMonth(v === "all" ? undefined : Number.parseInt(v))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ay seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Yıl</SelectItem>
                      {months.map((m) => (
                        <SelectItem key={m.value} value={m.value.toString()}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setYear(new Date().getFullYear())
                    setMonth(undefined)
                  }}
                >
                  Sıfırla
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold text-foreground">
                Personel İstatistikleri
                {month !== undefined && ` - ${months[month].label} ${year}`}
                {month === undefined && ` - ${year}`}
              </h2>
            </div>

            {stats.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Henüz personel veya nöbet kaydı bulunmuyor.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {stats.map(({ person, stats: personStats }) => (
                  <Card key={person.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{person.name}</CardTitle>
                      <CardDescription>Toplam Nöbet: {personStats.total}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {personStats.total === 0 ? (
                        <p className="text-sm text-muted-foreground">Bu dönemde nöbet tutmamış</p>
                      ) : (
                        <>
                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-2">Görev Türüne Göre</h4>
                            <div className="space-y-2">
                              {Object.entries(personStats.byDutyType).map(([duty, count]) => (
                                <div key={duty} className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">{duty}</span>
                                  <span className="font-medium text-foreground">{count} nöbet</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-2">Güne Göre</h4>
                            <div className="space-y-2">
                              {Object.entries(personStats.byDay).map(([day, count]) => (
                                <div key={day} className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground capitalize">{day}</span>
                                  <span className="font-medium text-foreground">{count} nöbet</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
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
