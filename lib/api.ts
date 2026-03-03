import type {
  CampaignOptions,
  CampaignSection,
  SessionDetail,
  SessionSummary,
} from "@/types/campaign"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

type GenerateResponse = {
  streamUrl?: string
  sessionId?: string
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  })

  if (!res.ok) {
    const contentType = res.headers.get("content-type") ?? ""
    let message = "Request failed"

    if (contentType.includes("application/json")) {
      const data = (await res.json().catch(() => null)) as { message?: string } | null
      message = data?.message || message
    } else {
      const raw = await res.text()
      const looksLikeHtml = raw.includes("<html") || raw.includes("<!DOCTYPE html>")
      if (looksLikeHtml) {
        message = "Backend endpoint not found. Set NEXT_PUBLIC_API_BASE_URL to your API server."
      } else if (raw.trim()) {
        message = raw.trim().slice(0, 200)
      }
    }

    throw new ApiError(message, res.status)
  }

  const contentType = res.headers.get("content-type") ?? ""
  if (!contentType.includes("application/json")) {
    throw new ApiError("Invalid API response format. Expected JSON.", res.status)
  }

  return (await res.json()) as T
}

export function resolveStreamUrl(streamUrl: string): string {
  if (streamUrl.startsWith("http://") || streamUrl.startsWith("https://")) {
    return streamUrl
  }
  return `${API_BASE_URL}${streamUrl}`
}

export async function generateCampaign(brief: string, options: CampaignOptions) {
  return apiFetch<GenerateResponse>("/api/generate", {
    method: "POST",
    body: JSON.stringify({ brief, options }),
  })
}

export async function regenerateSection(sessionId: string, section: CampaignSection) {
  return apiFetch<{ ok: boolean }>("/api/regenerate", {
    method: "POST",
    body: JSON.stringify({ sessionId, section }),
  })
}

export async function fetchSessions() {
  return apiFetch<SessionSummary[]>("/api/sessions")
}

export async function fetchSessionById(id: string) {
  return apiFetch<SessionDetail>(`/api/sessions/${id}`)
}
