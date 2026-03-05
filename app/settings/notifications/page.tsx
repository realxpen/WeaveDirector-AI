"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { SettingsShell } from "@/components/settings/SettingsShell"
import { getSession } from "@/lib/auth"
import { getCurrentUserSettings, patchCurrentUserSettings, type UserSettings } from "@/lib/user-settings"

type NotifState = UserSettings["notifications"]

function Row({
  title,
  desc,
  checked,
  onCheckedChange,
}: {
  title: string
  desc: string
  checked: boolean
  onCheckedChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-zinc-400">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

export default function NotificationsSettingsPage() {
  const router = useRouter()
  const [state, setState] = useState<NotifState | null>(null)
  const [savedState, setSavedState] = useState<NotifState | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const session = getSession()
    if (!session) {
      router.push("/signin?redirect=/settings/notifications")
      return
    }
    const settings = getCurrentUserSettings()
    setState(settings.notifications)
    setSavedState(settings.notifications)
  }, [router])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(timer)
  }, [toast])

  if (!state) {
    return (
      <SettingsShell active="notifications" title="Notifications">
        <Card className="border-indigo-200/12 bg-[#0a0f1d]/90">
          <CardContent className="p-4 text-xs text-zinc-400">Loading settings...</CardContent>
        </Card>
      </SettingsShell>
    )
  }

  const onSave = () => {
    patchCurrentUserSettings({ notifications: state })
    setSavedState(state)
    setToast("Notification settings saved")
  }

  const onReset = () => {
    if (!savedState) return
    setState(savedState)
  }

  return (
    <SettingsShell active="notifications" title="Notifications">
      <Card className="border-indigo-200/12 bg-[#0a0f1d]/90">
        <CardContent className="space-y-6 p-4">
          <div className="space-y-4">
            <p className="text-2xl font-semibold">Email Notifications</p>
            <Row
              title="Campaign Generations"
              desc="Receive emails when your campaigns finish generating."
              checked={state.emailCampaignGenerations}
              onCheckedChange={(value) =>
                setState((prev) => (prev ? { ...prev, emailCampaignGenerations: value } : prev))
              }
            />
            <Row
              title="Marketing Updates"
              desc="Receive emails about new features and tips."
              checked={state.emailMarketingUpdates}
              onCheckedChange={(value) =>
                setState((prev) => (prev ? { ...prev, emailMarketingUpdates: value } : prev))
              }
            />
            <Row
              title="Weekly Digest"
              desc="A weekly summary of your workspace activity."
              checked={state.emailWeeklyDigest}
              onCheckedChange={(value) =>
                setState((prev) => (prev ? { ...prev, emailWeeklyDigest: value } : prev))
              }
            />
          </div>

          <div className="space-y-4 border-t border-indigo-200/10 pt-5">
            <p className="text-2xl font-semibold">In-App Notifications</p>
            <Row
              title="Mentions"
              desc="Notify me when someone mentions me in a comment."
              checked={state.inAppMentions}
              onCheckedChange={(value) =>
                setState((prev) => (prev ? { ...prev, inAppMentions: value } : prev))
              }
            />
            <Row
              title="Workspace Invites"
              desc="Notify me when I’m invited to a new workspace."
              checked={state.inAppWorkspaceInvites}
              onCheckedChange={(value) =>
                setState((prev) => (prev ? { ...prev, inAppWorkspaceInvites: value } : prev))
              }
            />
          </div>

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
