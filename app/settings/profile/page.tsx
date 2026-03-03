import Link from "next/link"
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Folder,
  Pencil,
  Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const recentCampaigns = [
  { title: "Summer Launch 2024", subtitle: "Social Media", age: "2 days ago" },
  { title: "Rebranding Concept", subtitle: "Brand Identity", age: "1 week ago" },
  { title: "Q3 Product Video", subtitle: "Video Storyboard", age: "2 weeks ago" },
  { title: "Holiday Promo", subtitle: "Email Campaign", age: "1 month ago" },
]

export default function ProfileSettingsPage() {
  return (
    <div className="min-h-screen bg-[#03050c] text-zinc-100">
      <header className="h-[110px] bg-gradient-to-r from-[#0e1e4d] via-[#171d52] to-[#2a0a45]" />

      <main className="mx-auto max-w-[980px] px-4 pb-12">
        <div className="-mt-12 mb-5">
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Back
            </Button>
          </Link>
        </div>

        <section className="mb-5 flex items-end justify-between gap-4">
          <div className="flex items-end gap-3">
            <div className="grid h-20 w-20 place-items-center rounded-full border-2 border-black bg-[#1d2346] text-3xl">
              🧑‍💼
            </div>
            <div className="pb-1">
              <h1 className="text-4xl font-semibold">Alex Creative</h1>
              <p className="text-sm text-zinc-400">Senior Art Director</p>
            </div>
          </div>

          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Edit Profile
          </Button>
        </section>

        <section className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="space-y-3">
            <Card className="border-indigo-200/12 bg-[#0a0f1d]/90">
              <CardContent className="space-y-3 p-4 text-xs">
                <p className="text-zinc-300">
                  Passionate about blending AI with traditional design workflows.
                  Specializing in brand identity and multi-channel campaigns.
                </p>
                <div className="space-y-2 border-t border-indigo-200/10 pt-3 text-zinc-400">
                  <p className="flex items-center gap-2">
                    <Folder className="h-3.5 w-3.5" />
                    New York, NY
                  </p>
                  <p className="flex items-center gap-2 text-blue-300">
                    <Star className="h-3.5 w-3.5" />
                    portfolio.design
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Joined March 2024
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-indigo-200/12 bg-[#0a0f1d]/90">
              <CardContent className="space-y-3 p-4">
                <p className="text-sm font-semibold">Stats</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-indigo-200/12 bg-[#070c18] p-3 text-center">
                    <p className="text-3xl font-semibold text-blue-300">42</p>
                    <p className="text-[10px] text-zinc-500">CAMPAIGNS</p>
                  </div>
                  <div className="rounded-lg border border-indigo-200/12 bg-[#070c18] p-3 text-center">
                    <p className="text-3xl font-semibold text-violet-300">128</p>
                    <p className="text-[10px] text-zinc-500">GENERATIONS</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">Recent Campaigns</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {recentCampaigns.map((campaign) => (
                <Card key={campaign.title} className="border-indigo-200/12 bg-[#0a0f1d]/90">
                  <CardContent className="space-y-2 p-3">
                    <div className="flex items-center justify-between text-zinc-500">
                      <Star className="h-3.5 w-3.5" />
                      <span className="flex items-center gap-1 text-[10px]">
                        <Clock3 className="h-3 w-3" />
                        {campaign.age}
                      </span>
                    </div>
                    <p className="text-sm font-semibold">{campaign.title}</p>
                    <p className="text-[11px] text-zinc-400">{campaign.subtitle}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="pt-1">
              <Link href="/sessions">
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  View All Campaigns
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

