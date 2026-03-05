"use client"

import { CreditCard, Download, Plus, Trash2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { SettingsShell } from "@/components/settings/SettingsShell"
import { getSession } from "@/lib/auth"
import {
  createPaymentMethod,
  getCurrentUserSettings,
  patchCurrentUserSettings,
  type InvoiceItem,
  type PaymentMethod,
  type PlanType,
} from "@/lib/user-settings"

const planPrices: Record<PlanType, string> = {
  free: "$0",
  pro: "$49",
  team: "$129",
}

function downloadInvoice(item: InvoiceItem) {
  const content = [
    `Invoice: ${item.id}`,
    `Date: ${item.date}`,
    `Amount: ${item.amount}`,
    `Status: ${item.status.toUpperCase()}`,
    "",
    "Billed by WeaveDirector",
  ].join("\n")
  const blob = new Blob([content], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${item.id}.txt`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export default function BillingSettingsPage() {
  const router = useRouter()
  const [plan, setPlan] = useState<PlanType>("pro")
  const [autoRenew, setAutoRenew] = useState(true)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [invoices, setInvoices] = useState<InvoiceItem[]>([])
  const [cardBrand, setCardBrand] = useState("")
  const [cardLast4, setCardLast4] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [toast, setToast] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const session = getSession()
    if (!session) {
      router.push("/signin?redirect=/settings/billing")
      return
    }
    const billing = getCurrentUserSettings().billing
    setPlan(billing.plan)
    setAutoRenew(billing.autoRenew)
    setPaymentMethods(billing.paymentMethods)
    setInvoices(billing.invoices)
  }, [router])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(timer)
  }, [toast])

  const planLabel = useMemo(() => plan.charAt(0).toUpperCase() + plan.slice(1), [plan])

  const persist = (
    next: Partial<{
      plan: PlanType
      autoRenew: boolean
      paymentMethods: PaymentMethod[]
      invoices: InvoiceItem[]
    }>
  ) => {
    patchCurrentUserSettings({
      billing: {
        plan: next.plan ?? plan,
        autoRenew: next.autoRenew ?? autoRenew,
        paymentMethods: next.paymentMethods ?? paymentMethods,
        invoices: next.invoices ?? invoices,
      },
    })
  }

  const onSavePlan = () => {
    persist({ plan, autoRenew })
    setToast("Billing plan updated")
  }

  const onAddPaymentMethod = () => {
    setError(null)
    if (!cardLast4.trim() || cardLast4.trim().length < 4) {
      setError("Enter the last 4 digits of the card.")
      return
    }
    if (!cardExpiry.trim()) {
      setError("Enter card expiry.")
      return
    }
    const method = createPaymentMethod(cardBrand || "Card", cardLast4, cardExpiry)
    const next = [method, ...paymentMethods]
    setPaymentMethods(next)
    persist({ paymentMethods: next })
    setCardBrand("")
    setCardLast4("")
    setCardExpiry("")
    setToast("Payment method added")
  }

  const onRemoveMethod = (id: string) => {
    const next = paymentMethods.filter((method) => method.id !== id)
    setPaymentMethods(next)
    persist({ paymentMethods: next })
    setToast("Payment method removed")
  }

  return (
    <SettingsShell active="billing" title="Billing & Subscription">
      <Card className="border-indigo-200/12 bg-[linear-gradient(90deg,#131827_0%,#141823_50%,#18142a_100%)]">
        <CardContent className="flex flex-wrap items-end justify-between gap-4 p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-3xl font-semibold">{planLabel} Plan</p>
              <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-300">
                Active
              </Badge>
            </div>
            <p className="text-sm text-zinc-300">Select your plan and billing preferences.</p>
            <p className="text-5xl font-semibold">
              {planPrices[plan]}<span className="text-base text-zinc-400">/month</span>
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              {(["free", "pro", "team"] as PlanType[]).map((option) => (
                <Button
                  key={option}
                  variant={plan === option ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setPlan(option)}
                >
                  {option.toUpperCase()}
                </Button>
              ))}
            </div>
            <div className="flex items-center justify-between rounded-md border border-indigo-200/10 bg-[#070c18] px-3 py-2">
              <span className="text-xs text-zinc-300">Auto-renew</span>
              <Switch checked={autoRenew} onCheckedChange={setAutoRenew} />
            </div>
            <Button variant="primary" size="sm" className="w-full" onClick={onSavePlan}>
              Save Plan Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-indigo-200/12 bg-[#0a0f1d]/90">
        <CardContent className="space-y-4 p-4">
          <p className="text-2xl font-semibold">Payment Method</p>
          {paymentMethods.length === 0 ? (
            <p className="text-xs text-zinc-400">No payment methods saved.</p>
          ) : (
            paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between rounded-lg border border-indigo-200/12 bg-[#070c18] p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-md bg-white/5">
                    <CreditCard className="h-4 w-4 text-zinc-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {method.brand} ending in {method.last4}
                    </p>
                    <p className="text-xs text-zinc-400">Expires {method.expiry}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onRemoveMethod(method.id)}>
                  <Trash2 className="mr-1 h-3.5 w-3.5" />
                  Remove
                </Button>
              </div>
            ))
          )}

          <div className="grid gap-2 border-t border-indigo-200/10 pt-4 sm:grid-cols-[1fr_90px_90px_auto]">
            <Input
              value={cardBrand}
              onChange={(e) => setCardBrand(e.target.value)}
              placeholder="Card Brand"
              className="h-8 text-xs"
            />
            <Input
              value={cardLast4}
              onChange={(e) => setCardLast4(e.target.value)}
              placeholder="Last 4"
              className="h-8 text-xs"
            />
            <Input
              value={cardExpiry}
              onChange={(e) => setCardExpiry(e.target.value)}
              placeholder="MM/YYYY"
              className="h-8 text-xs"
            />
            <Button variant="outline" size="sm" onClick={onAddPaymentMethod}>
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add
            </Button>
          </div>
          {error && <p className="text-xs text-rose-300">{error}</p>}
        </CardContent>
      </Card>

      <Card className="border-indigo-200/12 bg-[#0a0f1d]/90">
        <CardContent className="space-y-4 p-4">
          <p className="text-2xl font-semibold">Billing History</p>
          {invoices.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-t border-indigo-200/10 pt-3">
              <div>
                <p className="font-semibold">{new Date(item.date).toLocaleDateString()}</p>
                <p className="text-xs text-zinc-500">#{item.id}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-semibold">{item.amount}</p>
                <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-300">
                  {item.status === "paid" ? "Paid" : "Open"}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => downloadInvoice(item)}>
                  <Download className="mr-1 h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {toast && (
        <div className="fixed bottom-4 right-4 rounded-md border border-indigo-200/15 bg-[#0a1020] px-3 py-2 text-xs">
          {toast}
        </div>
      )}
    </SettingsShell>
  )
}
