"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { 
  Sparkles, 
  LayoutDashboard, 
  History, 
  Settings, 
  User, 
  Send, 
  RefreshCw,
  Copy,
  Download,
  MoreHorizontal,
  Image as ImageIcon,
  Video,
  Share2,
  FileText,
  CheckCircle2,
  ChevronDown,
  Play
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

export default function StudioPage() {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generatedContent, setGeneratedContent] = React.useState<any>(null)

  const handleGenerate = () => {
    setIsGenerating(true)
    setGeneratedContent(null)
    
    // Simulate generation process
    setTimeout(() => {
      setGeneratedContent({
        summary: "A bold, modern campaign for a new energy drink targeting Gen Z gamers.",
        strategy: "Focus on high-energy visuals, fast-paced editing, and influencer partnerships on TikTok and YouTube Shorts. Emphasize focus and reaction time benefits.",
        copy: {
          headline: "Unleash Your Reflexes. Dominate the Game.",
          body: "The only energy drink formulated specifically for competitive gamers. Zero crash, pure focus.",
          cta: "Level Up Now"
        },
        visuals: [
          "https://picsum.photos/seed/gamer1/800/600",
          "https://picsum.photos/seed/gamer2/800/600",
          "https://picsum.photos/seed/gamer3/800/600",
          "https://picsum.photos/seed/gamer4/800/600"
        ]
      })
      setIsGenerating(false)
    }, 3000)
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-50">
      {/* Left Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-zinc-800/40 bg-zinc-950/50 md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-zinc-800/40 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">WeaveDirector</span>
        </div>
        
        <nav className="flex-1 space-y-1 p-4">
          <Link href="/studio">
            <Button variant="secondary" className="w-full justify-start bg-zinc-900">
              <Sparkles className="mr-2 h-4 w-4 text-blue-400" />
              New Campaign
            </Button>
          </Link>
          <Link href="/sessions">
            <Button variant="ghost" className="w-full justify-start text-zinc-400">
              <History className="mr-2 h-4 w-4" />
              Sessions
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start text-zinc-400">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Story Mode
          </Button>
        </nav>

        <div className="border-t border-zinc-800/40 p-4">
          <Button variant="ghost" className="w-full justify-start text-zinc-400">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-400 mt-1">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </div>
      </aside>

      {/* Center Main Area */}
      <main className="flex flex-1 flex-col overflow-hidden relative">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-800/40 bg-zinc-950/80 px-6 backdrop-blur-xl z-10">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-zinc-900/50">Draft</Badge>
            <h1 className="text-sm font-medium">Untitled Campaign</h1>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Export
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem><FileText className="mr-2 h-4 w-4" /> Export as Markdown</DropdownMenuItem>
                <DropdownMenuItem><FileText className="mr-2 h-4 w-4" /> Export as JSON</DropdownMenuItem>
                <DropdownMenuItem><Download className="mr-2 h-4 w-4" /> Download All Images</DropdownMenuItem>
                <DropdownMenuItem><Copy className="mr-2 h-4 w-4" /> Copy All Content</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <ScrollArea className="flex-1 p-6">
          <div className="mx-auto max-w-4xl space-y-8 pb-24">
            
            {/* Brief Input */}
            <Card className="border-zinc-800/50 bg-zinc-900/30 shadow-xl backdrop-blur-sm relative overflow-hidden">
              {isGenerating && (
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-blue-500/10 animate-pulse"></div>
                  <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[shimmer_2s_infinite]"></div>
                </div>
              )}
              <CardContent className="p-6 relative z-10">
                <Textarea 
                  placeholder="Describe your product, audience, and campaign goal..." 
                  className="min-h-[120px] resize-none border-0 bg-transparent p-0 text-lg shadow-none focus-visible:ring-0 placeholder:text-zinc-600"
                  defaultValue="Launch campaign for 'Nexus Energy', a new zero-sugar energy drink for competitive gamers. We need high-energy visuals, punchy copy, and a TikTok strategy."
                />
                
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800/50 pt-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Select defaultValue="bold">
                      <SelectTrigger className="w-[140px] h-9 bg-zinc-900/50 border-zinc-800">
                        <SelectValue placeholder="Tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="bold">Bold & Edgy</SelectItem>
                        <SelectItem value="minimal">Minimalist</SelectItem>
                        <SelectItem value="playful">Playful</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-zinc-800 hover:bg-zinc-700 cursor-pointer">TikTok</Badge>
                      <Badge variant="secondary" className="bg-zinc-800 hover:bg-zinc-700 cursor-pointer">Instagram</Badge>
                      <Badge variant="outline" className="border-zinc-700 text-zinc-500 hover:text-zinc-300 cursor-pointer border-dashed">+</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" className="h-9" disabled={isGenerating}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Clear
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="h-9 px-6" 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Generate
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Canvas Output */}
            <div className="space-y-6">
              {isGenerating && !generatedContent && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <Card className="border-zinc-800/50 bg-zinc-900/20">
                    <CardHeader className="pb-3">
                      <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-[90%]" />
                      <Skeleton className="h-4 w-[80%]" />
                    </CardContent>
                  </Card>
                  <Card className="border-zinc-800/50 bg-zinc-900/20">
                    <CardHeader className="pb-3">
                      <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-40 w-full rounded-xl" />
                        <Skeleton className="h-40 w-full rounded-xl" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <AnimatePresence>
                {generatedContent && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                    className="space-y-6"
                  >
                    {/* Strategy Section */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <Card className="border-zinc-800/50 bg-zinc-900/40 overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <CardHeader className="flex flex-row items-center justify-between py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-400" />
                            <CardTitle className="text-lg">Strategy & Concept</CardTitle>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Copy className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><RefreshCw className="h-4 w-4" /></Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-zinc-300 leading-relaxed">{generatedContent.strategy}</p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Copy Pack Section */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                      <Card className="border-zinc-800/50 bg-zinc-900/40 overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
                        <CardHeader className="flex flex-row items-center justify-between py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-violet-400" />
                            <CardTitle className="text-lg">Copy Pack</CardTitle>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Copy className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><RefreshCw className="h-4 w-4" /></Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Headline</span>
                            <h3 className="text-xl font-bold text-white">{generatedContent.copy.headline}</h3>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Body Copy</span>
                            <p className="text-zinc-300">{generatedContent.copy.body}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Call to Action</span>
                            <p className="text-zinc-300 font-medium">{generatedContent.copy.cta}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Visual Pack Section */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <Card className="border-zinc-800/50 bg-zinc-900/40 overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                        <CardHeader className="flex flex-row items-center justify-between py-4">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-indigo-400" />
                            <CardTitle className="text-lg">Visual Pack</CardTitle>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><RefreshCw className="h-4 w-4" /></Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {generatedContent.visuals.map((src: string, i: number) => (
                              <div key={i} className="group/img relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={src} alt={`Generated visual ${i+1}`} className="object-cover w-full h-full transition-transform duration-500 group-hover/img:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover/img:opacity-100 flex flex-col justify-end p-4">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-white">Shot 0{i+1}</span>
                                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white border-0">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Video Storyboard Section */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                      <Card className="border-zinc-800/50 bg-zinc-900/40 overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-pink-500"></div>
                        <CardHeader className="flex flex-row items-center justify-between py-4">
                          <div className="flex items-center gap-2">
                            <Video className="h-5 w-5 text-pink-400" />
                            <CardTitle className="text-lg">Video Storyboard</CardTitle>
                            <Badge variant="outline" className="ml-2 bg-zinc-950">15s TikTok</Badge>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Copy className="h-4 w-4" /></Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {[
                            { time: "0:00-0:03", visual: "Close up of gamer's eyes reflecting screen light. Sudden wide eye movement.", audio: "SFX: Heartbeat. VO: 'Blink and you miss it.'" },
                            { time: "0:03-0:08", visual: "Fast-paced montage of intense gameplay moments intercut with cracking open a Nexus Energy can.", audio: "SFX: Can opening, fast electronic beat drops. VO: 'Nexus Energy. Zero crash.'" },
                            { time: "0:08-0:15", visual: "Gamer takes a sip, eyes glow faintly blue. Text on screen: UNLEASH REFLEXES. Product shot.", audio: "VO: 'Pure focus. Level up now.' SFX: Level up chime." }
                          ].map((shot, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
                              <div className="flex-shrink-0 w-16 text-xs font-mono text-zinc-500 pt-1">{shot.time}</div>
                              <div className="space-y-2 flex-1">
                                <div>
                                  <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider mr-2">Visual</span>
                                  <span className="text-sm text-zinc-300">{shot.visual}</span>
                                </div>
                                <div>
                                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider mr-2">Audio</span>
                                  <span className="text-sm text-zinc-400">{shot.audio}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </ScrollArea>
      </main>

      {/* Right Sidebar */}
      <aside className="hidden w-72 flex-col border-l border-zinc-800/40 bg-zinc-950/50 lg:flex">
        <div className="flex h-16 items-center border-b border-zinc-800/40 px-6">
          <span className="text-sm font-semibold tracking-tight">Campaign Settings</span>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Target Audience</label>
              <Input placeholder="e.g. Gen Z, Gamers, 18-24" defaultValue="Gen Z Gamers" className="bg-zinc-900/50" />
            </div>
            
            <div className="space-y-3">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Brand Style</label>
              <Select defaultValue="modern">
                <SelectTrigger className="bg-zinc-900/50">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern & Clean</SelectItem>
                  <SelectItem value="bold">Bold & Edgy</SelectItem>
                  <SelectItem value="playful">Playful & Fun</SelectItem>
                  <SelectItem value="corporate">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Video Duration</label>
              <Select defaultValue="15s">
                <SelectTrigger className="bg-zinc-900/50">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15s">15 Seconds (Shorts/Reels)</SelectItem>
                  <SelectItem value="30s">30 Seconds</SelectItem>
                  <SelectItem value="60s">60 Seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-800/50">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Output Modules</label>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Strategy</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Copy Pack</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Visual Pack</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Video Storyboard</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Social Pack</span>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </ScrollArea>
      </aside>
    </div>
  )
}
