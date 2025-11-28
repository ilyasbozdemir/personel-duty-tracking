"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  FileImage,
  ListPlus,
  Users,
  Briefcase,
  BarChart3,
  Calendar,
  Menu,
  X,
  Moon,
  Sun,
  FileSpreadsheet,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

const menuItems = [
  { href: "/", label: "Ana Sayfa", icon: Home },
  { href: "/duty/new", label: "Yeni Nöbet", icon: ListPlus },
  { href: "/personnel", label: "Personel", icon: Users },
  { href: "/duty-types", label: "Görev Türleri", icon: Briefcase },
  { href: "/stats", label: "İstatistikler", icon: BarChart3 },
  { href: "/records", label: "Nöbet Kayıtları", icon: Calendar },
  { href: "/export", label: "Excel Çizelge", icon: FileSpreadsheet },
  { href: "/media", label: "Medya/Görseller", icon: FileImage },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 flex items-center justify-center rounded-lg bg-card p-2 shadow-lg lg:hidden"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsOpen(false)} />}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-sidebar-border p-6 pt-16 lg:pt-6">
            <h2 className="text-lg font-bold text-sidebar-foreground">Nöbet Takip</h2>
            <p className="text-sm text-muted-foreground">Sistemi</p>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-sidebar-border p-4 space-y-3">
            <Button variant="outline" size="sm" onClick={toggleTheme} className="w-full gap-2 bg-transparent">
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4" />
                  Açık Tema
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  Koyu Tema
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">localStorage ile çalışır</p>
          </div>
        </div>
      </aside>
    </>
  )
}
