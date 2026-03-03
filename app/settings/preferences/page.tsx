import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { AppShell } from "@/components/layout/AppShell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export default function PreferencesPage() {
  return (
    <AppShell>
      <div className="space-y-4 px-4 py-6 sm:px-6">
        <Link href="/settings">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-300">Email updates</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-300">Auto-save sessions</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-300">Experimental features</span>
              <Switch />
            </div>
            <Button variant="primary" size="sm">Save Preferences</Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}

