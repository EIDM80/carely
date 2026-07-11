"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Heart, Mail, Lock, Google } from "@/components/icons"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError("Invalid email or password.")
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  async function handleGoogle() {
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  return (
    <div className="flex flex-col min-h-screen px-7 pt-20 pb-8">
      {/* Logo */}
      <div
        className="w-[62px] h-[62px] rounded-[20px] flex items-center justify-center mb-6"
        style={{
          background: "linear-gradient(135deg,#7C5CFF,#9B87FF)",
          boxShadow: "0 16px 30px -12px rgba(124,92,255,.6)",
        }}
      >
        <Heart size={32} className="text-white" strokeWidth={2} />
      </div>

      <h1
        className="text-[28px] font-extrabold mb-1.5 tracking-tight"
        style={{ color: "var(--text)" }}
      >
        Welcome back
      </h1>
      <p className="text-base mb-8" style={{ color: "var(--text2)" }}>
        The people you love are waiting.
      </p>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSignIn} className="flex flex-col gap-0">
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
          className="flex items-center gap-2.5 h-[54px] rounded-btn px-4 mb-2"
          style={{ border: "1.5px solid var(--border)", background: "var(--surface)" }}
        >
          <Lock size={19} style={{ color: "#9B87FF" }} />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="flex-1 text-base bg-transparent outline-none"
            style={{ color: "var(--text)" }}
          />
        </div>

        <Link
          href="/forgot-password"
          className="self-end text-sm font-semibold mb-6"
          style={{ color: "#7C5CFF" }}
        >
          Forgot password?
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="h-[54px] rounded-btn text-white font-bold text-base mb-0 disabled:opacity-70 transition-opacity"
          style={{
            background: "#7C5CFF",
            boxShadow: "0 14px 30px -10px rgba(124,92,255,.7)",
          }}
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="flex items-center gap-3.5 my-6">
        <span className="flex-1 h-px" style={{ background: "var(--border)" }} />
        <span className="text-[13px] font-medium" style={{ color: "var(--text3)" }}>or</span>
        <span className="flex-1 h-px" style={{ background: "var(--border)" }} />
      </div>

      <button
        onClick={handleGoogle}
        className="h-[54px] rounded-btn font-semibold text-[15px] flex items-center justify-center gap-3"
        style={{
          background: "var(--surface)",
          border: "1.5px solid var(--border)",
          color: "var(--text)",
        }}
      >
        <Google size={20} />
        Continue with Google
      </button>

      <p className="text-center mt-auto pt-7 text-[15px]" style={{ color: "var(--text2)" }}>
        New to Carely?{" "}
        <Link href="/signup" className="font-bold" style={{ color: "#7C5CFF" }}>
          Create account
        </Link>
      </p>
    </div>
  )
}
