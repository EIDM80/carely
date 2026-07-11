"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Lock, Check } from "@/components/icons"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token) router.push("/forgot-password")
  }, [token, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError("Passwords don't match."); return }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return }
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (res.ok) {
        setDone(true)
      } else {
        setError(data.error || "Something went wrong.")
      }
    } catch {
      setError("Something went wrong.")
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

      <h1 className="text-[28px] font-extrabold mb-2 tracking-tight" style={{ color: "var(--text)" }}>
        Choose new password
      </h1>
      <p className="text-base mb-7 leading-relaxed" style={{ color: "var(--text2)" }}>
        Make it something you'll remember.
      </p>

      {done ? (
        <div
          className="flex flex-col items-center gap-4 py-10 rounded-2xl"
          style={{ background: "var(--surface)", border: "1px solid var(--border2)" }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "#E7F6EC" }}>
            <Check size={28} strokeWidth={2.5} style={{ color: "#22C55E" }} />
          </div>
          <div className="text-center px-4">
            <p className="font-bold text-lg mb-1" style={{ color: "var(--text)" }}>Password updated!</p>
            <p className="text-sm" style={{ color: "var(--text2)" }}>You can now sign in with your new password.</p>
          </div>
          <Link href="/login" className="text-sm font-semibold" style={{ color: "#7C5CFF" }}>
            Sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[13px] font-semibold mb-1.5 block" style={{ color: "var(--text2)" }}>
              New password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              minLength={8}
              className="w-full h-[54px] rounded-btn px-4 text-base outline-none"
              style={{ border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}
            />
          </div>
          <div>
            <label className="text-[13px] font-semibold mb-1.5 block" style={{ color: "var(--text2)" }}>
              Confirm password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              required
              className="w-full h-[54px] rounded-btn px-4 text-base outline-none"
              style={{ border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}
            />
          </div>

          {error && (
            <p className="text-sm font-semibold" style={{ color: "#EF4444" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-[54px] rounded-btn text-white font-bold text-base mt-2 disabled:opacity-70"
            style={{ background: "#7C5CFF", boxShadow: "0 14px 30px -10px rgba(124,92,255,.7)" }}
          >
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "var(--canvas)" }} />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
