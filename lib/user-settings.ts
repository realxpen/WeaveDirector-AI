import { getSession } from "@/lib/auth"

export type ThemeMode = "dark" | "light" | "system"
export type DensityMode = "comfortable" | "compact"
export type PlanType = "free" | "pro" | "team"

export type PaymentMethod = {
  id: string
  brand: string
  last4: string
  expiry: string
}

export type InvoiceItem = {
  id: string
  date: string
  amount: string
  status: "paid" | "open"
}

export type UserSettings = {
  notifications: {
    emailCampaignGenerations: boolean
    emailMarketingUpdates: boolean
    emailWeeklyDigest: boolean
    inAppMentions: boolean
    inAppWorkspaceInvites: boolean
  }
  appearance: {
    theme: ThemeMode
    density: DensityMode
  }
  billing: {
    plan: PlanType
    autoRenew: boolean
    paymentMethods: PaymentMethod[]
    invoices: InvoiceItem[]
  }
  security: {
    twoFactorEnabled: boolean
  }
}

const SETTINGS_KEY = "weavedirector.userSettings"

function inBrowser() {
  return typeof window !== "undefined"
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function defaultSettings(): UserSettings {
  return {
    notifications: {
      emailCampaignGenerations: true,
      emailMarketingUpdates: false,
      emailWeeklyDigest: true,
      inAppMentions: true,
      inAppWorkspaceInvites: true,
    },
    appearance: {
      theme: "dark",
      density: "comfortable",
    },
    billing: {
      plan: "pro",
      autoRenew: true,
      paymentMethods: [
        {
          id: generateId(),
          brand: "Visa",
          last4: "4242",
          expiry: "12/2026",
        },
      ],
      invoices: [
        { id: "INV-2026-03", date: "2026-03-01", amount: "$49.00", status: "paid" },
        { id: "INV-2026-02", date: "2026-02-01", amount: "$49.00", status: "paid" },
        { id: "INV-2026-01", date: "2026-01-01", amount: "$49.00", status: "paid" },
      ],
    },
    security: {
      twoFactorEnabled: false,
    },
  }
}

function readStore(): Record<string, UserSettings> {
  if (!inBrowser()) return {}
  const raw = window.localStorage.getItem(SETTINGS_KEY)
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw) as Record<string, UserSettings>
    return parsed && typeof parsed === "object" ? parsed : {}
  } catch {
    return {}
  }
}

function writeStore(store: Record<string, UserSettings>) {
  if (!inBrowser()) return
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(store))
}

function currentEmailOrThrow() {
  const session = getSession()
  if (!session?.email) {
    throw new Error("Not signed in.")
  }
  return normalizeEmail(session.email)
}

export function getCurrentUserSettings(): UserSettings {
  const email = currentEmailOrThrow()
  const store = readStore()
  if (!store[email]) {
    store[email] = defaultSettings()
    writeStore(store)
  }
  return store[email]
}

export function saveCurrentUserSettings(next: UserSettings): void {
  const email = currentEmailOrThrow()
  const store = readStore()
  store[email] = next
  writeStore(store)
}

export function patchCurrentUserSettings(patch: Partial<UserSettings>): UserSettings {
  const current = getCurrentUserSettings()
  const next: UserSettings = {
    ...current,
    ...patch,
    notifications: {
      ...current.notifications,
      ...(patch.notifications ?? {}),
    },
    appearance: {
      ...current.appearance,
      ...(patch.appearance ?? {}),
    },
    billing: {
      ...current.billing,
      ...(patch.billing ?? {}),
    },
    security: {
      ...current.security,
      ...(patch.security ?? {}),
    },
  }
  saveCurrentUserSettings(next)
  return next
}

export function applyAppearanceToDocument(settings: UserSettings["appearance"]) {
  if (!inBrowser()) return
  const resolved = resolveThemeMode(settings.theme)
  document.documentElement.dataset.theme = settings.theme
  document.documentElement.dataset.resolvedTheme = resolved
  document.documentElement.dataset.density = settings.density
  document.documentElement.style.colorScheme = resolved
}

export function resolveThemeMode(mode: ThemeMode): "dark" | "light" {
  if (mode === "dark" || mode === "light") {
    return mode
  }
  if (!inBrowser()) {
    return "dark"
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
}

export function getAppearanceForCurrentUserOrDefault(): UserSettings["appearance"] {
  try {
    return getCurrentUserSettings().appearance
  } catch {
    return defaultSettings().appearance
  }
}

export function createPaymentMethod(brand: string, last4: string, expiry: string): PaymentMethod {
  return {
    id: generateId(),
    brand: brand.trim() || "Card",
    last4: last4.trim().slice(-4),
    expiry: expiry.trim(),
  }
}
