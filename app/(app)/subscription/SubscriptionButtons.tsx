"use client"

import { useState } from "react"
import { useAppStore } from "@/store/app-store"

interface Plan {
  id: string
  name: string
  recommended: boolean
  gradient: string | null
}

export function SubscriptionButtons({
  plan,
  isCurrent,
}: {
  plan: Plan
  isCurrent: boolean
}) {
  const [loading, setLoading] = useState(false)
  const { showToast } = useAppStore()

  if (plan.id === "free" || isCurrent) {
    return (
      <button
        disabled
        className="w-full h-12 rounded-[13px] font-bold text-[15px] opacity-60 cursor-default"
        style={{
          background: plan.gradient ? "rgba(255,255,255,.25)" : "var(--border2)",
          color: plan.gradient ? "#fff" : "var(--text3)",
          border: plan.gradient ? "1px solid rgba(255,255,255,.3)" : "none",
        }}
      >
        {isCurrent ? "Current plan" : "Free forever"}
      </button>
    )
  }

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.id }),
      })
      const data = await res.json()
      if (res.ok && data.url) {
        window.location.href = data.url
      } else {
        showToast(data.error || "Could not start checkout.", "error")
      }
    } catch {
      showToast("Something went wrong.", "error")
    } finally {
      setLoading(false)
    }
  }

  const label = plan.id === "premium" ? "Start 7-day free trial" : "Choose Family"

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full h-12 rounded-[13px] font-bold text-[15px] transition-all disabled:opacity-60"
      style={{
        background: plan.gradient ? "rgba(255,255,255,.25)" : "#7C5CFF",
        color: "#fff",
        border: plan.gradient ? "1px solid rgba(255,255,255,.3)" : "none",
      }}
    >
      {loading ? "Redirecting…" : label}
    </button>
  )
}
