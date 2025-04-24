import { useState } from "react"
import type React from "react"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Sidebar } from "@/components/Sidebar"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div lang="pt-BR" className="min-h-screen">
      <ThemeProvider defaultTheme="system">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSidebarOpen(prev => !prev)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Alternar menu</span>
            </Button>
            <div className="flex flex-1 items-center justify-between">
              <Header />
            </div>
          </header>
          <div className="flex flex-1">
            <Sidebar isOpen={isSidebarOpen} />
            <main className="flex-1 overflow-y-auto transition-all">{children}</main>
          </div>
        </div>
      </ThemeProvider>
    </div>
  )
}
