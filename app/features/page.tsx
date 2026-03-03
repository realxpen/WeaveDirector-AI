import Link from "next/link"
import {
  ArrowLeft,
  Bot,
  Clapperboard,
  Hash,
  Layers3,
  Sparkles,
  Wand2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    title: "Interleaved Output",
    description:
      "Watch your campaign come to life in a live canvas where text, strategy, and generated visuals flow seamlessly.",
    icon: Layers3,
  },
  {
    title: "Real-time Generation",
    description:
      "Powered by Gemini 1.5 Pro, experience near-instantaneous generation of high-quality marketing assets.",
    icon: Sparkles,
  },
  {
    title: "Video Storyboarding",
    description:
      "Automatically generate shot-by-shot video storyboards complete with visual prompts and voiceover scripts.",
    icon: Clapperboard,
  },
  {
    title: "Multi-format Export",
    description:
      "Export your entire campaign as a polished PDF presentation, or raw assets ready for production.",
    icon: Bot,
  },
  {
    title: "Strategic Reasoning",
    description:
      "Not just a text generator. The AI acts as a creative director, providing strategic rationale for every creative decision.",
    icon: Wand2,
  },
  {
    title: "Brand Consistency",
    description:
      "Maintain your brand's unique voice and visual identity across all generated assets automatically.",
    icon: Hash,
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#02040b] px-4 py-10 text-zinc-100 sm:px-6">
      <div className="mx-auto max-w-[860px] space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-100">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <section className="space-y-4">
          <h1 className="max-w-2xl text-5xl font-semibold leading-tight">
            Everything you need to direct
            <br />
            <span className="text-blue-400">brilliant campaigns</span>
          </h1>
          <p className="max-w-xl text-sm text-zinc-400">
            WeaveDirector combines the power of advanced AI models with a workflow designed
            specifically for creative professionals.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-indigo-200/12 bg-[#0a0f1d]/85">
              <CardContent className="space-y-3 p-4">
                <div className="grid h-8 w-8 place-items-center rounded-md bg-blue-500/15">
                  <feature.icon className="h-4 w-4 text-blue-200" />
                </div>
                <h3 className="text-sm font-semibold">{feature.title}</h3>
                <p className="text-xs leading-relaxed text-zinc-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section>
          <Card className="border-indigo-200/12 bg-[#0a0f1d]/85">
            <CardContent className="space-y-4 py-8 text-center">
              <h2 className="text-2xl font-semibold">Ready to transform your workflow?</h2>
              <p className="mx-auto max-w-lg text-xs text-zinc-400">
                Join thousands of creative directors and marketers who are already using
                WeaveDirector to produce better campaigns, faster.
              </p>
              <Link href="/studio">
                <Button variant="primary" size="sm">Start Creating Now</Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

