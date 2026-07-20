import * as React from "react"
import { Link, useLocation } from "wouter"
import { useAppStore } from "@/lib/store"
import { useTheme } from "@/components/theme-provider"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import {
  LayoutDashboard,
  FileText,
  GitBranch,
  BarChart3,
  BrainCircuit,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  Moon,
  Sun,
  Languages,
  LogOut,
  FileBarChart2,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import AssistantWidget from "@/components/AssistantWidget"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppStore()
  const [location] = useLocation()
  const { t, isRTL } = useLanguage()

  const navItems = [
    { href: "/dashboard",  labelKey: "nav.dashboard",     icon: LayoutDashboard },
    { href: "/requests",   labelKey: "nav.requests",      icon: FileText },
    { href: "/workflows",  labelKey: "nav.workflows",     icon: GitBranch },
    { href: "/analytics",  labelKey: "nav.analytics",     icon: BarChart3 },
    { href: "/ai",         labelKey: "nav.aiHub",         icon: BrainCircuit, highlight: true },
    { href: "/reports",    labelKey: "nav.reports",       icon: FileBarChart2 },
    { href: "/notifications", labelKey: "nav.notifications", icon: Bell },
    { href: "/admin",      labelKey: "nav.admin",         icon: Settings },
  ]

  return (
    <aside
      className={`fixed top-0 h-dvh z-50 flex flex-col border-e bg-sidebar text-sidebar-foreground transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-16"
      } start-0`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border shrink-0">
        {sidebarOpen ? (
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
              <GitBranch className="h-4.5 w-4.5" />
            </div>
            <span className="font-bold text-lg tracking-tight">FlowIQ</span>
          </Link>
        ) : (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GitBranch className="h-4.5 w-4.5" />
          </div>
        )}
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="flex flex-col gap-0.5 px-2">
          {navItems.map((item) => {
            const isActive = location.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-sidebar-foreground hover:bg-muted/60"
                } ${!sidebarOpen ? "justify-center px-0" : ""}`}
              >
                <item.icon
                  className={`h-5 w-5 shrink-0 ${
                    item.highlight ? "text-primary" : isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                {sidebarOpen && (
                  <span className={item.highlight ? "text-primary font-semibold" : ""}>
                    {t(item.labelKey)}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Collapse button */}
      <div className="border-t border-sidebar-border p-3 flex justify-end shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-muted-foreground h-8 w-8"
          aria-label="Toggle sidebar"
        >
          {isRTL
            ? (sidebarOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />)
            : (sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)
          }
        </Button>
      </div>
    </aside>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────
export function Header() {
  const { sidebarOpen, toggleSidebar } = useAppStore()
  const { theme, setTheme } = useTheme()
  const { lang, setLang, t } = useLanguage()
  const { user, logout } = useAuth()
  const sidebarW = sidebarOpen ? "start-64" : "start-16"

  const initials = user ? getInitials(user.name) : "?"

  return (
    <header
      className={`fixed top-0 end-0 ${sidebarW} z-40 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur-sm transition-all duration-300`}
    >
      {/* Left: mobile menu toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:hidden h-8 w-8"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-1">
        {/* Language switcher */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          className="gap-1.5 text-xs font-semibold h-8 px-2.5 text-muted-foreground hover:text-foreground"
          aria-label="Switch language"
        >
          <Languages className="h-4 w-4" />
          <span>{lang === 'en' ? 'عربي' : 'EN'}</span>
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label="Toggle theme"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* User + logout */}
        <div className="flex items-center gap-2 ms-1 ps-3 border-s border-border">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold leading-tight">{user?.name ?? ""}</span>
            <span className="text-xs text-muted-foreground leading-tight">{user?.email ?? ""}</span>
          </div>
          <Avatar className="h-8 w-8 ring-2 ring-border">
            <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}

// ─── AppLayout ────────────────────────────────────────────────────────────────
export function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useAppStore()

  return (
    <div className="min-h-dvh bg-background text-foreground flex flex-col">
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            sidebarOpen ? "ms-64" : "ms-16"
          }`}
        >
          <Header />
          <main className="flex-1 p-4 sm:p-6 mt-16 pb-12 w-full max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </div>
      <AssistantWidget />
    </div>
  )
}
