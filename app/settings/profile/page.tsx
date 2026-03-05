"use client"

import Link from "next/link"
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Folder,
  LogOut,
  Save,
  Star,
  Upload,
  UserRound,
  X,
} from "lucide-react"
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { fetchSessions } from "@/lib/api"
import {
  getCurrentUserProfile,
  getSession,
  saveProfile,
  signOutLocal,
  updateDisplayName,
  type UserProfile,
} from "@/lib/auth"
import type { SessionSummary } from "@/types/campaign"

type ProfileForm = {
  name: string
  headline: string
  bio: string
  location: string
  website: string
  avatarUrl: string
  coverUrl: string
}

function getInitialForm(profile: UserProfile | null, fallbackName: string): ProfileForm {
  return {
    name: profile?.name || fallbackName || "Creative User",
    headline: profile?.headline || "Creative Director",
    bio:
      profile?.bio ||
      "Passionate about blending AI with traditional design workflows for modern campaigns.",
    location: profile?.location || "Lagos, Nigeria",
    website: profile?.website || "",
    avatarUrl: profile?.avatarUrl || "",
    coverUrl: profile?.coverUrl || "",
  }
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return "WD"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
}

function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ""))
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}

export default function ProfileSettingsPage() {
  const router = useRouter()
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const coverInputRef = useRef<HTMLInputElement | null>(null)

  const [email, setEmail] = useState("")
  const [joinedAt, setJoinedAt] = useState<string>("")
  const [form, setForm] = useState<ProfileForm>(getInitialForm(null, ""))
  const [savedForm, setSavedForm] = useState<ProfileForm>(getInitialForm(null, ""))
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [recentSessions, setRecentSessions] = useState<SessionSummary[]>([])

  useEffect(() => {
    const session = getSession()
    if (!session) {
      router.push("/signin?redirect=/settings/profile")
      return
    }

    const profile = getCurrentUserProfile()
    const initial = getInitialForm(profile, session.name)
    setEmail(session.email)
    setJoinedAt(profile?.joinedAt || session.signedInAt)
    setForm(initial)
    setSavedForm(initial)

    fetchSessions()
      .then((rows) => {
        setRecentSessions(rows.slice(0, 4))
      })
      .catch(() => {
        setRecentSessions([])
      })
  }, [router])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(timer)
  }, [toast])

  const stats = useMemo(() => {
    const campaigns = recentSessions.length
    const generations = Math.max(campaigns * 3, campaigns)
    return { campaigns, generations }
  }, [recentSessions])

  const onSignOut = () => {
    signOutLocal()
    router.push("/signin")
  }

  const onSave = async () => {
    if (!email) return
    setSaving(true)
    try {
      const payload: UserProfile = {
        email,
        name: form.name.trim() || "Creative User",
        headline: form.headline.trim(),
        bio: form.bio.trim(),
        location: form.location.trim(),
        website: form.website.trim(),
        avatarUrl: form.avatarUrl,
        coverUrl: form.coverUrl,
        joinedAt: joinedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      saveProfile(payload)
      updateDisplayName(email, payload.name)
      setSavedForm({ ...form, name: payload.name })
      setForm((prev) => ({ ...prev, name: payload.name }))
      setIsEditing(false)
      setToast("Profile saved")
    } finally {
      setSaving(false)
    }
  }

  const onCancel = () => {
    setForm(savedForm)
    setIsEditing(false)
  }

  const onUploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const dataUrl = await toDataUrl(file)
    setForm((prev) => ({ ...prev, avatarUrl: dataUrl }))
    setIsEditing(true)
  }

  const onUploadCover = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const dataUrl = await toDataUrl(file)
    setForm((prev) => ({ ...prev, coverUrl: dataUrl }))
    setIsEditing(true)
  }

  return (
    <div className="min-h-screen bg-[#03050c] text-zinc-100">
      <header className="relative h-[170px] overflow-hidden">
        {form.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.coverUrl} alt="Cover art" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-[#0e1e4d] via-[#171d52] to-[#2a0a45]" />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </header>

      <main className="mx-auto max-w-[980px] px-4 pb-12">
        <div className="-mt-12 mb-5">
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Back
            </Button>
          </Link>
        </div>

        <section className="mb-5 flex items-end justify-between gap-4">
          <div className="flex items-end gap-3">
            <div className="relative">
              <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full border-2 border-black bg-[#1d2346] text-2xl font-semibold">
                {form.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  initialsFromName(form.name)
                )}
              </div>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border border-indigo-200/20 bg-[#0f172d]"
                onClick={() => avatarInputRef.current?.click()}
              >
                <Upload className="h-3.5 w-3.5" />
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={onUploadAvatar}
                className="hidden"
              />
            </div>
            <div className="pb-1">
              <h1 className="text-4xl font-semibold">{form.name}</h1>
              <p className="text-sm text-zinc-400">{form.headline || "Creative Director"}</p>
              <p className="text-xs text-zinc-500">{email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => coverInputRef.current?.click()}
            >
              <Upload className="mr-1.5 h-3.5 w-3.5" />
              Cover Art
            </Button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={onUploadCover}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setIsEditing(true)}
            >
              <UserRound className="mr-1.5 h-3.5 w-3.5" />
              Edit Profile
            </Button>
            <Button variant="secondary" size="sm" className="h-8 text-xs" onClick={onSignOut}>
              <LogOut className="mr-1.5 h-3.5 w-3.5" />
              Sign Out
            </Button>
          </div>
        </section>

        {isEditing && (
          <Card className="mb-4 border-indigo-200/12 bg-[#0a0f1d]/90">
            <CardContent className="space-y-3 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-300">Full name</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-300">Headline</label>
                  <Input
                    value={form.headline}
                    onChange={(e) => setForm((prev) => ({ ...prev, headline: e.target.value }))}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-300">Bio</label>
                <Textarea
                  value={form.bio}
                  onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
                  className="min-h-[78px] text-xs"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-300">Location</label>
                  <Input
                    value={form.location}
                    onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-300">Website</label>
                  <Input
                    value={form.website}
                    onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
                    placeholder="https://portfolio.site"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-indigo-200/10 pt-3">
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onCancel}>
                  <X className="mr-1.5 h-3.5 w-3.5" />
                  Cancel
                </Button>
                <Button variant="primary" size="sm" className="h-8 text-xs" onClick={onSave} disabled={saving}>
                  <Save className="mr-1.5 h-3.5 w-3.5" />
                  {saving ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <section className="grid gap-4 lg:grid-cols-[300px_1fr]">
          <div className="space-y-3">
            <Card className="border-indigo-200/12 bg-[#0a0f1d]/90">
              <CardContent className="space-y-3 p-4 text-xs">
                <p className="text-zinc-300">{form.bio}</p>
                <div className="space-y-2 border-t border-indigo-200/10 pt-3 text-zinc-400">
                  <p className="flex items-center gap-2">
                    <Folder className="h-3.5 w-3.5" />
                    {form.location || "Location not set"}
                  </p>
                  <p className="flex items-center gap-2 text-blue-300">
                    <Star className="h-3.5 w-3.5" />
                    {form.website || "Website not set"}
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Joined {new Date(joinedAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-indigo-200/12 bg-[#0a0f1d]/90">
              <CardContent className="space-y-3 p-4">
                <p className="text-sm font-semibold">Stats</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-indigo-200/12 bg-[#070c18] p-3 text-center">
                    <p className="text-3xl font-semibold text-blue-300">{stats.campaigns}</p>
                    <p className="text-[10px] text-zinc-500">CAMPAIGNS</p>
                  </div>
                  <div className="rounded-lg border border-indigo-200/12 bg-[#070c18] p-3 text-center">
                    <p className="text-3xl font-semibold text-violet-300">{stats.generations}</p>
                    <p className="text-[10px] text-zinc-500">GENERATIONS</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">Recent Campaigns</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {recentSessions.length === 0 ? (
                <Card className="border-indigo-200/12 bg-[#0a0f1d]/90 sm:col-span-2">
                  <CardContent className="p-3 text-xs text-zinc-400">
                    No sessions yet. Create a campaign from Studio.
                  </CardContent>
                </Card>
              ) : (
                recentSessions.map((campaign) => (
                  <Card key={campaign.id} className="border-indigo-200/12 bg-[#0a0f1d]/90">
                    <CardContent className="space-y-2 p-3">
                      <div className="flex items-center justify-between text-zinc-500">
                        <Star className="h-3.5 w-3.5" />
                        <span className="flex items-center gap-1 text-[10px]">
                          <Clock3 className="h-3 w-3" />
                          {new Date(campaign.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="line-clamp-1 text-sm font-semibold">{campaign.title}</p>
                      <p className="line-clamp-1 text-[11px] text-zinc-400">
                        {campaign.platforms.join(", ")}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <div className="pt-1">
              <Link href="/sessions">
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  View All Campaigns
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {toast && (
        <div className="fixed bottom-4 right-4 rounded-md border border-indigo-200/15 bg-[#0a1020] px-3 py-2 text-xs">
          {toast}
        </div>
      )}
    </div>
  )
}
