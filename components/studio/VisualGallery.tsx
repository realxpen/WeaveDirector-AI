"use client"

import { Download, Expand } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { VisualItem } from "@/types/campaign"

type VisualGalleryProps = {
  images: VisualItem[]
}

export function VisualGallery({ images }: VisualGalleryProps) {
  const [active, setActive] = useState<VisualItem | null>(null)

  if (images.length === 0) return null

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <div key={`${image.url}-${index}`} className="overflow-hidden rounded-xl border border-indigo-200/15 bg-[#070d1a]">
            <Image
              src={image.url}
              alt={image.title || `Generated visual ${index + 1}`}
              width={800}
              height={600}
              unoptimized
              className="h-36 w-full object-cover"
            />
            <div className="flex items-center justify-between gap-2 p-2">
              <p className="truncate text-xs text-zinc-300">{image.title || `Visual ${index + 1}`}</p>
              <div className="flex">
                <Button size="icon" variant="ghost" onClick={() => setActive(image)} aria-label="Expand image">
                  <Expand className="h-4 w-4" />
                </Button>
                <a href={image.url} target="_blank" rel="noreferrer" download>
                  <Button size="icon" variant="ghost" aria-label="Download image">
                    <Download className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{active?.title || "Generated visual"}</DialogTitle>
            <DialogDescription>Expanded image preview.</DialogDescription>
          </DialogHeader>
          {active && (
            <Image
              src={active.url}
              alt={active.title || "Generated visual"}
              width={1400}
              height={1000}
              unoptimized
              className="max-h-[70vh] w-full rounded-lg object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

