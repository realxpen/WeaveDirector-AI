"use client"

import { useEffect } from "react"

import {
  applyAppearanceToDocument,
  getAppearanceForCurrentUserOrDefault,
  resolveThemeMode,
} from "@/lib/user-settings"

export function ThemeBoot() {
  useEffect(() => {
    const appearance = getAppearanceForCurrentUserOrDefault()
    applyAppearanceToDocument(appearance)

    if (appearance.theme !== "system") return

    const media = window.matchMedia("(prefers-color-scheme: light)")
    const onChange = () => {
      const resolved = resolveThemeMode("system")
      document.documentElement.dataset.resolvedTheme = resolved
      document.documentElement.style.colorScheme = resolved
    }

    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  return null
}
