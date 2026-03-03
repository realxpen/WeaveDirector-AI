"use client"

import { Copy, RefreshCw } from "lucide-react"
import ReactMarkdown from "react-markdown"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type SectionCardProps = {
  title: string
  content: string
  loading?: boolean
  onCopy?: () => void
  onRegenerate?: () => void
  children?: React.ReactNode
}

export function SectionCard({
  title,
  content,
  loading = false,
  onCopy,
  onRegenerate,
  children,
}: SectionCardProps) {
  return (
    <Card className={loading ? "gradient-border" : ""}>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">{title}</CardTitle>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={onCopy} aria-label={`Copy ${title}`}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={onRegenerate}
              aria-label={`Regenerate ${title}`}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && !content ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        ) : (
          <div className="prose prose-invert max-w-none prose-p:text-zinc-300 prose-headings:text-zinc-100">
            <ReactMarkdown>{content || "_No content yet_"}</ReactMarkdown>
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  )
}

