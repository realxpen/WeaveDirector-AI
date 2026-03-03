import { NextResponse } from "next/server"

const sessions = [
  {
    id: "nexus-energy-launch",
    title: "Nexus Energy Launch",
    createdAt: "2026-03-03T10:42:00.000Z",
    tone: "Bold",
    platforms: ["TikTok", "Instagram"],
  },
  {
    id: "summer-collection-26",
    title: "Summer Collection 26",
    createdAt: "2026-03-02T15:15:00.000Z",
    tone: "Minimal",
    platforms: ["Instagram", "Pinterest"],
  },
  {
    id: "b2b-webinar-promo",
    title: "B2B SaaS Webinar Promo",
    createdAt: "2026-03-01T11:20:00.000Z",
    tone: "Professional",
    platforms: ["LinkedIn", "Twitter"],
  },
  {
    id: "eco-packaging",
    title: "Eco-Friendly Packaging",
    createdAt: "2026-02-28T09:50:00.000Z",
    tone: "Playful",
    platforms: ["Instagram", "Facebook"],
  },
  {
    id: "fitness-app-onboarding",
    title: "Fitness App Onboarding",
    createdAt: "2026-02-27T14:10:00.000Z",
    tone: "Modern",
    platforms: ["YouTube", "TikTok"],
  },
  {
    id: "holiday-gift-guide",
    title: "Holiday Gift Guide",
    createdAt: "2026-02-26T16:30:00.000Z",
    tone: "Warm",
    platforms: ["Instagram", "Email"],
  },
]

export async function GET() {
  return NextResponse.json(sessions)
}

