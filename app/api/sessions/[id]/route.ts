import { NextResponse } from "next/server"

type Params = {
  params: Promise<{ id: string }>
}

const sessionDetailMap: Record<
  string,
  {
    id: string
    title: string
    createdAt: string
    options: {
      tone: "Professional" | "Bold" | "Playful" | "Minimal"
      platforms: ("Instagram" | "TikTok" | "YouTube" | "LinkedIn")[]
      duration: "15s" | "30s"
      audience: string
    }
    sections: {
      brief_summary: string
      strategy: string
      copy_pack: string
      visual_pack: string
      video_pack: string
      social_pack: string
    }
    images: { url: string; title: string }[]
  }
> = {
  "nexus-energy-launch": {
    id: "nexus-energy-launch",
    title: "Nexus Energy Launch",
    createdAt: "2026-03-03T10:42:00.000Z",
    options: {
      tone: "Bold",
      platforms: ["TikTok", "Instagram"],
      duration: "15s",
      audience: "Gen Z Gamers",
    },
    sections: {
      brief_summary: "Launch campaign for Nexus Energy targeting competitive gamers.",
      strategy:
        "Position Nexus as the no-crash performance drink for reflex-heavy play sessions.",
      copy_pack:
        "## Headline\nUnleash Your Reflexes.\n\n## Body\nNo sugar. No crash. Pure focus for high-stakes gameplay.",
      visual_pack:
        "Use high-contrast cyberpunk scenes, energy streaks, and close-up product hero shots.",
      video_pack:
        "Shot 1: Gamer close-up.\nShot 2: Can crack and pour.\nShot 3: Reaction-speed montage.\nShot 4: Product lockup + CTA.",
      social_pack:
        "TikTok: Fast cuts + challenge hook.\nInstagram: Carousel with product benefits and visual story.",
    },
    images: [
      { url: "https://picsum.photos/seed/nexus-1/1024/640", title: "Hero Key Visual" },
      { url: "https://picsum.photos/seed/nexus-2/1024/640", title: "Product Close-up" },
      { url: "https://picsum.photos/seed/nexus-3/1024/640", title: "Gameplay Moment" },
    ],
  },
}

export async function GET(_: Request, { params }: Params) {
  const { id } = await params

  const detail = sessionDetailMap[id] ?? {
    id,
    title: "Generated Session",
    createdAt: new Date().toISOString(),
    options: {
      tone: "Professional" as const,
      platforms: ["LinkedIn"] as const,
      duration: "30s" as const,
      audience: "Marketing Leads",
    },
    sections: {
      brief_summary: "Session details loaded from local fallback API.",
      strategy: "Use clear value messaging and concise visual storytelling.",
      copy_pack: "Headline: Build campaigns faster.\nBody: From brief to pack in minutes.",
      visual_pack: "Simple clean visuals with brand-forward compositions.",
      video_pack: "3-shot narrative with intro, value, and CTA.",
      social_pack: "LinkedIn post + hashtag set.",
    },
    images: [
      { url: "https://picsum.photos/seed/fallback-1/1024/640", title: "Fallback Visual 1" },
      { url: "https://picsum.photos/seed/fallback-2/1024/640", title: "Fallback Visual 2" },
    ],
  }

  return NextResponse.json(detail)
}

