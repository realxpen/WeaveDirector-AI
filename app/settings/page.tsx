"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SettingsShell } from "@/components/settings/SettingsShell"
import { getSession, updateAccountLocal } from "@/lib/auth"

export default function SettingsPage() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [currentEmail, setCurrentEmail] = useState("")

  useEffect(() => {
    const session = getSession()
    if (!session) {
      router.push("/signin?redirect=/settings")
      return
    }
    setDisplayName(session.name)
    setEmail(session.email)
    setCurrentEmail(session.email)
  }, [router])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(timer)
  }, [toast])

  const onSave = async () => {
    setError(null)
    if (!displayName.trim()) {
      setError("Display name is required.")
      return
    }
    if (!email.includes("@")) {
      setError("Enter a valid email address.")
      return
    }
    setLoading(true)
    try {
      const next = updateAccountLocal(currentEmail, displayName, email)
      setCurrentEmail(next.email)
      setDisplayName(next.name)
      setEmail(next.email)
      setToast("Account settings saved")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save account settings.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SettingsShell active="account" title="Account Settings">
      <Card className="border-indigo-200/12 bg-[#0a0f1d]/90">
        <CardContent className="space-y-4 p-4">
          <div className="space-y-1">
            <label className="text-xs text-zinc-300">Display Name</label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-300">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          {error && <p className="text-xs text-rose-300">{error}</p>}
          <div className="border-t border-indigo-200/10 pt-3">
            <Button variant="primary" size="sm" className="h-8 text-xs" onClick={onSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
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
