import Link from "next/link"
import { Sparkles, LayoutDashboard, History, Settings, User, Search, Filter, MoreVertical, PlayCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function SessionsPage() {
  const sessions = [
    {
      id: 1,
      title: "Nexus Energy Launch",
      date: "Today, 10:42 AM",
      platforms: ["TikTok", "Instagram"],
      tone: "Bold",
      thumbnail: "https://picsum.photos/seed/gamer1/400/300"
    },
    {
      id: 2,
      title: "Summer Collection '26",
      date: "Yesterday, 3:15 PM",
      platforms: ["Instagram", "Pinterest"],
      tone: "Minimal",
      thumbnail: "https://picsum.photos/seed/fashion/400/300"
    },
    {
      id: 3,
      title: "B2B SaaS Webinar Promo",
      date: "Oct 24, 2025",
      platforms: ["LinkedIn", "Twitter"],
      tone: "Professional",
      thumbnail: "https://picsum.photos/seed/workspace/400/300"
    },
    {
      id: 4,
      title: "Eco-Friendly Packaging",
      date: "Oct 20, 2025",
      platforms: ["Instagram", "Facebook"],
      tone: "Playful",
      thumbnail: "https://picsum.photos/seed/nature/400/300"
    },
    {
      id: 5,
      title: "Fitness App Onboarding",
      date: "Oct 15, 2025",
      platforms: ["YouTube", "TikTok"],
      tone: "Modern",
      thumbnail: "https://picsum.photos/seed/fitness/400/300"
    },
    {
      id: 6,
      title: "Holiday Gift Guide",
      date: "Oct 10, 2025",
      platforms: ["Instagram", "Email"],
      tone: "Warm",
      thumbnail: "https://picsum.photos/seed/gift/400/300"
    }
  ]

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-50">
      {/* Left Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-zinc-800/40 bg-zinc-950/50 md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-zinc-800/40 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">WeaveDirector</span>
        </div>
        
        <nav className="flex-1 space-y-1 p-4">
          <Link href="/studio">
            <Button variant="ghost" className="w-full justify-start text-zinc-400">
              <Sparkles className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </Link>
          <Link href="/sessions">
            <Button variant="secondary" className="w-full justify-start bg-zinc-900">
              <History className="mr-2 h-4 w-4 text-blue-400" />
              Sessions
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start text-zinc-400">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Story Mode
          </Button>
        </nav>

        <div className="border-t border-zinc-800/40 p-4">
          <Button variant="ghost" className="w-full justify-start text-zinc-400">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-400 mt-1">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden relative">
        <header className="flex h-16 items-center justify-between border-b border-zinc-800/40 bg-zinc-950/80 px-6 backdrop-blur-xl z-10">
          <h1 className="text-lg font-semibold">Past Campaigns</h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
              <Input 
                type="search" 
                placeholder="Search campaigns..." 
                className="w-64 pl-9 bg-zinc-900/50 border-zinc-800 focus-visible:ring-blue-500/50" 
              />
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Filter className="h-4 w-4" />
            </Button>
            <Link href="/studio">
              <Button variant="primary" size="sm" className="h-9">
                <Sparkles className="mr-2 h-4 w-4" />
                New
              </Button>
            </Link>
          </div>
        </header>

        <ScrollArea className="flex-1 p-6">
          <div className="mx-auto max-w-6xl pb-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <Card key={session.id} className="group border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors overflow-hidden flex flex-col">
                  <div className="relative aspect-video overflow-hidden bg-zinc-950 border-b border-zinc-800/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={session.thumbnail} 
                      alt={session.title} 
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-60"></div>
                    <div className="absolute top-3 right-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border-0 text-white">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem>Rename</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 focus:text-red-400">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      {session.platforms.map(p => (
                        <Badge key={p} variant="secondary" className="bg-black/40 hover:bg-black/60 backdrop-blur-md border-0 text-xs font-medium text-zinc-200">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg line-clamp-1 group-hover:text-blue-400 transition-colors">{session.title}</CardTitle>
                    <CardDescription className="text-xs">{session.date}</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 pt-2 mt-auto flex items-center justify-between">
                    <Badge variant="outline" className="border-zinc-800 text-zinc-400">{session.tone}</Badge>
                    <Link href="/studio">
                      <Button variant="ghost" size="sm" className="h-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                        Open <PlayCircle className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}
