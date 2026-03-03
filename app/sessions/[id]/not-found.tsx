import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SessionNotFound() {
  return (
    <div className="px-4 py-6 sm:px-6">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Session not found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-zinc-400">
          <p>We could not find that session.</p>
          <Link href="/sessions">
            <Button variant="secondary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sessions
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

