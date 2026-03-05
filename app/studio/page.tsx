"use client"

import Link from "next/link"
import {
  ArrowLeft,
  Clapperboard,
  ChevronDown,
  Copy,
  LoaderCircle,
  RefreshCw,
  Send,
  Settings,
  Sparkles,
  User,
  Users,
  Wand2,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
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
import { getSession, isSignedIn } from "@/lib/auth"
import type { CampaignOptions, CampaignSection, StreamEvent, VisualItem } from "@/types/campaign"
import { EMPTY_SECTIONS } from "@/types/campaign"

const defaultOptions: CampaignOptions = {
  tone: "Bold",
  platforms: ["TikTok", "Instagram"],
  duration: "15s",
  audience: "Gen Z Gamers",
}

const modules = ["Strategy", "Copy Pack", "Visual Pack", "Video Storyboard", "Social Pack"]
type OutputMode = "campaign" | "story"

export default function StudioPage() {
  const router = useRouter()
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
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [viewerName, setViewerName] = useState<string>("Guest")
  const [showAdvancedInputs, setShowAdvancedInputs] = useState(false)
  const [outputMode, setOutputMode] = useState<OutputMode>("campaign")
  const [assetInputs, setAssetInputs] = useState({
    logoNotes: "",
    brandAssets: "",
    likedVideos: "",
    likedAudio: "",
    styleDirection: "",
  })

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

  useEffect(() => {
    const session = getSession()
    if (session?.name) setViewerName(session.name)
  }, [])

  const showToast = (message: string) => setToast(message)
  const filledAdvancedCount = Object.values(assetInputs).filter((value) => value.trim().length > 0).length

  const requireAuth = () => {
    if (isSignedIn()) return true
    setShowAuthPrompt(true)
    showToast("Please sign in to create content.")
    return false
  }

  const buildGenerationBrief = () => {
    const parts = [brief.trim()]
    const refs: string[] = []

    if (assetInputs.logoNotes.trim()) refs.push(`Logo: ${assetInputs.logoNotes.trim()}`)
    if (assetInputs.brandAssets.trim()) refs.push(`Brand Assets: ${assetInputs.brandAssets.trim()}`)
    if (assetInputs.likedVideos.trim()) refs.push(`Video References: ${assetInputs.likedVideos.trim()}`)
    if (assetInputs.likedAudio.trim()) refs.push(`Audio References: ${assetInputs.likedAudio.trim()}`)
    if (assetInputs.styleDirection.trim()) refs.push(`Style Direction: ${assetInputs.styleDirection.trim()}`)

    if (refs.length > 0) {
      parts.push("### Brand Asset and Style Inputs")
      parts.push(refs.map((item) => `- ${item}`).join("\n"))
      parts.push(
        "Use these references as inspiration only. Mix and adapt styles into original creative output."
      )
    }

    if (outputMode === "story") {
      parts.push("### Output Mode")
      parts.push(
        [
          "Story Output mode is enabled.",
          "Keep all required campaign headings, but write each section with cinematic narrative flow.",
          "Include character or scene continuity where useful.",
          "In Video Pack, prioritize scene-by-scene storyboard and voiceover-ready lines.",
          "In Social Pack, adapt the story arc into platform-native episodic posts.",
        ].join(" ")
      )
    }

    return parts.join("\n\n")
  }

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
    if (!requireAuth()) return
    const generationBrief = buildGenerationBrief()
    if (generationBrief.trim().length < 20) return
    setHasStarted(true)
    setIsGenerating(true)
    setSections(EMPTY_SECTIONS)
    setSectionLoading({})
    setVisuals([])
    setSessionId(null)

    try {
      const result = await generateCampaign(generationBrief, options)
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
    if (!requireAuth()) return
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
          </nav>
          <div className="mt-auto space-y-1 border-t border-indigo-200/10 p-2">
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Settings className="mr-2 h-3.5 w-3.5" />
                Settings
              </Button>
            </Link>
            <Link href="/settings/profile">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <User className="mr-2 h-3.5 w-3.5" />
                {viewerName}
              </Button>
            </Link>
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

            <div className="rounded-md border border-indigo-200/12 bg-[#090d18] p-1">
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setOutputMode("campaign")}
                  className={`h-7 rounded text-[10px] font-semibold transition ${
                    outputMode === "campaign"
                      ? "bg-[#0f1424] text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Campaign Mode
                </button>
                <button
                  type="button"
                  onClick={() => setOutputMode("story")}
                  className={`h-7 rounded text-[10px] font-semibold transition ${
                    outputMode === "story"
                      ? "bg-[#0f1424] text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Story Mode
                </button>
              </div>
            </div>

            <Card className="border-indigo-200/15 bg-[#0a0f1d]/90">
              <CardContent className="space-y-3 p-4">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-md border border-indigo-200/12 bg-[#070c18] px-3 py-2 text-left"
                  onClick={() => setShowAdvancedInputs((prev) => !prev)}
                >
                  <div>
                    <p className="text-xs font-semibold">Advanced Inputs</p>
                    <p className="text-[11px] text-zinc-400">
                      Logos, brand assets, video refs, audio refs, and style mixing direction.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded border border-indigo-200/20 px-1.5 py-0.5 text-[10px] text-zinc-300">
                      {filledAdvancedCount}/5 filled
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-zinc-300 transition-transform ${showAdvancedInputs ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                {showAdvancedInputs && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-300">Logo notes or link</label>
                      <Input
                        value={assetInputs.logoNotes}
                        onChange={(e) => setAssetInputs((prev) => ({ ...prev, logoNotes: e.target.value }))}
                        placeholder="Logo URL or usage notes"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-300">Brand assets (images, colors, fonts)</label>
                      <Textarea
                        value={assetInputs.brandAssets}
                        onChange={(e) => setAssetInputs((prev) => ({ ...prev, brandAssets: e.target.value }))}
                        placeholder="Drive links, asset folders, palette, font preferences..."
                        className="min-h-[68px] text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-300">Videos to emulate (style references)</label>
                      <Textarea
                        value={assetInputs.likedVideos}
                        onChange={(e) => setAssetInputs((prev) => ({ ...prev, likedVideos: e.target.value }))}
                        placeholder="Paste links and explain what style you like."
                        className="min-h-[60px] text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-300">Audio references</label>
                      <Textarea
                        value={assetInputs.likedAudio}
                        onChange={(e) => setAssetInputs((prev) => ({ ...prev, likedAudio: e.target.value }))}
                        placeholder="Music/sound examples and the vibe you want."
                        className="min-h-[60px] text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-300">Mixing instruction</label>
                      <Input
                        value={assetInputs.styleDirection}
                        onChange={(e) => setAssetInputs((prev) => ({ ...prev, styleDirection: e.target.value }))}
                        placeholder="Example: Mix cinematic product shots with fast social cuts."
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {hasStarted && (
              <>
                {outputMode === "campaign" ? (
                  <div className="space-y-3">
                    <ModeSectionCard
                      title="Strategy & Concept"
                      icon={<Wand2 className="h-3.5 w-3.5 text-blue-300" />}
                      accentClass="border-l-blue-400"
                      loading={Boolean(sectionLoading.brief_summary) || Boolean(sectionLoading.strategy)}
                      onCopy={() => onCopy("strategy")}
                      onRegenerate={() => onRegenerate("strategy")}
                    >
                      <MarkdownBlock text={`${sections.brief_summary}\n\n${sections.strategy}`} />
                    </ModeSectionCard>

                    <ModeSectionCard
                      title="Copy Pack"
                      icon={<Copy className="h-3.5 w-3.5 text-violet-300" />}
                      accentClass="border-l-violet-400"
                      loading={Boolean(sectionLoading.copy_pack)}
                      onCopy={() => onCopy("copy_pack")}
                      onRegenerate={() => onRegenerate("copy_pack")}
                    >
                      <MarkdownBlock text={sections.copy_pack} />
                    </ModeSectionCard>

                    <ModeSectionCard
                      title="Visual Pack"
                      icon={<Sparkles className="h-3.5 w-3.5 text-cyan-300" />}
                      accentClass="border-l-cyan-400"
                      loading={Boolean(sectionLoading.visual_pack)}
                      onCopy={() => onCopy("visual_pack")}
                      onRegenerate={() => onRegenerate("visual_pack")}
                    >
                      <div className="grid grid-cols-2 gap-2">
                        {visuals.map((image, index) => (
                          <div key={`${image.url}-${index}`} className="overflow-hidden rounded-md border border-indigo-200/15">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={image.url} alt={`visual ${index + 1}`} className="h-32 w-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </ModeSectionCard>

                    <ModeSectionCard
                      title="Video Storyboard"
                      icon={<Clapperboard className="h-3.5 w-3.5 text-pink-300" />}
                      accentClass="border-l-pink-400"
                      loading={Boolean(sectionLoading.video_pack)}
                      onCopy={() => onCopy("video_pack")}
                      onRegenerate={() => onRegenerate("video_pack")}
                    >
                      <MarkdownBlock text={sections.video_pack} />
                    </ModeSectionCard>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <ModeSectionCard
                      title="The Nexus Awakening"
                      icon={<Sparkles className="h-3.5 w-3.5 text-emerald-300" />}
                      accentClass="border-l-emerald-400"
                      loading={Boolean(sectionLoading.brief_summary) || Boolean(sectionLoading.strategy)}
                      onCopy={() => onCopy("strategy")}
                      onRegenerate={() => onRegenerate("strategy")}
                    >
                      <MarkdownBlock text={`${sections.brief_summary}\n\n${sections.strategy}`} />
                    </ModeSectionCard>

                    <ModeSectionCard
                      title="Characters"
                      icon={<Users className="h-3.5 w-3.5 text-amber-300" />}
                      accentClass="border-l-amber-400"
                      loading={Boolean(sectionLoading.copy_pack)}
                      onCopy={() => onCopy("copy_pack")}
                      onRegenerate={() => onRegenerate("copy_pack")}
                    >
                      <MarkdownBlock text={sections.copy_pack} />
                    </ModeSectionCard>

                    <ModeSectionCard
                      title="Script Excerpt"
                      icon={<Wand2 className="h-3.5 w-3.5 text-cyan-300" />}
                      accentClass="border-l-cyan-400"
                      loading={Boolean(sectionLoading.video_pack)}
                      onCopy={() => onCopy("video_pack")}
                      onRegenerate={() => onRegenerate("video_pack")}
                    >
                      <MarkdownBlock text={sections.video_pack} />
                    </ModeSectionCard>

                    <ModeSectionCard
                      title="Storyboard"
                      icon={<Clapperboard className="h-3.5 w-3.5 text-rose-300" />}
                      accentClass="border-l-rose-400"
                      loading={Boolean(sectionLoading.visual_pack)}
                      onCopy={() => onCopy("visual_pack")}
                      onRegenerate={() => onRegenerate("visual_pack")}
                    >
                      <div className="grid grid-cols-3 gap-2">
                        {visuals.map((image, index) => (
                          <div key={`${image.url}-${index}`} className="overflow-hidden rounded-md border border-indigo-200/15">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={image.url} alt={`storyboard ${index + 1}`} className="h-24 w-full object-cover" />
                            <div className="border-t border-indigo-200/10 bg-black/25 px-2 py-1 text-[10px] text-zinc-300">
                              Scene {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                      {!!sections.social_pack && (
                        <div className="mt-3 rounded-md border border-indigo-200/12 bg-black/20 p-2 text-[11px]">
                          <MarkdownBlock text={sections.social_pack} />
                        </div>
                      )}
                    </ModeSectionCard>
                  </div>
                )}
              </>
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

      {showAuthPrompt && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/60 px-4">
          <Card className="w-full max-w-[360px] border-indigo-200/15 bg-[#0a0f1d]">
            <CardContent className="space-y-3 p-4">
              <h3 className="text-sm font-semibold">Sign in required</h3>
              <p className="text-xs text-zinc-300">
                You need to sign in before creating or regenerating content.
              </p>
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setShowAuthPrompt(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => router.push("/signin?redirect=/studio")}
                >
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
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

function ModeSectionCard({
  title,
  icon,
  accentClass,
  loading,
  onCopy,
  onRegenerate,
  children,
}: {
  title: string
  icon: React.ReactNode
  accentClass: string
  loading: boolean
  onCopy: () => void
  onRegenerate: () => void
  children: React.ReactNode
}) {
  return (
    <Card className={`border-indigo-200/15 bg-[#0a0f1d]/90 border-l-2 ${accentClass}`}>
      <CardContent className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs font-semibold">
            {icon}
            {title}
          </p>
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
