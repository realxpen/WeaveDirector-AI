"use client"

import Link from "next/link"
import { Filter, MoreVertical, Plus, Search, Settings, Sparkles, User } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { fetchSessions } from "@/lib/api"
import type { SessionSummary } from "@/types/campaign"

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchSessions()
        setSessions(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch sessions."
        setError(message)
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const visibleSessions = useMemo(() => {
    if (!query.trim()) return sessions
    const q = query.trim().toLowerCase()
    return sessions.filter((session) => {
      return (
        session.title.toLowerCase().includes(q) ||
        session.tone.toLowerCase().includes(q) ||
        session.platforms.some((platform) => platform.toLowerCase().includes(q))
      )
    })
  }, [query, sessions])

  return (
    <div className="min-h-screen bg-[#02040b] text-zinc-100">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[170px_1fr]">
        <aside className="hidden border-r border-indigo-200/10 bg-[#060913] md:flex md:flex-col">
          <div className="h-11 border-b border-indigo-200/10 px-3">
            <Link href="/" className="flex h-full items-center gap-2 text-sm font-semibold">
              <div className="grid h-5 w-5 place-items-center rounded-md bg-blue-500/25">
                <Sparkles className="h-3 w-3 text-blue-200" />
              </div>
              WeaveDirector
            </Link>
          </div>
          <nav className="space-y-1 px-2 py-3 text-xs">
            <Link href="/studio">
              <Button variant="ghost" size="sm" className="w-full justify-start">New Campaign</Button>
            </Link>
            <Button variant="secondary" size="sm" className="w-full justify-start">Sessions</Button>
            <Link href="/story-mode">
              <Button variant="ghost" size="sm" className="w-full justify-start">Story Mode</Button>
            </Link>
          </nav>
          <div className="mt-auto space-y-1 border-t border-indigo-200/10 p-2">
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Settings className="mr-2 h-3.5 w-3.5" />
                Settings
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <User className="mr-2 h-3.5 w-3.5" />
              Profile
            </Button>
          </div>
        </aside>

        <main className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-indigo-200/10 bg-[#040813]/95 backdrop-blur-xl">
            <div className="flex h-11 items-center justify-between gap-3 px-3 sm:px-4">
              <p className="text-sm font-semibold">Past Campaigns</p>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search campaigns..."
                    className="h-7 w-[180px] pl-7 text-xs sm:w-[220px]"
                  />
                </div>
                <Button variant="outline" size="icon" className="h-7 w-7">
                  <Filter className="h-3.5 w-3.5" />
                </Button>
                <Link href="/studio">
                  <Button variant="primary" size="sm" className="h-7 text-xs">
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    New
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[900px] p-4">
            {loading && <p className="text-xs text-zinc-400">Loading sessions...</p>}
            {error && <p className="text-xs text-rose-300">{error}</p>}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleSessions.map((session) => {
                const seed = encodeURIComponent(session.title)
                return (
                  <Card key={session.id} className="overflow-hidden border-indigo-200/12 bg-[#0a0f1d]/90">
                    <CardContent className="p-0">
                      <div className="relative border-b border-indigo-200/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://picsum.photos/seed/${seed}/800/450`}
                          alt={session.title}
                          className="h-24 w-full object-cover sm:h-28"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/90 via-transparent to-transparent" />
                        <button className="absolute right-2 top-2 rounded-md bg-black/40 p-1 text-zinc-200">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>
                        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                          {session.platforms.slice(0, 2).map((platform) => (
                            <Badge key={`${session.id}-${platform}`} variant="secondary" className="bg-black/45 text-[9px]">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 p-3">
                        <p className="line-clamp-1 text-sm font-semibold">{session.title}</p>
                        <p className="text-[10px] text-zinc-500">
                          {new Date(session.createdAt).toLocaleDateString()} | {new Date(session.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[9px]">{session.tone}</Badge>
                          <Link href={`/sessions/${session.id}`} className="text-[11px] text-blue-300 hover:text-blue-200">
                            Open
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {!loading && !error && visibleSessions.length === 0 && (
              <p className="py-10 text-center text-xs text-zinc-500">No campaigns match your search.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
