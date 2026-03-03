"use client"

import Link from "next/link"
import { AlertTriangle, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-300" />
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-zinc-400">
          <p>{error.message || "Unexpected error."}</p>
          <div className="flex gap-2">
            <Button onClick={reset} variant="primary">
              Try Again
            </Button>
            <Link href="/">
              <Button variant="secondary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

