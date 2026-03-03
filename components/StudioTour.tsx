"use client"

import { useEffect } from "react"
import { driver } from "driver.js"
import "driver.js/dist/driver.css"

const TOUR_STORAGE_KEY = "weavedirector_studio_tour_seen"

export function StudioTour() {
  useEffect(() => {
    if (typeof window === "undefined") return

    const seen = window.localStorage.getItem(TOUR_STORAGE_KEY)
    if (seen) return

    const hasTargets =
      document.querySelector("#tour-campaign-brief") &&
      document.querySelector("#tour-campaign-settings") &&
      document.querySelector("#tour-generate-button") &&
      document.querySelector("#tour-export-assets")

    if (!hasTargets) return

    const tour = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      overlayOpacity: 0.55,
      doneBtnText: "Done",
      nextBtnText: "Next",
      prevBtnText: "Back",
      steps: [
        {
          element: "#tour-campaign-brief",
          popover: {
            title: "Campaign Brief",
            description: "Describe your product, audience, and campaign goal here.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#tour-campaign-settings",
          popover: {
            title: "Campaign Settings",
            description: "Customize audience, style, duration, and enabled modules.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#tour-generate-button",
          popover: {
            title: "Generate Output",
            description: "Start live generation for strategy, copy, visuals, and storyboard.",
            side: "top",
            align: "center",
          },
        },
        {
          element: "#tour-export-assets",
          popover: {
            title: "Export Assets",
            description: "Export campaign results as Markdown, JSON, or downloaded images.",
            side: "bottom",
            align: "end",
          },
        },
      ],
      onDestroyed: () => {
        window.localStorage.setItem(TOUR_STORAGE_KEY, "true")
      },
    })

    const timer = window.setTimeout(() => {
      tour.drive()
    }, 450)

    return () => {
      window.clearTimeout(timer)
      tour.destroy()
    }
  }, [])

  return null
}

