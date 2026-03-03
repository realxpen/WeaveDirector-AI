import Link from "next/link"
import { Play, ScanEye, Sparkles, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    title: "Instant Strategy",
    description:
      "Watch how WeaveDirector analyzes your brief to generate comprehensive campaign strategy and copy packs.",
    icon: ScanEye,
  },
  {
    title: "Visual Generation",
    description:
      "See the AI create stunning, on-brand visual assets tailored to different social media platforms.",
    icon: Sparkles,
  },
  {
    title: "Video Storyboarding",
    description:
      "Discover how to generate scene-by-scene video storyboard complete with visual descriptions and audio cues.",
    icon: Video,
  },
]

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#02040b] px-4 py-10 text-zinc-100 sm:px-6">
      <div className="mx-auto max-w-[860px] space-y-8">
        <section className="space-y-3 text-center">
          <h1 className="text-5xl font-semibold">See WeaveDirector in Action</h1>
          <p className="mx-auto max-w-xl text-sm text-zinc-400">
            Watch how our AI-powered platform transforms a simple brief into a complete, multi-channel
            marketing campaign in seconds.
          </p>
        </section>

        <section className="rounded-xl border border-indigo-200/12 bg-[#0a0f1d]/90 p-2">
          <div className="relative overflow-hidden rounded-lg border border-indigo-200/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://picsum.photos/seed/weavedemohero/1600/900"
              alt="Demo Preview"
              className="h-[320px] w-full object-cover opacity-45 sm:h-[380px]"
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 grid place-items-center">
              <button
                type="button"
                className="grid place-items-center gap-2 text-sm font-semibold"
                aria-label="Watch Full Demo"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full bg-blue-500/90 shadow-[0_0_22px_rgba(61,109,255,0.45)]">
                  <Play className="ml-1 h-6 w-6 text-white" />
                </span>
                <span>Watch Full Demo (3:45)</span>
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-indigo-200/12 bg-[#0a0f1d]/90">
              <CardContent className="space-y-3 p-4">
                <div className="grid h-8 w-8 place-items-center rounded-md bg-indigo-400/15">
                  <feature.icon className="h-4 w-4 text-blue-200" />
                </div>
                <h3 className="text-sm font-semibold">{feature.title}</h3>
                <p className="text-xs leading-relaxed text-zinc-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section>
          <Card className="border-indigo-200/12 bg-[#0a0f1d]/90">
            <CardContent className="space-y-4 py-8 text-center">
              <h2 className="text-2xl font-semibold">Ready to try it yourself?</h2>
              <p className="mx-auto max-w-lg text-xs text-zinc-400">
                Join thousands of creators and marketers who are already using WeaveDirector to supercharge their workflow.
              </p>
              <div className="flex items-center justify-center gap-2">
                <Link href="/signup">
                  <Button variant="primary" size="sm">Start Free Trial</Button>
                </Link>
                <Link href="/studio">
                  <Button variant="outline" size="sm">Explore Studio</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

