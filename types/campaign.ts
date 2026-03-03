export const SECTION_ORDER = [
  "brief_summary",
  "strategy",
  "copy_pack",
  "visual_pack",
  "video_pack",
  "social_pack",
] as const

export type CampaignSection = (typeof SECTION_ORDER)[number]

export type Tone = "Professional" | "Bold" | "Playful" | "Minimal"
export type Platform = "Instagram" | "TikTok" | "YouTube" | "LinkedIn"
export type Duration = "15s" | "30s"

export type CampaignOptions = {
  tone: Tone
  platforms: Platform[]
  duration: Duration
  audience: string
}

export type StreamEvent =
  | { type: "section_start"; section: CampaignSection }
  | { type: "section_chunk"; section: CampaignSection; chunk: string }
  | { type: "image_generated"; section: "visual_pack"; url: string; title?: string }
  | { type: "section_end"; section: CampaignSection }
  | { type: "done"; sessionId: string }
  | { type: "error"; message: string }

export type VisualItem = {
  url: string
  title?: string
}

export type CampaignSectionsState = Record<CampaignSection, string>

export type SessionSummary = {
  id: string
  title: string
  createdAt: string
  tone: Tone
  platforms: Platform[]
}

export type SessionDetail = {
  id: string
  title: string
  createdAt: string
  options: CampaignOptions
  sections: Partial<CampaignSectionsState>
  images: VisualItem[]
}

export const EMPTY_SECTIONS: CampaignSectionsState = {
  brief_summary: "",
  strategy: "",
  copy_pack: "",
  visual_pack: "",
  video_pack: "",
  social_pack: "",
}

