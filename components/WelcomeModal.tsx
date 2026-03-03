"use client"

import { useState } from "react"
import { Layers3, LayoutTemplate, PlayCircle, Sparkles, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const STORAGE_KEY = "weavedirector_welcome_seen"

const features = [
  {
    title: "Interleaved Output",
    description: "Watch text, strategy, and visuals generate seamlessly in a live canvas.",
    icon: Layers3,
  },
  {
    title: "Campaign Pack Generator",
    description: "Transform a simple brief into a complete, production-ready campaign pack.",
    icon: LayoutTemplate,
  },
  {
    title: "Video Storyboard Builder",
    description: "Automatically generate shot-by-shot video storyboards with visual descriptions.",
    icon: PlayCircle,
  },
]

export function WelcomeModal() {
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return false
    return !window.localStorage.getItem(STORAGE_KEY)
  })

  const handleClose = () => {
    setOpen(false)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "true")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => (!nextOpen ? handleClose() : setOpen(nextOpen))}>
      <DialogContent className="max-w-md border-indigo-200/20 bg-[#060b16] p-0">
        <div className="relative space-y-5 p-6">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-md p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
            aria-label="Close welcome modal"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="space-y-3 text-center">
            <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-blue-500/20">
              <Sparkles className="h-5 w-5 text-blue-200" />
            </div>
            <h2 className="text-3xl font-semibold">Welcome to WeaveDirector</h2>
            <p className="text-zinc-300">
              Your live multimodal AI creative director, powered by Gemini 1.5 Pro.
            </p>
          </div>

          <div className="space-y-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-indigo-200/15 bg-indigo-200/5 p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-md bg-indigo-400/15 p-1.5">
                    <feature.icon className="h-4 w-4 text-blue-200" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{feature.title}</p>
                    <p className="text-sm text-zinc-400">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button variant="primary" className="min-w-40" onClick={handleClose}>
              Get Started
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
