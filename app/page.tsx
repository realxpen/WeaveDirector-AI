import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Layers, LayoutTemplate, PlaySquare, Sparkles } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-zinc-800/40 bg-zinc-950/80 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">WeaveDirector</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <Link href="#features" className="hover:text-zinc-50 transition-colors">Features</Link>
          <Link href="#demo" className="hover:text-zinc-50 transition-colors">Demo</Link>
          <Link href="#pricing" className="hover:text-zinc-50 transition-colors">Pricing</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/studio">
            <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
          </Link>
          <Link href="/studio">
            <Button variant="primary" className="h-9 px-4">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-zinc-950 to-zinc-950"></div>
          <div className="container relative mx-auto px-4 text-center">
            <div className="mx-auto max-w-4xl space-y-8">
              <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-300 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                Powered by Gemini 1.5 Pro
              </div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Weave strategy, copy, visuals, and video into{" "}
                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  one creative flow.
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-zinc-400 sm:text-xl">
                Live multimodal AI creative director. Transform a simple marketing brief into a complete, production-ready campaign pack in seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/studio">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto group">
                    Create Campaign
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <PlaySquare className="mr-2 h-4 w-4" />
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-24">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="bg-zinc-900/50 border-zinc-800/50">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Layers className="h-6 w-6" />
                </div>
                <CardTitle>Interleaved Output</CardTitle>
                <CardDescription className="text-base mt-2">
                  Watch your campaign come to life in a live canvas where text, strategy, and generated visuals are seamlessly interleaved.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-zinc-900/50 border-zinc-800/50">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <LayoutTemplate className="h-6 w-6" />
                </div>
                <CardTitle>Campaign Pack Generator</CardTitle>
                <CardDescription className="text-base mt-2">
                  From brief to strategy, copy, social captions, and high-fidelity visuals—all generated in a single structured flow.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-zinc-900/50 border-zinc-800/50">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <PlaySquare className="h-6 w-6" />
                </div>
                <CardTitle>Video Storyboard Builder</CardTitle>
                <CardDescription className="text-base mt-2">
                  Automatically generate shot-by-shot video storyboards complete with visual descriptions, on-screen text, and voiceovers.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Mockup Section */}
        <section className="container mx-auto px-4 py-24">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-2 shadow-2xl shadow-blue-900/20 backdrop-blur-sm">
            <div className="rounded-xl overflow-hidden border border-zinc-800/50 bg-zinc-950 aspect-[16/9] relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/workspace/1920/1080?blur=4')] opacity-20 bg-cover bg-center"></div>
              <div className="relative z-10 text-center space-y-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
                  <Sparkles className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold">Live Canvas Preview</h3>
                <p className="text-zinc-400">Interactive workspace mockup</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800/40 bg-zinc-950 py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <span className="text-lg font-semibold">WeaveDirector</span>
          </div>
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} WeaveDirector. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-zinc-500">
            <Link href="#" className="hover:text-zinc-300">Privacy</Link>
            <Link href="#" className="hover:text-zinc-300">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
