"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { ArrowLeft, User, Mail, Lock } from "@/components/icons"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Something went wrong.")
        setLoading(false)
        return
      }
      // Auto sign-in after registration
      const result = await signIn("credentials", { email, password, redirect: false })
      if (result?.error) {
        setError("Account created! Please sign in.")
        router.push("/login")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen px-7 pt-20 pb-8">
      <Link
        href="/login"
        className="w-[42px] h-[42px] rounded-xl flex items-center justify-center mb-6"
        style={{ border: "1.5px solid var(--border)", background: "var(--surface)" }}
      >
        <ArrowLeft size={20} style={{ color: "var(--text)" }} />
      </Link>

      <h1
        className="text-[28px] font-extrabold mb-1.5 tracking-tight"
        style={{ color: "var(--text)" }}
      >
        Create your account
      </h1>
      <p className="text-base mb-7" style={{ color: "var(--text2)" }}>
        Start caring without the stress.
      </p>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="flex flex-col">
        <label className="text-[13px] font-semibold mb-1.5" style={{ color: "var(--text2)" }}>
          Full name
        </label>
        <div
          className="flex items-center gap-2.5 h-[54px] rounded-btn px-4 mb-4"
          style={{ border: "1.5px solid var(--border)", background: "var(--surface)" }}
        >
          <User size={19} style={{ color: "#9B87FF" }} />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="flex-1 text-base bg-transparent outline-none"
            style={{ color: "var(--text)" }}
          />
        </div>

        <label className="text-[13px] font-semibold mb-1.5" style={{ color: "var(--text2)" }}>
          Email
        </label>
        <div
          className="flex items-center gap-2.5 h-[54px] rounded-btn px-4 mb-4"
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

        <label className="text-[13px] font-semibold mb-1.5" style={{ color: "var(--text2)" }}>
          Password
        </label>
        <div
          className="flex items-center gap-2.5 h-[54px] rounded-btn px-4 mb-6"
          style={{ border: "1.5px solid var(--border)", background: "var(--surface)" }}
        >
          <Lock size={19} style={{ color: "#9B87FF" }} />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            required
            minLength={8}
            className="flex-1 text-base bg-transparent outline-none"
            style={{ color: "var(--text)" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-[54px] rounded-btn text-white font-bold text-base disabled:opacity-70 transition-opacity"
          style={{
            background: "#7C5CFF",
            boxShadow: "0 14px 30px -10px rgba(124,92,255,.7)",
          }}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>

        <p className="text-xs text-center mt-3.5 mx-1 leading-relaxed" style={{ color: "var(--text3)" }}>
          By continuing you agree to Carely's Terms & Privacy Policy. Your moments stay private and encrypted.
        </p>
      </form>

      <p className="text-center mt-auto pt-7 text-[15px]" style={{ color: "var(--text2)" }}>
        Already have an account?{" "}
        <Link href="/login" className="font-bold" style={{ color: "#7C5CFF" }}>
          Sign in
        </Link>
      </p>
    </div>
  )
}
