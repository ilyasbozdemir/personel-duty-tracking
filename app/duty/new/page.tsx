"use client"

import type React from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { getPersonnel, getDutyTypes, addDutyEntry, type Personnel, type DutyType } from "@/lib/storage"
import { Search, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NewDutyPage() {
  const [date, setDate] = useState("")
  const [dateEnd, setDateEnd] = useState("")
  const [isDateRange, setIsDateRange] = useState(false)
  const [customDay, setCustomDay] = useState("")

  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null)
  const [selectedDutyType, setSelectedDutyType] = useState<DutyType | null>(null)

  const [personnelList, setPersonnelList] = useState<Personnel[]>([])
  const [dutyTypeList, setDutyTypeList] = useState<DutyType[]>([])

  const [personnelSearch, setPersonnelSearch] = useState("")
  const [dutyTypeSearch, setDutyTypeSearch] = useState("")
  const [showPersonnelDropdown, setShowPersonnelDropdown] = useState(false)
  const [showDutyTypeDropdown, setShowDutyTypeDropdown] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    setPersonnelList(getPersonnel())
    setDutyTypeList(getDutyTypes())
  }, [])

  const filteredPersonnel = personnelList.filter((p) => p.name.toLowerCase().includes(personnelSearch.toLowerCase()))

  const filteredDutyTypes = dutyTypeList.filter((d) => d.name.toLowerCase().includes(dutyTypeSearch.toLowerCase()))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !customDay || !selectedPersonnel || !selectedDutyType) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen tüm alanları doldurun",
      })
      return
    }

    if (isDateRange && !dateEnd) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen bitiş tarihini girin",
      })
      return
    }

    addDutyEntry(
      date,
      customDay,
      selectedPersonnel.id,
      selectedPersonnel.name,
      selectedDutyType.id,
      selectedDutyType.name,
      isDateRange ? dateEnd : undefined,
    )

    toast({
      title: "Başarılı",
      description: "Nöbet kaydı eklendi",
    })

    setDate("")
    setDateEnd("")
    setCustomDay("")
    setSelectedPersonnel(null)
    setSelectedDutyType(null)
    setPersonnelSearch("")
    setDutyTypeSearch("")
    setIsDateRange(false)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 p-4 pt-16 lg:ml-64 lg:p-8 lg:pt-8">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold text-foreground mb-2 lg:text-3xl">Yeni Nöbet Tanımla</h1>
          <p className="text-muted-foreground mb-6 text-sm lg:mb-8 lg:text-base">Nöbet kaydı ekleyin</p>

          <Card>
            <CardHeader>
              <CardTitle>Nöbet Bilgileri</CardTitle>
              <CardDescription>Personel ve görev bilgilerini arama ile seçin</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Tarih Türü</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="dateType"
                        checked={!isDateRange}
                        onChange={() => setIsDateRange(false)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">Tek Gün</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="dateType"
                        checked={isDateRange}
                        onChange={() => setIsDateRange(true)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">Tarih Aralığı</span>
                    </label>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">{isDateRange ? "Başlangıç Tarihi" : "Tarih"}</Label>
                    <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                  </div>

                  {isDateRange && (
                    <div className="space-y-2">
                      <Label htmlFor="dateEnd">Bitiş Tarihi</Label>
                      <Input
                        id="dateEnd"
                        type="date"
                        value={dateEnd}
                        onChange={(e) => setDateEnd(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customDay">Gün Açıklaması</Label>
                  <Input
                    id="customDay"
                    type="text"
                    placeholder="Örn: Cumartesi, Pazar, Resmi Tatil, Bayram"
                    value={customDay}
                    onChange={(e) => setCustomDay(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Hafta sonu, resmi tatil veya herhangi bir açıklama girebilirsiniz
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personnel">Personel</Label>
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="personnel"
                        type="text"
                        placeholder="Personel ara..."
                        value={personnelSearch}
                        onChange={(e) => {
                          setPersonnelSearch(e.target.value)
                          setShowPersonnelDropdown(true)
                        }}
                        onFocus={() => setShowPersonnelDropdown(true)}
                        className="pl-9"
                      />
                    </div>

                    {showPersonnelDropdown && filteredPersonnel.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredPersonnel.map((person) => (
                          <button
                            key={person.id}
                            type="button"
                            onClick={() => {
                              setSelectedPersonnel(person)
                              setPersonnelSearch(person.name)
                              setShowPersonnelDropdown(false)
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            {person.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedPersonnel && (
                    <p className="text-sm text-muted-foreground">
                      Seçilen: <span className="font-medium text-foreground">{selectedPersonnel.name}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dutyType">Görev Türü</Label>
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="dutyType"
                        type="text"
                        placeholder="Görev türü ara..."
                        value={dutyTypeSearch}
                        onChange={(e) => {
                          setDutyTypeSearch(e.target.value)
                          setShowDutyTypeDropdown(true)
                        }}
                        onFocus={() => setShowDutyTypeDropdown(true)}
                        className="pl-9"
                      />
                    </div>

                    {showDutyTypeDropdown && filteredDutyTypes.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredDutyTypes.map((dutyType) => (
                          <button
                            key={dutyType.id}
                            type="button"
                            onClick={() => {
                              setSelectedDutyType(dutyType)
                              setDutyTypeSearch(dutyType.name)
                              setShowDutyTypeDropdown(false)
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            {dutyType.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedDutyType && (
                    <p className="text-sm text-muted-foreground">
                      Seçilen: <span className="font-medium text-foreground">{selectedDutyType.name}</span>
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Nöbet Kaydı Ekle
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
