import Link from "next/link"
import { ArrowLeft, Bell, CreditCard, Eye, Shield, User } from "lucide-react"

type SettingsShellProps = {
  active: "account" | "notifications" | "appearance" | "billing" | "security"
  title?: string
  children: React.ReactNode
}

const navItems = [
  { key: "account", label: "Account", href: "/settings", icon: User },
  { key: "notifications", label: "Notifications", href: "/settings/notifications", icon: Bell },
  { key: "appearance", label: "Appearance", href: "/settings/appearance", icon: Eye },
  { key: "billing", label: "Billing", href: "/settings/billing", icon: CreditCard },
  { key: "security", label: "Security", href: "/settings/security", icon: Shield },
] as const

export function SettingsShell({ active, title, children }: SettingsShellProps) {
  return (
    <div className="min-h-screen bg-[#02040b] text-zinc-100">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[220px_1fr]">
        <aside className="border-r border-indigo-200/10 bg-[#060913]">
          <div className="border-b border-indigo-200/10 p-4">
            <Link href="/" className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-100">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to home
            </Link>
          </div>

          <div className="p-4">
            <p className="mb-3 text-lg font-semibold">Settings</p>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm ${
                    active === item.key
                      ? "bg-indigo-200/10 text-zinc-100"
                      : "text-zinc-400 hover:bg-indigo-200/5 hover:text-zinc-200"
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className="px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-[760px] space-y-6">
            {title ? <h1 className="text-4xl font-semibold">{title}</h1> : null}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

