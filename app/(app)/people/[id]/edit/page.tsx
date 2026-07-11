"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/app-store"
import { ArrowLeft, Trash } from "@/components/icons"
import { getInitials } from "@/lib/utils"

const RELATIONS = ["Wife", "Husband", "Partner", "Child", "Parent", "Sibling", "Friend", "Colleague"]
const COLORS = ["#FFE0D4", "#DCEEFF", "#EDE8FF", "#FFE7E1", "#E3F0FF", "#D1FAE5", "#FEF3C7", "#FCE7F3"]

interface Props {
  params: Promise<{ id: string }>
}

export default function EditPersonPage({ params }: Props) {
  const router = useRouter()
  const { showToast } = useAppStore()

  const [personId, setPersonId] = useState("")
  const [name, setName] = useState("")
  const [relation, setRelation] = useState("Friend")
  const [notes, setNotes] = useState("")
  const [color, setColor] = useState(COLORS[0])
  const [whatsappPhone, setWhatsappPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  useEffect(() => {
    params.then(({ id }) => {
      setPersonId(id)
      fetch(`/api/people/${id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.error) { router.push("/people"); return }
          setName(data.name || "")
          setRelation(data.relation || "Friend")
          setNotes(data.notes || "")
          setColor(data.color || COLORS[0])
          setWhatsappPhone(data.whatsappPhone || "")
        })
        .catch(() => router.push("/people"))
        .finally(() => setFetching(false))
    })
  }, [params, router])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/people/${personId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), relation, notes, color, whatsappPhone: whatsappPhone.trim() || null }),
      })
      if (res.ok) {
        showToast("Changes saved!", "success")
        router.push(`/people/${personId}`)
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

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/people/${personId}`, { method: "DELETE" })
      if (res.ok) {
        showToast(`${name} removed from your circle.`, "success")
        router.push("/people")
        router.refresh()
      } else {
        showToast("Could not delete person.", "error")
      }
    } catch {
      showToast("Something went wrong.", "error")
    } finally {
      setDeleting(false)
    }
  }

  if (fetching) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--canvas)" }}
      >
        <div className="w-8 h-8 rounded-full border-2 border-[#7C5CFF] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen animate-slideUp pb-10" style={{ background: "var(--canvas)" }}>
      <div className="px-5 pt-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3.5">
            <Link
              href={`/people/${personId}`}
              className="w-[42px] h-[42px] rounded-xl flex items-center justify-center"
              style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
            >
              <ArrowLeft size={20} style={{ color: "var(--text)" }} />
            </Link>
            <h1 className="text-[22px] font-extrabold" style={{ color: "var(--text)" }}>
              Edit person
            </h1>
          </div>
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="w-[42px] h-[42px] rounded-xl flex items-center justify-center"
            style={{ border: "1px solid #FEE2E2", background: "#FEF2F2" }}
          >
            <Trash size={20} style={{ color: "#EF4444" }} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          {/* Avatar preview */}
          <div className="flex justify-center mb-6">
            <span
              className="w-24 h-24 rounded-full flex items-center justify-center font-extrabold text-4xl"
              style={{ background: color, color: "#1F2937" }}
            >
              {getInitials(name || "?")}
            </span>
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

          {/* WhatsApp number */}
          <label className="text-[13px] font-semibold mb-2 block" style={{ color: "var(--text2)" }}>
            WhatsApp number{" "}
            <span className="font-normal" style={{ color: "var(--text3)" }}>(optional — for auto-send)</span>
          </label>
          <div className="relative mb-6">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-bold select-none"
              style={{ color: "#25D366" }}
            >
              +
            </span>
            <input
              value={whatsappPhone}
              onChange={(e) => setWhatsappPhone(e.target.value.replace(/[^\d+\s\-()]/g, ""))}
              placeholder="1 555 000 0000"
              type="tel"
              className="w-full h-[54px] rounded-btn pl-8 pr-4 text-base outline-none"
              style={{
                border: "1.5px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text)",
              }}
            />
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
            {loading ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>

      {/* Delete confirmation bottom sheet */}
      {showConfirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ background: "rgba(0,0,0,.45)" }}
          onClick={() => setShowConfirmDelete(false)}
        >
          <div
            className="w-full rounded-t-[28px] px-5 pt-6 pb-10 animate-slideUp"
            style={{ background: "var(--surface)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-extrabold mb-2 text-center" style={{ color: "var(--text)" }}>
              Remove {name}?
            </h3>
            <p className="text-sm text-center mb-7" style={{ color: "var(--text3)" }}>
              This will delete all their moments and saved messages too. This can't be undone.
            </p>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full h-[54px] rounded-btn font-bold text-base text-white mb-3 disabled:opacity-60"
              style={{ background: "#EF4444" }}
            >
              {deleting ? "Deleting…" : "Yes, remove"}
            </button>
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="w-full h-[54px] rounded-btn font-bold text-base"
              style={{ background: "var(--canvas)", color: "var(--text2)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
