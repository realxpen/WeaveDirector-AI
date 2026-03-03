"use client"

import Link from "next/link"
import { Copy, MoreVertical, RefreshCw, Settings, Sparkles, User } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import ReactMarkdown from "react-markdown"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { fetchSessionById } from "@/lib/api"
import { downloadAllImages, exportAsJson, exportAsMarkdown } from "@/lib/export"
import type { CampaignOptions, SessionDetail } from "@/types/campaign"
import { EMPTY_SECTIONS } from "@/types/campaign"

export default function SessionDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id

  const [session, setSession] = useState<SessionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const data = await fetchSessionById(id)
        setSession(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch session."
        setError(message)
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [id])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 1800)
    return () => clearTimeout(timer)
  }, [toast])

  const sections = useMemo(() => ({ ...EMPTY_SECTIONS, ...(session?.sections ?? {}) }), [session])
  const options: CampaignOptions | undefined = session?.options

  const copySection = async (text: string) => {
    await navigator.clipboard.writeText(text || "")
    setToast("Copied")
  }

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
            <Link href="/studio"><Button variant="ghost" size="sm" className="w-full justify-start">New Campaign</Button></Link>
            <Link href="/sessions"><Button variant="secondary" size="sm" className="w-full justify-start">Sessions</Button></Link>
            <Link href="/story-mode"><Button variant="ghost" size="sm" className="w-full justify-start">Story Mode</Button></Link>
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
            <div className="flex h-11 items-center justify-between px-3 sm:px-4">
              <div className="flex items-center gap-2">
                <Link href="/sessions">
                  <Button variant="ghost" size="sm" className="h-7 text-xs">Back</Button>
                </Link>
                <p className="line-clamp-1 text-sm font-semibold">{session?.title ?? "Session Detail"}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 text-xs">Export</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => exportAsMarkdown(`${session?.id ?? "session"}.md`, sections, options)}>
                    Export as Markdown
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportAsJson(`${session?.id ?? "session"}.json`, { sections, options, images: session?.images ?? [] })}>
                    Export as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadAllImages(session?.images ?? [])}>
                    Download Images
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <div className="mx-auto max-w-[900px] space-y-4 p-4">
            {loading && <p className="text-xs text-zinc-400">Loading session...</p>}
            {error && <p className="text-xs text-rose-300">{error}</p>}

            {!loading && !error && session && (
              <>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {session.images.map((image, index) => (
                    <Card key={`${image.url}-${index}`} className="overflow-hidden border-indigo-200/12 bg-[#0a0f1d]/90">
                      <CardContent className="p-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image.url} alt={image.title || `Visual ${index + 1}`} className="h-32 w-full object-cover" />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {[
                  { key: "brief_summary", title: "Brief Summary" },
                  { key: "strategy", title: "Strategy & Concept" },
                  { key: "copy_pack", title: "Copy Pack" },
                  { key: "visual_pack", title: "Visual Pack Notes" },
                  { key: "video_pack", title: "Video Storyboard" },
                  { key: "social_pack", title: "Social Pack" },
                ].map((entry) => {
                  const content = sections[entry.key as keyof typeof sections]
                  return (
                    <Card key={entry.key} className="border-indigo-200/12 bg-[#0a0f1d]/90">
                      <CardContent className="p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-xs font-semibold">{entry.title}</p>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => void copySection(content)}>
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <RefreshCw className="h-3.5 w-3.5" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => void copySection(content)}>Copy</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div className="prose prose-invert max-w-none text-[11px] prose-p:my-1">
                          <ReactMarkdown>{content || "_No content_"}</ReactMarkdown>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{session.options.tone}</Badge>
                  {session.options.platforms.map((platform) => (
                    <Badge key={`${session.id}-${platform}`} variant="outline">{platform}</Badge>
                  ))}
                  <Badge variant="outline">{new Date(session.createdAt).toLocaleString()}</Badge>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 rounded-md border border-indigo-200/15 bg-[#0a1020] px-3 py-2 text-xs">
          {toast}
        </div>
      )}
    </div>
  )
}
