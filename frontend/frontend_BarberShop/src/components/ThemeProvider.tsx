"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme
    return (localStorage.getItem(storageKey) as Theme) || defaultTheme
  })

  // Atualiza o <html class="..."> corretamente
  useEffect(() => {
    const root = document.documentElement
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const resolvedTheme = theme === "system" ? (systemDark ? "dark" : "light") : theme

    root.classList.remove("light", "dark")
    root.classList.add(resolvedTheme)

    // opcional: pode remover, o `data-theme` não tem função aqui
    root.removeAttribute("data-theme")

    localStorage.setItem(storageKey, theme)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeProviderContext)
  if (!context) throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
