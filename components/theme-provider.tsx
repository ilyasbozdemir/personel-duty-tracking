"use client"

import * as React from "react"

type Theme = "light" | "dark"

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>("dark")

  React.useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null
    if (stored && (stored === "light" || stored === "dark")) {
      setTheme(stored)
      document.documentElement.classList.remove("dark", "light")
      document.documentElement.classList.add(stored)
    } else {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = React.useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "dark" ? "light" : "dark"
      localStorage.setItem("theme", newTheme)
      document.documentElement.classList.remove("dark", "light")
      document.documentElement.classList.add(newTheme)
      return newTheme
    })
  }, [])

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
