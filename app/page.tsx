import Link from "next/link"
import { Layers3, LayoutTemplate, PlayCircle, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    title: "Interleaved Output",
    description:
      "Watch your campaign come to life in a structured canvas where text, strategy, and visuals stream together.",
    icon: Layers3,
  },
  {
    title: "Campaign Pack Generator",
    description:
      "From one brief to strategy, copy, social captions, and visual directions in a single generation flow.",
    icon: LayoutTemplate,
  },
  {
    title: "Video Storyboard Builder",
    description:
      "Automatically generate shot-by-shot storyboard guidance with visual scenes and voiceover guidance.",
    icon: PlayCircle,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#04060d] text-zinc-100">
      <header className="border-b border-indigo-200/10 bg-[#050914]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-11 max-w-[1200px] items-center justify-between px-4 text-xs">
          <Link href="/" className="flex items-center gap-1.5 font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-blue-300" />
            WeaveDirector
          </Link>
          <div className="flex items-center gap-4 text-zinc-400">
            <Link href="/features" className="hover:text-zinc-100">
              Features
            </Link>
            <Link href="/demo" className="hover:text-zinc-100">
              Demo
            </Link>
            <Link href="/pricing" className="hover:text-zinc-100">
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/signin">
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="sm" className="h-7 text-xs">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 pb-14 pt-16">
        <section className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="border-indigo-200/20 bg-indigo-100/5 text-[10px] text-zinc-300">
            Powered by Gemini Live API
          </Badge>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight">
            Weave strategy, copy,
            <br />
            visuals, and video into <span className="text-blue-400">one</span>
            <br />
            creative flow.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-xs text-zinc-400">
            Live multimodal AI creative director. Transform a simple marketing brief into a
            complete, production-ready campaign pack in seconds.
          </p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <Link href="/studio">
              <Button variant="primary" size="sm" className="h-7 px-4 text-xs">
                Create Campaign
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="sm" className="h-7 px-3 text-xs">
                View Demo
              </Button>
            </Link>
          </div>
        </section>

        <section className="mx-auto mt-14 grid max-w-3xl gap-3 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-indigo-200/12 bg-[#090f1a]/70">
              <CardHeader className="p-4">
                <feature.icon className="mb-2 h-4 w-4 text-blue-300" />
                <CardTitle className="text-sm">{feature.title}</CardTitle>
                <CardDescription className="text-[11px] leading-relaxed text-zinc-400">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="mx-auto mt-12 max-w-3xl rounded-xl border border-indigo-200/15 bg-[#090f1a] p-1.5">
          <div className="relative overflow-hidden rounded-lg border border-indigo-200/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://picsum.photos/seed/weave-director-preview/1600/900"
              alt="Live Canvas Preview"
              className="h-[360px] w-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <div className="mx-auto mb-3 grid h-9 w-9 place-items-center rounded-full border border-blue-300/35 bg-blue-500/20">
                  <Sparkles className="h-4 w-4 text-blue-200" />
                </div>
                <p className="text-sm font-semibold">Live Canvas Preview</p>
                <p className="mt-1 text-xs text-zinc-300">Interactive workspace mockup</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-indigo-200/10 py-4 text-[10px] text-zinc-500">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4">
          <p className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-blue-300" />
            WeaveDirector
          </p>
          <p>© 2026 WeaveDirector. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

