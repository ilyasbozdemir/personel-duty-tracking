"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Download, FileSpreadsheet } from "lucide-react"
import { getDutyEntries, addImage, type DutyEntry } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import { AppSidebar } from "@/components/app-sidebar"
import * as XLSX from "xlsx"

export default function ExportPage() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [entries, setEntries] = useState<DutyEntry[]>([])
  const [previewData, setPreviewData] = useState<any[][]>([])
  const { toast } = useToast()

  useEffect(() => {
    const allEntries = getDutyEntries()
    setEntries(allEntries)
  }, [])

  const generatePreviewData = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Hata",
        description: "Lütfen tarih aralığı seçin",
        variant: "destructive",
      })
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    // Filter entries by date range
    const filteredEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.date)
      return entryDate >= start && entryDate <= end
    })

    // Group by date
    const groupedByDate: Record<string, DutyEntry[]> = {}
    filteredEntries.forEach((entry) => {
      if (!groupedByDate[entry.date]) {
        groupedByDate[entry.date] = []
      }
      groupedByDate[entry.date].push(entry)
    })

    // Sort dates
    const sortedDates = Object.keys(groupedByDate).sort()

    // Build preview data
    const preview: any[][] = []

    sortedDates.forEach((date) => {
      const dateObj = new Date(date)
      const dayNames = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"]
      const dayName = dayNames[dateObj.getDay()]
      const formattedDate = dateObj.toLocaleDateString("tr-TR")

      // Add date header
      preview.push([`${formattedDate} ${dayName.toUpperCase()}`])
      preview.push(["GÖREV", "PERSONEL"])

      // Add entries for this date
      groupedByDate[date].forEach((entry) => {
        preview.push([entry.dutyTypeName, entry.personnelName])
      })

      // Add empty row between dates
      preview.push([])
    })

    setPreviewData(preview)
  }

  const generateExcel = () => {
    if (previewData.length === 0) {
      toast({
        title: "Hata",
        description: "Önce önizleme oluşturun",
        variant: "destructive",
      })
      return
    }

    // Create workbook
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(previewData)

    // Set column widths
    ws["!cols"] = [{ wch: 30 }, { wch: 30 }]

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Nöbet Çizelgesi")

    // Generate file name
    const fileName = `nobet-cizelgesi-${startDate}-${endDate}.xlsx`

    // Download
    XLSX.writeFile(wb, fileName)

    // Also save as image to localStorage
    saveAsImage()

    toast({
      title: "Başarılı",
      description: "Excel dosyası indirildi ve medyaya kaydedildi",
    })
  }

  const saveAsImage = async () => {
    try {
      // Create HTML table from preview data
      const table = document.createElement("table")
      table.style.borderCollapse = "collapse"
      table.style.fontFamily = "Arial, sans-serif"
      table.style.fontSize = "14px"
      table.style.backgroundColor = "white"
      table.style.color = "black"

      previewData.forEach((row, rowIndex) => {
        const tr = document.createElement("tr")
        row.forEach((cell) => {
          const td = document.createElement("td")
          td.textContent = cell || ""
          td.style.border = "1px solid #ddd"
          td.style.padding = "8px"

          // Style headers
          if (rowIndex % previewData.length === 0 || cell === "GÖREV" || cell === "PERSONEL") {
            td.style.fontWeight = "bold"
            td.style.backgroundColor = "#f0f0f0"
          }

          tr.appendChild(td)
        })
        table.appendChild(tr)
      })

      // Convert table to canvas
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas size
      canvas.width = 800
      canvas.height = previewData.length * 30 + 50

      // Draw white background
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw table content
      ctx.fillStyle = "black"
      ctx.font = "14px Arial"

      let y = 20
      previewData.forEach((row) => {
        let x = 20
        row.forEach((cell) => {
          ctx.fillText(cell || "", x, y)
          x += 400
        })
        y += 30
      })

      // Convert to data URL
      const dataUrl = canvas.toDataURL("image/png")

      // Save to localStorage
      addImage(dataUrl, `Nöbet Çizelgesi ${startDate} - ${endDate}`)
    } catch (error) {
      console.error("Error saving image:", error)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 p-4 pt-16 lg:ml-64 lg:p-8 lg:pt-8">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-bold text-foreground mb-2 lg:text-3xl">Excel Çizelge Oluştur</h1>
          <p className="text-muted-foreground mb-6 text-sm lg:mb-8 lg:text-base">
            Nöbet kayıtlarınızı Excel formatında dışa aktarın
          </p>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  Tarih Aralığı Seçin
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Bitiş Tarihi</Label>
                    <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={generatePreviewData} className="flex-1 sm:flex-none">
                    <Calendar className="mr-2 h-4 w-4" />
                    Önizleme Oluştur
                  </Button>
                  <Button
                    onClick={generateExcel}
                    disabled={previewData.length === 0}
                    variant="secondary"
                    className="flex-1 sm:flex-none"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Excel İndir
                  </Button>
                </div>
              </CardContent>
            </Card>

            {previewData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Önizleme</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <tbody>
                        {previewData.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td
                                key={cellIndex}
                                className={`border border-border p-2 ${
                                  cell === "GÖREV" || cell === "PERSONEL" || rowIndex % 10 === 0
                                    ? "font-bold bg-muted"
                                    : ""
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
