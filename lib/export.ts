import type { CampaignOptions, CampaignSectionsState, VisualItem } from "@/types/campaign"

function downloadBlob(filename: string, content: BlobPart, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function exportAsJson(filename: string, payload: unknown) {
  downloadBlob(filename, JSON.stringify(payload, null, 2), "application/json")
}

export function exportAsMarkdown(
  filename: string,
  sections: CampaignSectionsState,
  options?: CampaignOptions
) {
  const lines: string[] = ["# Campaign Pack", ""]

  if (options) {
    lines.push(
      `- Tone: ${options.tone}`,
      `- Platforms: ${options.platforms.join(", ")}`,
      `- Duration: ${options.duration}`,
      `- Audience: ${options.audience}`,
      ""
    )
  }

  for (const [section, content] of Object.entries(sections)) {
    lines.push(`## ${section.replaceAll("_", " ")}`, "", content || "_No content_", "")
  }

  downloadBlob(filename, lines.join("\n"), "text/markdown")
}

export function downloadAllImages(images: VisualItem[]) {
  images.forEach((image, index) => {
    const link = document.createElement("a")
    link.href = image.url
    link.download = image.title ? `${image.title}.jpg` : `visual-${index + 1}.jpg`
    link.target = "_blank"
    link.rel = "noreferrer"
    document.body.appendChild(link)
    link.click()
    link.remove()
  })
}

