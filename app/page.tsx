"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, Briefcase, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { getPersonnel, getDutyTypes, getDutyEntries } from "@/lib/storage"

export default function HomePage() {
  const [stats, setStats] = useState({
    totalPersonnel: 0,
    totalDutyTypes: 0,
    totalEntries: 0,
    thisMonth: 0,
  })

  useEffect(() => {
    const personnel = getPersonnel()
    const dutyTypes = getDutyTypes()
    const entries = getDutyEntries()

    const now = new Date()
    const thisMonthEntries = entries.filter((e) => {
      const entryDate = new Date(e.date)
      return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear()
    })

    setStats({
      totalPersonnel: personnel.length,
      totalDutyTypes: dutyTypes.length,
      totalEntries: entries.length,
      thisMonth: thisMonthEntries.length,
    })
  }, [])

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 p-4 pt-16 lg:ml-64 lg:p-8 lg:pt-8">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Nöbet Takip Sistemi</h1>
          <p className="text-muted-foreground mt-2 text-sm lg:text-base">
            Personel nöbet programlarını kolayca yönetin ve takip edin
          </p>
        </div>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6 lg:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Personel</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPersonnel}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Görev Türü</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDutyTypes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Nöbet</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEntries}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bu Ay</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.thisMonth}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hoş Geldiniz</CardTitle>
            <CardDescription>Sol menüden işlem yapmak istediğiniz bölümü seçebilirsiniz</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Hızlı İşlemler:</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>
                  Yeni nöbet tanımlamak için <span className="font-medium text-foreground">Yeni Nöbet</span> bölümüne
                  gidin
                </li>
                <li>
                  Personel eklemek için <span className="font-medium text-foreground">Personel</span> bölümünü kullanın
                </li>
                <li>
                  Görev türleri tanımlamak için <span className="font-medium text-foreground">Görev Türleri</span>{" "}
                  bölümünü açın
                </li>
                <li>
                  Nöbet görsellerini yüklemek için <span className="font-medium text-foreground">Medya/Görseller</span>{" "}
                  bölümüne gidin
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
