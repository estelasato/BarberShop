import type React from "react"
import { useLocation, Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  Users,
  Home,
  Map,
  MapPin,
  Globe,
  Briefcase,
  ShoppingBag,
  Package,
  CreditCard,
  Wallet,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"

type SidebarProps = { isOpen: boolean }

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  submenu?: NavItem[]
}

const navItems: NavItem[] = [
  // { title: "Dashboard", href: "/", icon: <Home className="h-5 w-5" /> },
  {
    title: "Localização",
    href: "#",
    icon: <Globe className="h-5 w-5" />,
    submenu: [
      { title: "Países", href: "/paises", icon: <Globe className="h-4 w-4" /> },
      { title: "Estados", href: "/estados", icon: <Map className="h-4 w-4" /> },
      { title: "Cidades", href: "/cidades", icon: <MapPin className="h-4 w-4" /> },
    ],
  },
  { title: "Produtos", href: "/produtos", icon: <Package className="h-5 w-5" /> },
  { title: "Funcionários", href: "/funcionarios", icon: <Briefcase className="h-5 w-5" /> },
  { title: "Clientes", href: "/clientes", icon: <Users className="h-5 w-5" /> },
  { title: "Fornecedores", href: "/fornecedores", icon: <ShoppingBag className="h-5 w-5" /> },
  { title: "Condições de Pagamento", href: "/condicoes-pagamento", icon: <CreditCard className="h-5 w-5" /> },
  { title: "Formas de Pagamento", href: "/formas-pagamento", icon: <Wallet className="h-5 w-5" /> },
  // { title: "Configurações", href: "/configuracoes", icon: <Settings className="h-5 w-5" /> },
]

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = useLocation().pathname
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  return (
    <aside className={cn("border-r bg-background transition-all", isOpen ? "w-60" : "w-0 overflow-hidden")}>
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="text-xl">Barbearia</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2 text-sm">
            {navItems.map((item) => (
              <div key={item.title}>
                {item.submenu ? (
                  <div className="space-y-1">
                    <button
                      onClick={() => setOpenSubmenu(openSubmenu === item.title ? null : item.title)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground",
                        "text-muted-foreground",
                      )}
                    >
                      <div className="flex items-center gap-3">{item.icon}{item.title}</div>
                      {openSubmenu === item.title ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                    {openSubmenu === item.title && (
                      <div className="ml-4 space-y-1 border-l pl-4">
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.title}
                            to={sub.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground",
                              pathname === sub.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                            )}
                          >
                            {sub.icon}{sub.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    )}
                  >
                    {item.icon}{item.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  )
}
