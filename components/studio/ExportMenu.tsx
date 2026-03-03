"use client"

import { ChevronDown, Download, FileJson, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { downloadAllImages, exportAsJson, exportAsMarkdown } from "@/lib/export"
import type { CampaignOptions, CampaignSectionsState, VisualItem } from "@/types/campaign"

type ExportMenuProps = {
  sections: CampaignSectionsState
  images: VisualItem[]
  options?: CampaignOptions
  filenamePrefix?: string
}

export function ExportMenu({ sections, images, options, filenamePrefix = "campaign-pack" }: ExportMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Export
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportAsMarkdown(`${filenamePrefix}.md`, sections, options)}>
          <FileText className="mr-2 h-4 w-4" />
          Export as Markdown
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => exportAsJson(`${filenamePrefix}.json`, { options, sections, images })}
        >
          <FileJson className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => downloadAllImages(images)}>
          <Download className="mr-2 h-4 w-4" />
          Download Images
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

