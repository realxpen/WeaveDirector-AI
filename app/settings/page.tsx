import Link from "next/link"
import {
  ArrowLeft,
  Bell,
  CreditCard,
  Eye,
  Shield,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

const menuItems = [
  { label: "Account", icon: User, active: true },
  { label: "Notifications", icon: Bell, active: false },
  { label: "Appearance", icon: Eye, active: false },
  { label: "Billing", icon: CreditCard, active: false },
  { label: "Security", icon: Shield, active: false },
]

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#02040b] text-zinc-100">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
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
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm ${
                    item.active
                      ? "bg-indigo-200/10 text-zinc-100"
                      : "text-zinc-400 hover:bg-indigo-200/5 hover:text-zinc-200"
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-[760px] space-y-8">
            <section className="space-y-3">
              <h1 className="text-4xl font-semibold">Account Settings</h1>
              <Card className="border-indigo-200/12 bg-[#0a0f1d]/90">
                <CardContent className="space-y-4 p-4">
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-300">Display Name</label>
                    <Input defaultValue="Creative Director" className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-300">Email Address</label>
                    <Input defaultValue="director@agency.com" className="h-8 text-xs" />
                  </div>
                  <div className="border-t border-indigo-200/10 pt-3">
                    <Button variant="primary" size="sm" className="h-8 text-xs">
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="space-y-3">
              <h2 className="text-4xl font-semibold">Notifications</h2>
              <Card className="border-indigo-200/12 bg-[#0a0f1d]/90">
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">Email Notifications</p>
                      <p className="text-xs text-zinc-400">Receive emails about your campaign generations.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">Marketing Updates</p>
                      <p className="text-xs text-zinc-400">Receive emails about new features and tips.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="space-y-3">
              <h2 className="text-4xl font-semibold text-rose-400">Danger Zone</h2>
              <Card className="border-rose-400/35 bg-rose-950/20">
                <CardContent className="space-y-3 p-4">
                  <div>
                    <p className="text-sm font-semibold text-rose-200">Delete Account</p>
                    <p className="text-xs text-rose-300/80">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                  </div>
                  <Button variant="destructive" size="sm" className="h-8 text-xs">
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

