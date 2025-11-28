import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nöbet Takip Sistemi",
  description: "Personel nöbet programlarını kolayca yönetin",
  generator: "ilyasbozdemir.dev",
  applicationName: "Nöbet Takip Sistemi",
  authors: [{ name: "İlyas Bozdemir", url: "https://ilyasbozdemir.dev" }],
  keywords: [
    "nöbet",
    "nöbet takip",
    "personel yönetimi",
    "nöbet programı",
    "iş gücü planlama",
    "çalışan takibi",
    "nöbet çizelgesi",
    "nöbet yönetim sistemi",
    "personel nöbet planlama",
    "nöbet takibi uygulaması",
  ],    
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
