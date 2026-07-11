"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/app-store"
import { ArrowLeft, Camera } from "@/components/icons"

const RELATIONS = ["Wife", "Husband", "Partner", "Child", "Parent", "Sibling", "Friend", "Colleague"]
const COLORS = ["#FFE0D4", "#DCEEFF", "#EDE8FF", "#FFE7E1", "#E3F0FF", "#D1FAE5", "#FEF3C7", "#FCE7F3"]

export default function NewPersonPage() {
  const router = useRouter()
  const { showToast } = useAppStore()

  const [name, setName] = useState("")
  const [relation, setRelation] = useState("Friend")
  const [notes, setNotes] = useState("")
  const [color, setColor] = useState(COLORS[0])
  const [loading, setLoading] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)

    try {
      const res = await fetch("/api/people", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), relation, notes, color }),
      })
      if (res.ok) {
        showToast(`${name} added to your circle!`, "success")
        router.push("/people")
        router.refresh()
      } else {
        const data = await res.json()
        showToast(data.error || "Something went wrong.", "error")
      }
    } catch {
      showToast("Something went wrong.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen animate-slideUp pb-8"
      style={{ background: "var(--canvas)" }}
    >
      <div className="px-5 pt-16">
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-7">
          <Link
            href="/people"
            className="w-[42px] h-[42px] rounded-xl flex items-center justify-center"
            style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
          >
            <ArrowLeft size={20} style={{ color: "var(--text)" }} />
          </Link>
          <h1 className="text-[22px] font-extrabold" style={{ color: "var(--text)" }}>
            Add a person
          </h1>
        </div>

        <form onSubmit={handleSave}>
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div
              className="w-24 h-24 rounded-full flex flex-col items-center justify-center gap-1 cursor-pointer"
              style={{
                background: color,
                border: "2px dashed #C9BEFF",
                color: "#7C5CFF",
              }}
            >
              <Camera size={26} />
              <span className="text-[11px] font-semibold">Photo</span>
            </div>
          </div>

          {/* Name */}
          <label className="text-[13px] font-semibold mb-2 block" style={{ color: "var(--text2)" }}>
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sarah"
            required
            className="w-full h-[54px] rounded-btn px-4 text-base outline-none mb-5"
            style={{
              border: "1.5px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text)",
            }}
          />

          {/* Relationship */}
          <label className="text-[13px] font-semibold mb-2.5 block" style={{ color: "var(--text2)" }}>
            Relationship
          </label>
          <div className="flex flex-wrap gap-2.5 mb-6">
            {RELATIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRelation(r)}
                className="h-10 px-4 rounded-full text-sm font-semibold transition-all duration-150"
                style={{
                  background: relation === r ? "#7C5CFF" : "var(--surface)",
                  color: relation === r ? "#fff" : "var(--text2)",
                  border: `1.5px solid ${relation === r ? "#7C5CFF" : "var(--border)"}`,
                }}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Color */}
          <label className="text-[13px] font-semibold mb-2.5 block" style={{ color: "var(--text2)" }}>
            Avatar color
          </label>
          <div className="flex gap-2.5 mb-6">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="w-8 h-8 rounded-full transition-all"
                style={{
                  background: c,
                  border: color === c ? "2.5px solid #7C5CFF" : "2px solid transparent",
                  outline: color === c ? "2px solid #7C5CFF40" : "none",
                }}
              />
            ))}
          </div>

          {/* Notes */}
          <label className="text-[13px] font-semibold mb-2 block" style={{ color: "var(--text2)" }}>
            Notes{" "}
            <span className="font-normal" style={{ color: "var(--text3)" }}>
              (what they love, what to remember)
            </span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Loves peonies and quiet mornings…"
            rows={4}
            className="w-full rounded-[14px] px-4 py-3 text-[15px] outline-none resize-none leading-relaxed"
            style={{
              border: "1.5px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text)",
            }}
          />

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full h-[54px] rounded-btn text-white font-bold text-base mt-7 disabled:opacity-60 transition-opacity"
            style={{
              background: "#7C5CFF",
              boxShadow: "0 14px 30px -10px rgba(124,92,255,.7)",
            }}
          >
            {loading ? "Saving…" : "Save person"}
          </button>
        </form>
      </div>
    </div>
  )
}
