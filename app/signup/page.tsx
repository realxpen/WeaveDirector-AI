"use client"

import Link from "next/link"
import { ArrowLeft, Github, Mail } from "lucide-react"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (!res.ok) {
        const message = await res.text()
        throw new Error(message || "Sign up failed")
      }

      router.push("/signin")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#02040b] px-4 text-zinc-100">
      <div className="w-full max-w-[320px]">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-100">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <Card className="border-indigo-200/15 bg-[#0a0f1d]/90">
          <CardContent className="space-y-4 p-4">
            <div>
              <h1 className="text-3xl font-semibold">Create an account</h1>
              <p className="mt-1 text-sm text-zinc-400">Enter your email below to create your account</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="h-9 text-xs">
                <Github className="mr-2 h-3.5 w-3.5" />
                GitHub
              </Button>
              <Button variant="outline" size="sm" className="h-9 text-xs">
                <Mail className="mr-2 h-3.5 w-3.5" />
                Google
              </Button>
            </div>

            <div className="relative text-center text-[10px] text-zinc-500">
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-indigo-200/10" />
              <span className="relative bg-[#0a0f1d] px-2">OR CONTINUE WITH</span>
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-zinc-300">Name</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-300">Email</label>
                <Input
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-300">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              {error && <p className="text-xs text-rose-300">{error}</p>}

              <Button type="submit" variant="primary" className="h-9 w-full text-xs" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-xs text-zinc-400">
              Already have an account?{" "}
              <Link href="/signin" className="font-semibold text-blue-300 hover:text-blue-200">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
