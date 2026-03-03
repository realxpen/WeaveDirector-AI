import Link from "next/link"
import { ArrowLeft, BookOpen, Sparkles, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function StoryModePage() {
  return (
    <div className="min-h-screen bg-[#02040b] px-4 py-8 text-zinc-100 sm:px-6">
      <div className="mx-auto max-w-[860px]">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-100">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <div className="mt-14 space-y-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-violet-500/15">
            <BookOpen className="h-6 w-6 text-violet-300" />
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl font-semibold tracking-tight">
              Story <span className="text-violet-400">Mode</span>
            </h1>
            <p className="mx-auto max-w-[640px] text-2xl leading-relaxed text-zinc-300">
              Immerse yourself in a narrative-driven creative experience. Story Mode guides you
              through the campaign creation process as an interactive journey, helping you unlock
              deeper creative insights.
            </p>
          </div>

          <Card className="mx-auto max-w-[640px] border-indigo-200/12 bg-[#0a0f1d]/90 text-left">
            <CardContent className="space-y-3 p-6">
              <p className="flex items-center gap-2 text-3xl font-semibold">
                <Sparkles className="h-5 w-5 text-violet-300" />
                Coming Soon
              </p>
              <p className="text-lg leading-relaxed text-zinc-300">
                We&apos;re currently crafting the ultimate narrative experience for creative
                directors. Story Mode will feature branching paths, character personas, and dynamic
                world-building tools to help you conceptualize campaigns in entirely new ways.
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" size="lg">Join the Waitlist</Button>
            <Link href="/studio">
              <Button variant="outline" size="lg">
                <Play className="mr-2 h-4 w-4" />
                Try Standard Studio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

