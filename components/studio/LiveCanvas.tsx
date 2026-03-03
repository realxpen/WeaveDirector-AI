"use client"

import { LoaderCircle } from "lucide-react"

import { SectionCard } from "@/components/studio/SectionCard"
import { VisualGallery } from "@/components/studio/VisualGallery"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { CampaignSection, CampaignSectionsState, VisualItem } from "@/types/campaign"
import { SECTION_ORDER } from "@/types/campaign"

const sectionTitles: Record<CampaignSection, string> = {
  brief_summary: "Brief Summary",
  strategy: "Strategy",
  copy_pack: "Copy Pack",
  visual_pack: "Visual Pack",
  video_pack: "Video Pack",
  social_pack: "Social Pack",
}

type LiveCanvasProps = {
  sections: CampaignSectionsState
  sectionLoading: Partial<Record<CampaignSection, boolean>>
  visuals: VisualItem[]
  isGenerating: boolean
  onCopySection: (section: CampaignSection) => void
  onRegenerateSection: (section: CampaignSection) => void
}

export function LiveCanvas({
  sections,
  sectionLoading,
  visuals,
  isGenerating,
  onCopySection,
  onRegenerateSection,
}: LiveCanvasProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Live Canvas</h2>
        {isGenerating && (
          <Badge variant="secondary" className="bg-blue-500/15 text-blue-200">
            <LoaderCircle className="mr-2 h-3.5 w-3.5 animate-spin" />
            Streaming
          </Badge>
        )}
      </div>
      <Separator />

      {SECTION_ORDER.map((section) => (
        <SectionCard
          key={section}
          title={sectionTitles[section]}
          content={sections[section]}
          loading={Boolean(sectionLoading[section])}
          onCopy={() => onCopySection(section)}
          onRegenerate={() => onRegenerateSection(section)}
        >
          {section === "visual_pack" && <VisualGallery images={visuals} />}
        </SectionCard>
      ))}
    </section>
  )
}

