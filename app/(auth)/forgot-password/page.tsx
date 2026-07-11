"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Lock, Mail, Check } from "@/components/icons"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setSent(true)
      } else {
        setError(data.error || "Something went wrong.")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen px-7 pt-20 pb-8">
      <Link
        href="/login"
        className="w-[42px] h-[42px] rounded-xl flex items-center justify-center mb-8"
        style={{ border: "1.5px solid var(--border)", background: "var(--surface)" }}
      >
        <ArrowLeft size={20} style={{ color: "var(--text)" }} />
      </Link>

      <div
        className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-6"
        style={{ background: "var(--lav)" }}
      >
        <Lock size={30} style={{ color: "#7C5CFF" }} />
      </div>

      <h1
        className="text-[28px] font-extrabold mb-2 tracking-tight"
        style={{ color: "var(--text)" }}
      >
        Reset password
      </h1>
      <p className="text-base mb-7 leading-relaxed" style={{ color: "var(--text2)" }}>
        Enter your email and we'll send you a link to get back in.
      </p>

      {sent ? (
        <div
          className="flex flex-col items-center gap-4 py-10 rounded-2xl"
          style={{ background: "var(--surface)", border: "1px solid var(--border2)" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "#E7F6EC" }}
          >
            <Check size={28} strokeWidth={2.5} style={{ color: "#22C55E" }} />
          </div>
          <div className="text-center px-4">
            <p className="font-bold text-lg mb-1" style={{ color: "var(--text)" }}>Check your inbox</p>
            <p className="text-sm" style={{ color: "var(--text2)" }}>
              If <strong>{email}</strong> has an account, a reset link is on its way.
            </p>
          </div>
          <Link href="/login" className="text-sm font-semibold" style={{ color: "#7C5CFF" }}>
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSend} className="flex flex-col">
          <label className="text-[13px] font-semibold mb-1.5" style={{ color: "var(--text2)" }}>
            Email
          </label>
          <div
            className="flex items-center gap-2.5 h-[54px] rounded-btn px-4 mb-3"
            style={{ border: "1.5px solid var(--border)", background: "var(--surface)" }}
          >
            <Mail size={19} style={{ color: "#9B87FF" }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="flex-1 text-base bg-transparent outline-none"
              style={{ color: "var(--text)" }}
            />
          </div>

          {error && (
            <p className="text-sm font-semibold mb-4" style={{ color: "#EF4444" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-[54px] rounded-btn text-white font-bold text-base mt-3 disabled:opacity-70"
            style={{
              background: "#7C5CFF",
              boxShadow: "0 14px 30px -10px rgba(124,92,255,.7)",
            }}
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
    </div>
  )
}
