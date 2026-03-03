"use client"

import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CampaignOptions, Platform } from "@/types/campaign"

const platformOptions: Platform[] = ["Instagram", "TikTok", "YouTube", "LinkedIn"]

type SettingsPanelProps = {
  options: CampaignOptions
  onChange: (options: CampaignOptions) => void
}

export function SettingsPanel({ options, onChange }: SettingsPanelProps) {
  const togglePlatform = (platform: Platform) => {
    const exists = options.platforms.includes(platform)
    const platforms = exists
      ? options.platforms.filter((item) => item !== platform)
      : [...options.platforms, platform]

    onChange({ ...options, platforms })
  }

  return (
    <div className="space-y-5">
      <h2 className="text-sm font-semibold text-zinc-200">Campaign Settings</h2>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-zinc-500">Tone</p>
        <Select value={options.tone} onValueChange={(value) => onChange({ ...options, tone: value as CampaignOptions["tone"] })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Professional">Professional</SelectItem>
            <SelectItem value="Bold">Bold</SelectItem>
            <SelectItem value="Playful">Playful</SelectItem>
            <SelectItem value="Minimal">Minimal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-zinc-500">Platforms</p>
        <div className="grid grid-cols-2 gap-2">
          {platformOptions.map((platform) => {
            const active = options.platforms.includes(platform)
            return (
              <Button
                key={platform}
                variant={active ? "secondary" : "outline"}
                className="justify-start"
                onClick={() => togglePlatform(platform)}
              >
                {active && <Check className="mr-2 h-4 w-4" />}
                {platform}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-zinc-500">Duration</p>
        <Select
          value={options.duration}
          onValueChange={(value) => onChange({ ...options, duration: value as CampaignOptions["duration"] })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15s">15s</SelectItem>
            <SelectItem value="30s">30s</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-zinc-500">Audience</p>
        <Input
          value={options.audience}
          onChange={(event) => onChange({ ...options, audience: event.target.value })}
          placeholder="e.g. founders and growth marketers"
        />
      </div>
    </div>
  )
}

