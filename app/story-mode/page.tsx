import Link from "next/link"
import {
  ArrowLeft,
  BookOpen,
  Clapperboard,
  Eraser,
  Send,
  Sparkles,
  UserRound,
  Wand2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const storyboardShots = [
  { title: "Shot 1", caption: "Wide shot: neon skyline, rain haze, lone runner." },
  { title: "Shot 2", caption: "Close-up: hand cracks can, city lights reflect." },
  { title: "Shot 3", caption: "POV: sprint through alley, pulse rising." },
]

export default function StoryModePage() {
  return (
    <div className="min-h-screen bg-[#02040b] px-4 py-5 text-zinc-100 sm:px-6">
      <div className="mx-auto max-w-[760px]">
        <Link
          href="/studio"
          className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-100"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <Card className="mt-5 border-indigo-200/12 bg-[#070b16]/95">
          <CardContent className="p-4">
            <p className="text-sm leading-6 text-zinc-100">
              Launch campaign for &quot;Nexus Energy&quot;, a new zero-sugar energy drink for
              competitive gamers. We need high-energy visuals, punchy copy, and a TikTok strategy.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge className="bg-zinc-900/90 text-[11px]">Bold &amp; Edgy</Badge>
              <Badge className="bg-zinc-900/90 text-[11px]">TikTok</Badge>
              <Badge className="bg-zinc-900/90 text-[11px]">Instagram</Badge>

              <div className="ml-auto flex items-center gap-2">
                <Button variant="secondary" size="sm" className="h-8">
                  <Eraser className="mr-1.5 h-3.5 w-3.5" />
                  Clear
                </Button>
                <Button variant="primary" size="sm" className="h-8 px-4">
                  <Send className="mr-1.5 h-3.5 w-3.5" />
                  Generate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-indigo-200/10 bg-[#060a14] p-1">
          <Link
            href="/studio"
            className="rounded-lg px-3 py-2 text-center text-xs font-medium text-zinc-400 hover:text-zinc-200"
          >
            Campaign Mode
          </Link>
          <div className="rounded-lg bg-zinc-900/80 px-3 py-2 text-center text-xs font-semibold text-zinc-100">
            Story Mode
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <Card className="border-emerald-400/35 bg-[#071015]/95">
            <CardContent className="p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-200">
                <Sparkles className="h-4 w-4" />
                The Nexus Awakening
              </p>
              <p className="text-sm leading-6 text-zinc-200">
                In a neon-drenched cityscape metropolis, a young underground gamer discovers that
                Nexus Energy isn&apos;t just a drink. It&apos;s a key to unlocking hidden neural
                pathways. As they consume the elixir, their perception of reality shifts, unveiling
                a mysterious voice with a digital world that rewrites vision, reflexes and destiny.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-400/35 bg-[#110d08]/95">
            <CardContent className="p-4">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-200">
                <UserRound className="h-4 w-4" />
                Characters
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-amber-300/15 bg-black/30 p-3">
                  <p className="text-sm font-semibold text-zinc-100">Kai</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                    Protagonist
                  </p>
                  <p className="mt-2 text-xs text-zinc-300">
                    Resilient but distracted underground gamer chasing the final level.
                  </p>
                </div>
                <div className="rounded-xl border border-amber-300/15 bg-black/30 p-3">
                  <p className="text-sm font-semibold text-zinc-100">Lyra</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                    The Guide
                  </p>
                  <p className="mt-2 text-xs text-zinc-300">
                    A synthetic voice that awakens Kai to the true potential of Nexus Energy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-cyan-400/35 bg-[#071019]/95">
            <CardContent className="p-4">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-cyan-200">
                <Wand2 className="h-4 w-4" />
                Script Excerpt
              </p>
              <div className="rounded-xl border border-cyan-300/15 bg-black/30 p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  Scene 1 - INT. Arena - Night
                </p>
                <p className="mt-3 text-center text-xs leading-6 text-zinc-300">(KAI)</p>
                <p className="mt-1 text-center text-sm italic text-zinc-100">
                  Is this it? The edge everyone&apos;s talking about?
                </p>
                <p className="mt-4 text-center text-xs leading-6 text-zinc-300">(LYRA)</p>
                <p className="mt-1 text-center text-sm italic text-zinc-100">
                  It&apos;s not an edge, Kai. It&apos;s a key. The question is, are you ready to open
                  the door?
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-pink-400/35 bg-[#140913]/95">
            <CardContent className="p-4">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-pink-200">
                <Clapperboard className="h-4 w-4" />
                Storyboard
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {storyboardShots.map((shot, index) => (
                  <div key={shot.title} className="rounded-xl border border-pink-300/15 bg-black/30 p-2">
                    <div
                      className="h-24 rounded-lg border border-white/10"
                      style={{
                        background:
                          index === 0
                            ? "linear-gradient(140deg, #1d2f4a 0%, #6f5236 60%, #1f101a 100%)"
                            : index === 1
                              ? "linear-gradient(140deg, #1b1828 0%, #3f2b51 55%, #777f8f 100%)"
                              : "linear-gradient(140deg, #111216 0%, #4f5562 50%, #8d8e90 100%)",
                      }}
                    />
                    <p className="mt-2 text-[11px] font-semibold text-zinc-100">{shot.title}</p>
                    <p className="mt-1 text-[11px] text-zinc-400">{shot.caption}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-5 flex justify-end">
          <Button variant="outline" size="sm">
            <BookOpen className="mr-1.5 h-3.5 w-3.5" />
            Continue Story Build
          </Button>
        </div>
      </div>
    </div>
  )
}
