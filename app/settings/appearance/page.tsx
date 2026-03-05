"use client"

import { Laptop, Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SettingsShell } from "@/components/settings/SettingsShell"
import { getSession } from "@/lib/auth"
import {
  applyAppearanceToDocument,
  getCurrentUserSettings,
  patchCurrentUserSettings,
  type DensityMode,
  type ThemeMode,
} from "@/lib/user-settings"

function ThemeTile({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-3 text-center ${
        active ? "border-indigo-300/35 bg-indigo-300/10" : "border-indigo-200/12 bg-[#070c18]"
      }`}
    >
      <div className="mb-2 grid h-16 place-items-center rounded-lg border border-indigo-200/10 bg-white/5">
        <Icon className="h-6 w-6 text-zinc-300" />
      </div>
      <p className="text-sm font-semibold text-zinc-100">{label}</p>
    </button>
  )
}

export default function AppearanceSettingsPage() {
  const router = useRouter()
  const [theme, setTheme] = useState<ThemeMode>("dark")
  const [density, setDensity] = useState<DensityMode>("comfortable")
  const [saved, setSaved] = useState<{ theme: ThemeMode; density: DensityMode } | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const session = getSession()
    if (!session) {
      router.push("/signin?redirect=/settings/appearance")
      return
    }
    const settings = getCurrentUserSettings().appearance
    setTheme(settings.theme)
    setDensity(settings.density)
    setSaved(settings)
    applyAppearanceToDocument(settings)
  }, [router])

  useEffect(() => {
    applyAppearanceToDocument({ theme, density })
  }, [theme, density])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(timer)
  }, [toast])

  const onSave = () => {
    patchCurrentUserSettings({ appearance: { theme, density } })
    setSaved({ theme, density })
    setToast("Appearance saved")
  }

  const onReset = () => {
    if (!saved) return
    setTheme(saved.theme)
    setDensity(saved.density)
  }

  return (
    <SettingsShell active="appearance" title="Appearance">
      <Card className="border-indigo-200/12 bg-[#0a0f1d]/90">
        <CardContent className="space-y-6 p-4">
          <section className="space-y-3">
            <p className="text-2xl font-semibold">Theme</p>
            <p className="text-xs text-zinc-400">Select the theme for the application interface.</p>
            <div className="grid gap-3 md:grid-cols-3">
              <ThemeTile label="Dark" icon={Moon} active={theme === "dark"} onClick={() => setTheme("dark")} />
              <ThemeTile label="Light" icon={Sun} active={theme === "light"} onClick={() => setTheme("light")} />
              <ThemeTile
                label="System"
                icon={Laptop}
                active={theme === "system"}
                onClick={() => setTheme("system")}
              />
            </div>
          </section>

          <section className="space-y-3 border-t border-indigo-200/10 pt-5">
            <p className="text-2xl font-semibold">Density</p>
            <p className="text-xs text-zinc-400">Adjust the spacing and density of the interface.</p>
            <div className="flex gap-2">
              <Button
                variant={density === "comfortable" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setDensity("comfortable")}
              >
                Comfortable
              </Button>
              <Button
                variant={density === "compact" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setDensity("compact")}
              >
                Compact
              </Button>
            </div>
          </section>

          <div className="flex items-center justify-end gap-2 border-t border-indigo-200/10 pt-4">
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onReset}>
              Reset
            </Button>
            <Button variant="primary" size="sm" className="h-8 text-xs" onClick={onSave}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {toast && (
        <div className="fixed bottom-4 right-4 rounded-md border border-indigo-200/15 bg-[#0a1020] px-3 py-2 text-xs">
          {toast}
        </div>
      )}
    </SettingsShell>
  )
}
