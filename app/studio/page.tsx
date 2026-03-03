"use client"

import Link from "next/link"
import {
  ArrowLeft,
  ChevronDown,
  Copy,
  LoaderCircle,
  RefreshCw,
  Send,
  Settings,
  Sparkles,
  User,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"

import { StudioTour } from "@/components/StudioTour"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { downloadAllImages, exportAsJson, exportAsMarkdown } from "@/lib/export"
import { generateCampaign, regenerateSection, resolveStreamUrl } from "@/lib/api"
import type { CampaignOptions, CampaignSection, StreamEvent, VisualItem } from "@/types/campaign"
import { EMPTY_SECTIONS } from "@/types/campaign"

const defaultOptions: CampaignOptions = {
  tone: "Bold",
  platforms: ["TikTok", "Instagram"],
  duration: "15s",
  audience: "Gen Z Gamers",
}

const modules = ["Strategy", "Copy Pack", "Visual Pack", "Video Storyboard", "Social Pack"]

export default function StudioPage() {
  const [brief, setBrief] = useState(
    "Launch campaign for 'Nexus Energy', a new zero-sugar energy drink for competitive gamers. We need high-energy visuals, punchy copy, and a TikTok strategy."
  )
  const [options, setOptions] = useState<CampaignOptions>(defaultOptions)
  const [sections, setSections] = useState(EMPTY_SECTIONS)
  const [sectionLoading, setSectionLoading] = useState<Partial<Record<CampaignSection, boolean>>>({})
  const [visuals, setVisuals] = useState<VisualItem[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [streamUrl, setStreamUrl] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const sourceRef = useRef<EventSource | null>(null)

  const closeStream = () => {
    if (sourceRef.current) {
      sourceRef.current.close()
      sourceRef.current = null
    }
  }

  useEffect(() => {
    return () => closeStream()
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(timer)
  }, [toast])

  const showToast = (message: string) => setToast(message)

  const handleStreamEvent = (event: StreamEvent) => {
    switch (event.type) {
      case "section_start":
        setSectionLoading((prev) => ({ ...prev, [event.section]: true }))
        break
      case "section_chunk":
        setSections((prev) => ({ ...prev, [event.section]: `${prev[event.section]}${event.chunk}` }))
        break
      case "image_generated":
        setVisuals((prev) => [...prev, { url: event.url, title: event.title }])
        break
      case "section_end":
        setSectionLoading((prev) => ({ ...prev, [event.section]: false }))
        break
      case "done":
        setIsGenerating(false)
        setSessionId(event.sessionId)
        closeStream()
        showToast("Campaign complete")
        break
      case "error":
        setIsGenerating(false)
        closeStream()
        showToast(event.message)
        break
    }
  }

  const startEventStream = (url: string) => {
    closeStream()
    const source = new EventSource(url)
    sourceRef.current = source

    source.onmessage = (message) => {
      try {
        const payload = JSON.parse(message.data) as StreamEvent
        handleStreamEvent(payload)
      } catch {
        showToast("Invalid stream message")
      }
    }

    source.onerror = () => {
      setIsGenerating(false)
      closeStream()
      showToast("Connection lost. Retry.")
    }
  }

  const onGenerate = async () => {
    if (brief.trim().length < 20) return
    setHasStarted(true)
    setIsGenerating(true)
    setSections(EMPTY_SECTIONS)
    setSectionLoading({})
    setVisuals([])
    setSessionId(null)

    try {
      const result = await generateCampaign(brief, options)
      const sid = result.sessionId ?? ""
      const url = result.streamUrl ? resolveStreamUrl(result.streamUrl) : resolveStreamUrl(`/api/stream/${sid}`)
      setSessionId(result.sessionId ?? null)
      setStreamUrl(url)
      startEventStream(url)
    } catch (error) {
      setIsGenerating(false)
      showToast(error instanceof Error ? error.message : "Failed to generate")
    }
  }

  const onClear = () => {
    setHasStarted(false)
    setSections(EMPTY_SECTIONS)
    setSectionLoading({})
    setVisuals([])
    setSessionId(null)
    closeStream()
    setIsGenerating(false)
  }

  const onCopy = async (section: CampaignSection) => {
    await navigator.clipboard.writeText(sections[section] || "")
    showToast("Copied")
  }

  const onRegenerate = async (section: CampaignSection) => {
    if (!sessionId) return
    await regenerateSection(sessionId, section)
    showToast(`Regenerating ${section}`)
  }

  return (
    <TooltipProvider delayDuration={250}>
      <div className="min-h-screen bg-[#02040b] text-zinc-100">
        <StudioTour />
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[170px_1fr_260px]">
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
            <Button variant="secondary" size="sm" className="w-full justify-start">New Campaign</Button>
            <Link href="/sessions"><Button variant="ghost" size="sm" className="w-full justify-start">Sessions</Button></Link>
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

        <main className="min-w-0 border-r border-indigo-200/10">
          <header className="sticky top-0 z-20 border-b border-indigo-200/10 bg-[#040813]/95 backdrop-blur-xl">
            <div className="flex h-11 items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                    Back
                  </Button>
                </Link>
                <span className="rounded-md border border-indigo-200/20 bg-indigo-100/10 px-1.5 py-0.5 text-[10px] font-semibold">Draft</span>
                <p className="text-xs font-semibold">Untitled Campaign</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div id="tour-export-assets">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Export
                          <ChevronDown className="ml-1 h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Export campaign assets and content</TooltipContent>
                    </Tooltip>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => exportAsMarkdown("campaign.md", sections, options)}>
                    Export as Markdown
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportAsJson("campaign.json", { options, sections, visuals })}>
                    Export as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadAllImages(visuals)}>Download Images</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <div className="mx-auto max-w-[640px] space-y-4 p-4">
            <Card id="tour-campaign-brief" className="border-indigo-200/15 bg-[#0a0f1d]/90">
              <CardContent className="space-y-4 p-4">
                <Textarea
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  className="min-h-[92px] resize-none border-0 bg-transparent p-0 text-[30] shadow-none focus-visible:ring-0"
                />
                <div className="flex items-center gap-2 border-t border-indigo-200/10 pt-3">
                  <Select value={options.tone} onValueChange={(value) => setOptions((prev) => ({ ...prev, tone: value as CampaignOptions["tone"] }))}>
                    <SelectTrigger className="h-7 w-[120px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Bold">Bold & Edgy</SelectItem>
                      <SelectItem value="Playful">Playful</SelectItem>
                      <SelectItem value="Minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                  {options.platforms.map((platform) => (
                    <span key={platform} className="rounded-full border border-indigo-200/20 px-2 py-0.5 text-[10px] text-zinc-300">
                      {platform}
                    </span>
                  ))}
                  <div className="ml-auto flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="secondary" size="sm" className="h-7 text-xs" onClick={onClear}>
                          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                          Clear
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Clear current campaign output</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button id="tour-generate-button" variant="primary" size="sm" className="h-7 text-xs" onClick={onGenerate}>
                          {isGenerating ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <><Send className="mr-1.5 h-3.5 w-3.5" />Generate</>}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Generate campaign sections live</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </CardContent>
            </Card>

            {hasStarted && (
              <div className="space-y-3">
                <SectionCard
                  title="Strategy & Concept"
                  loading={Boolean(sectionLoading.brief_summary) || Boolean(sectionLoading.strategy)}
                  onCopy={() => onCopy("strategy")}
                  onRegenerate={() => onRegenerate("strategy")}
                >
                  <MarkdownBlock text={`${sections.brief_summary}\n\n${sections.strategy}`} />
                </SectionCard>

                <SectionCard
                  title="Copy Pack"
                  loading={Boolean(sectionLoading.copy_pack)}
                  onCopy={() => onCopy("copy_pack")}
                  onRegenerate={() => onRegenerate("copy_pack")}
                >
                  <MarkdownBlock text={sections.copy_pack} />
                </SectionCard>

                <SectionCard
                  title="Visual Pack"
                  loading={Boolean(sectionLoading.visual_pack)}
                  onCopy={() => onCopy("visual_pack")}
                  onRegenerate={() => onRegenerate("visual_pack")}
                >
                  <div className="grid grid-cols-2 gap-2">
                    {visuals.map((image, index) => (
                      <div key={`${image.url}-${index}`} className="overflow-hidden rounded-md border border-indigo-200/15">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image.url} alt={`visual ${index + 1}`} className="h-24 w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard
                  title="Video Storyboard"
                  loading={Boolean(sectionLoading.video_pack)}
                  onCopy={() => onCopy("video_pack")}
                  onRegenerate={() => onRegenerate("video_pack")}
                >
                  <MarkdownBlock text={sections.video_pack} />
                </SectionCard>
              </div>
            )}
          </div>
        </main>

        <aside id="tour-campaign-settings" className="hidden bg-[#060913] md:block">
          <div className="h-11 border-b border-indigo-200/10 px-4">
            <p className="flex h-full items-center text-xs font-semibold">Campaign Settings</p>
          </div>
          <div className="space-y-5 px-4 py-5 text-xs">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Target Audience</p>
              <Input
                value={options.audience}
                onChange={(e) => setOptions((prev) => ({ ...prev, audience: e.target.value }))}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Brand Style</p>
              <Select value={options.tone} onValueChange={(value) => setOptions((prev) => ({ ...prev, tone: value as CampaignOptions["tone"] }))}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professional">Modern & Clean</SelectItem>
                  <SelectItem value="Bold">Bold & Edgy</SelectItem>
                  <SelectItem value="Playful">Playful</SelectItem>
                  <SelectItem value="Minimal">Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Video Duration</p>
              <Select value={options.duration} onValueChange={(value) => setOptions((prev) => ({ ...prev, duration: value as CampaignOptions["duration"] }))}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15s">15 Seconds (Shorts/Reels)</SelectItem>
                  <SelectItem value="30s">30 Seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 border-t border-indigo-200/10 pt-4">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Output Modules</p>
              {modules.map((module) => (
                <div key={module} className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-300">{module}</span>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 rounded-md border border-indigo-200/15 bg-[#0a1020] px-3 py-2 text-xs">
          {toast}
        </div>
      )}
    </div>
    </TooltipProvider>
  )
}

function SectionCard({
  title,
  loading,
  onCopy,
  onRegenerate,
  children,
}: {
  title: string
  loading: boolean
  onCopy: () => void
  onRegenerate: () => void
  children: React.ReactNode
}) {
  return (
    <Card className="border-indigo-200/15 bg-[#0a0f1d]/90">
      <CardContent className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold">{title}</p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onCopy}>
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRegenerate}>
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        {loading ? (
          <div className="space-y-1">
            <div className="h-2 rounded bg-indigo-200/10" />
            <div className="h-2 w-10/12 rounded bg-indigo-200/10" />
            <div className="h-2 w-7/12 rounded bg-indigo-200/10" />
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}

function MarkdownBlock({ text }: { text: string }) {
  return (
    <div className="prose prose-invert max-w-none text-[11px] prose-p:my-1">
      <ReactMarkdown>{text || "_Waiting for output..._"}</ReactMarkdown>
    </div>
  )
}
