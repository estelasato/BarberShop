"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/ThemeProvider"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const html = document.documentElement
    const isDark = html.classList.contains("dark")
    setCurrentTheme(isDark ? "dark" : "light")
  }, [theme])

  const toggle = () => {
    const html = document.documentElement
    const isDark = html.classList.contains("dark")
    const newTheme = isDark ? "light" : "dark"

    html.classList.remove("light", "dark")
    html.classList.add(newTheme)
    localStorage.setItem("vite-ui-theme", newTheme)
    setTheme(newTheme)
    setCurrentTheme(newTheme)
  }

  return (
    <Button variant="outline" size="icon" onClick={toggle}>
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all ${
          currentTheme === "dark" ? "-rotate-90 scale-0" : "rotate-0 scale-100"
        }`}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
          currentTheme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
        }`}
      />
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}
