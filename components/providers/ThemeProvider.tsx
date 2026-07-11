"use client"

import { useEffect } from "react"
import { useAppStore } from "@/store/app-store"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useAppStore()

  useEffect(() => {
    // Read from localStorage on mount
    const saved = localStorage.getItem("carely.dark")
    if (saved === "1") {
      setTheme("dark")
      document.documentElement.classList.add("dark")
    } else {
      setTheme("light")
      document.documentElement.classList.remove("dark")
    }
  }, [])

  return <>{children}</>
}
