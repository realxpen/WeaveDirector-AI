"use client"

import { AlertCircle, LoaderCircle, PauseCircle, PlayCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

type BriefInputProps = {
  brief: string
  isGenerating: boolean
  onBriefChange: (brief: string) => void
  onGenerate: () => void
  onStop: () => void
}

export function BriefInput({
  brief,
  isGenerating,
  onBriefChange,
  onGenerate,
  onStop,
}: BriefInputProps) {
  const isValid = brief.trim().length >= 20

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Campaign Brief</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={brief}
          onChange={(event) => onBriefChange(event.target.value)}
          placeholder="Describe your product, audience, and campaign goal..."
          className="min-h-32"
        />

        {!isValid && (
          <p className="flex items-center gap-2 text-sm text-amber-300">
            <AlertCircle className="h-4 w-4" />
            Brief must be at least 20 characters.
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <Button onClick={onGenerate} disabled={!isValid || isGenerating} variant="primary">
            {isGenerating ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Generating
              </>
            ) : (
              <>
                <PlayCircle className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>
          <Button onClick={onStop} disabled={!isGenerating} variant="secondary">
            <PauseCircle className="mr-2 h-4 w-4" />
            Stop
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

