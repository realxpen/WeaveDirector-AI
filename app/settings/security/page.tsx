"use client"

import { Monitor, Shield } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { SettingsShell } from "@/components/settings/SettingsShell"
import {
  getSession,
  listActiveSessionsForCurrentUser,
  revokeActiveSession,
  updatePasswordLocal,
  type ActiveSession,
} from "@/lib/auth"
import { getCurrentUserSettings, patchCurrentUserSettings } from "@/lib/user-settings"

export default function SecuritySettingsPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [sessions, setSessions] = useState<ActiveSession[]>([])
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const session = getSession()
    if (!session) {
      router.push("/signin?redirect=/settings/security")
      return
    }
    setEmail(session.email)
    setSessions(listActiveSessionsForCurrentUser())
    const settings = getCurrentUserSettings()
    setTwoFactorEnabled(settings.security.twoFactorEnabled)
  }, [router])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(timer)
  }, [toast])

  const onUpdatePassword = () => {
    setError(null)
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Fill all password fields.")
      return
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.")
      return
    }
    try {
      updatePasswordLocal(email, currentPassword, newPassword)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setToast("Password updated")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password.")
    }
  }

  const onToggle2FA = (value: boolean) => {
    setTwoFactorEnabled(value)
    patchCurrentUserSettings({ security: { twoFactorEnabled: value } })
    setToast(value ? "Two-factor enabled" : "Two-factor disabled")
  }

  const onRevoke = (sessionId: string) => {
    const revokedCurrent = revokeActiveSession(sessionId)
    if (revokedCurrent) {
      router.push("/signin")
      return
    }
    setSessions(listActiveSessionsForCurrentUser())
    setToast("Session revoked")
  }

  const currentSessionId = getSession()?.sessionId

  return (
    <SettingsShell active="security" title="Security">
      <Card className="border-indigo-200/12 bg-[#0a0f1d]/90">
        <CardContent className="space-y-3 p-4">
          <p className="text-2xl font-semibold">Password</p>
          <div className="space-y-2">
            <label className="text-xs text-zinc-300">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-zinc-300">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-zinc-300">Confirm New Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          {error && <p className="text-xs text-rose-300">{error}</p>}
          <Button variant="primary" size="sm" onClick={onUpdatePassword}>
            Update Password
          </Button>
        </CardContent>
      </Card>

      <Card className="border-indigo-200/12 bg-[#0a0f1d]/90">
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div>
            <p className="text-2xl font-semibold">
              Two-Factor Authentication{" "}
              <Badge variant="outline" className="ml-1 align-middle text-[9px]">
                RECOMMENDED
              </Badge>
            </p>
            <p className="text-xs text-zinc-400">
              Add an extra layer of security to your account by requiring more than just a password.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-300">{twoFactorEnabled ? "Enabled" : "Disabled"}</span>
            <Switch checked={twoFactorEnabled} onCheckedChange={onToggle2FA} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-indigo-200/12 bg-[#0a0f1d]/90">
        <CardContent className="space-y-4 p-4">
          <p className="text-2xl font-semibold">Active Sessions</p>
          <p className="text-xs text-zinc-400">
            Revoke any session you do not recognize.
          </p>

          <div className="space-y-2">
            {sessions.length === 0 ? (
              <div className="rounded-lg border border-indigo-200/12 bg-[#070c18] p-3 text-xs text-zinc-400">
                No active sessions found.
              </div>
            ) : (
              sessions.map((item) => {
                const isCurrent = item.id === currentSessionId
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-indigo-200/12 bg-[#070c18] p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`grid h-8 w-8 place-items-center rounded-full ${
                          isCurrent ? "bg-emerald-500/15" : "bg-white/5"
                        }`}
                      >
                        {isCurrent ? (
                          <Monitor className="h-4 w-4 text-emerald-300" />
                        ) : (
                          <Shield className="h-4 w-4 text-zinc-300" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {item.device}
                          {isCurrent && (
                            <Badge variant="secondary" className="ml-1 bg-emerald-500/15 text-emerald-300">
                              CURRENT
                            </Badge>
                          )}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {item.location} · {item.browser} · Last active{" "}
                          {new Date(item.lastActiveAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {!isCurrent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-300 hover:text-rose-200"
                        onClick={() => onRevoke(item.id)}
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                )
              })
            )}
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
