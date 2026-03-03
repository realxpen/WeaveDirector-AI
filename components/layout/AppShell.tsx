"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PlusSquare, Settings, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type AppShellProps = {
  children: React.ReactNode
  rightPanel?: React.ReactNode
}

const navItems = [
  { href: "/studio", label: "New Campaign", icon: Sparkles },
  { href: "/sessions", label: "Sessions", icon: PlusSquare },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function AppShell({ children, rightPanel }: AppShellProps) {
  const pathname = usePathname()

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[220px_1fr] xl:grid-cols-[220px_1fr_300px]">
      <aside className="hidden border-r border-indigo-200/10 bg-[#080d18]/85 p-4 md:block">
        <Link href="/" className="mb-8 flex items-center gap-2 px-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg border border-indigo-300/25 bg-indigo-400/10">
            <Sparkles className="h-4 w-4 text-blue-300" />
          </div>
          <div>
            <p className="text-sm font-semibold">WeaveDirector</p>
            <p className="text-xs text-zinc-500">Creative Storyteller</p>
          </div>
        </Link>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href}>
              {(() => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(`${item.href}/`))
                return (
              <Button
                variant={active ? "secondary" : "ghost"}
                className={cn("w-full justify-start", active && "border-indigo-300/30")}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
                )
              })()}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="min-w-0">{children}</main>

      <aside className="hidden border-l border-indigo-200/10 bg-[#080d18]/85 p-5 xl:block">{rightPanel}</aside>
    </div>
  )
}
