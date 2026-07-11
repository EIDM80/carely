"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAppStore } from "@/store/app-store"
import { ArrowLeft, Repeat } from "@/components/icons"
import { getInitials } from "@/lib/utils"

const OCCASION_TYPES = ["Birthday", "Anniversary", "Graduation", "Engagement", "Custom"]
const REMINDERS = [
  { label: "1 day before", value: "1_day" },
  { label: "3 days before", value: "3_days" },
  { label: "1 week before", value: "1_week" },
  { label: "2 weeks before", value: "2_weeks" },
]

interface Person {
  id: string
  name: string
  color: string
}

function NewEventForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useAppStore()

  const preselectedPersonId = searchParams.get("personId") || ""
  const preselectedType = searchParams.get("type") || "Birthday"

  const [people, setPeople] = useState<Person[]>([])
  const [selectedPersonId, setSelectedPersonId] = useState(preselectedPersonId)
  const [type, setType] = useState(preselectedType)
  const [date, setDate] = useState("")
  const [repeat, setRepeat] = useState(true)
  const [reminder, setReminder] = useState("3_days")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/people")
      .then((r) => r.json())
      .then(setPeople)
      .catch(() => {})
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedPersonId || !date) {
      showToast("Please select a person and date.", "error")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personId: selectedPersonId, type, date, repeat, reminder, notes }),
      })
      if (res.ok) {
        showToast("Moment saved!", "success")
        router.push("/calendar")
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
    <div className="min-h-screen animate-slideUp pb-8" style={{ background: "var(--canvas)" }}>
      <div className="px-5 pt-16">
        <div className="flex items-center gap-3.5 mb-7">
          <Link
            href="/calendar"
            className="w-[42px] h-[42px] rounded-xl flex items-center justify-center"
            style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
          >
            <ArrowLeft size={20} style={{ color: "var(--text)" }} />
          </Link>
          <h1 className="text-[22px] font-extrabold" style={{ color: "var(--text)" }}>
            Add a moment
          </h1>
        </div>

        <form onSubmit={handleSave}>
          {/* Occasion type */}
          <label className="text-[13px] font-semibold mb-2.5 block" style={{ color: "var(--text2)" }}>
            Occasion
          </label>
          <div className="flex flex-wrap gap-2.5 mb-6">
            {OCCASION_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className="h-10 px-4 rounded-full text-sm font-semibold transition-all duration-150"
                style={{
                  background: type === t ? "#7C5CFF" : "var(--surface)",
                  color: type === t ? "#fff" : "var(--text2)",
                  border: `1.5px solid ${type === t ? "#7C5CFF" : "var(--border)"}`,
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Who is it for */}
          <label className="text-[13px] font-semibold mb-2.5 block" style={{ color: "var(--text2)" }}>
            Who is it for?
          </label>
          <div className="flex gap-3.5 overflow-x-auto pb-2 mb-3.5" style={{ scrollbarWidth: "none" }}>
            {people.map((p) => {
              const selected = selectedPersonId === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPersonId(p.id)}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0 transition-opacity"
                  style={{ opacity: selectedPersonId && !selected ? 0.45 : 1 }}
                >
                  <span
                    className="w-[54px] h-[54px] rounded-full flex items-center justify-center font-extrabold text-xl"
                    style={{
                      background: p.color,
                      color: "#1F2937",
                      boxShadow: selected ? `0 0 0 3px #7C5CFF` : "none",
                    }}
                  >
                    {getInitials(p.name)}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: "var(--text2)" }}>
                    {p.name}
                  </span>
                </button>
              )
            })}
            {people.length === 0 && (
              <p className="text-sm" style={{ color: "var(--text3)" }}>
                <Link href="/people/new" className="font-semibold" style={{ color: "#7C5CFF" }}>
                  Add a person first
                </Link>
              </p>
            )}
          </div>

          {/* Date */}
          <label className="text-[13px] font-semibold mb-2 block" style={{ color: "var(--text2)" }}>
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full h-[54px] rounded-btn px-4 text-base outline-none mb-5"
            style={{
              border: "1.5px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text)",
            }}
          />

          {/* Repeat toggle */}
          <button
            type="button"
            onClick={() => setRepeat((r) => !r)}
            className="w-full flex items-center justify-between rounded-btn px-4 py-3.5 mb-5 transition-all"
            style={{
              background: "var(--surface)",
              border: "1.5px solid var(--border)",
            }}
          >
            <span className="flex items-center gap-2.5">
              <Repeat size={20} style={{ color: "#7C5CFF" }} />
              <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>
                Repeat every year
              </span>
            </span>
            <span
              className="w-[46px] h-7 rounded-full relative transition-all"
              style={{ background: repeat ? "#7C5CFF" : "var(--border2)" }}
            >
              <span
                className="absolute top-[3px] w-[21px] h-[21px] rounded-full transition-all"
                style={{
                  left: repeat ? "calc(100% - 24px)" : 3,
                  background: "white",
                  boxShadow: "0 2px 5px rgba(0,0,0,.2)",
                }}
              />
            </span>
          </button>

          {/* Reminders */}
          <label className="text-[13px] font-semibold mb-2.5 block" style={{ color: "var(--text2)" }}>
            Remind me
          </label>
          <div className="flex flex-wrap gap-2.5 mb-6">
            {REMINDERS.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setReminder(r.value)}
                className="h-10 px-4 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: reminder === r.value ? "#7C5CFF" : "var(--surface)",
                  color: reminder === r.value ? "#fff" : "var(--text2)",
                  border: `1.5px solid ${reminder === r.value ? "#7C5CFF" : "var(--border)"}`,
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Notes */}
          <label className="text-[13px] font-semibold mb-2 block" style={{ color: "var(--text2)" }}>
            Notes{" "}
            <span className="font-normal" style={{ color: "var(--text3)" }}>(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything to remember for this moment…"
            rows={3}
            className="w-full rounded-[14px] px-4 py-3 text-[15px] outline-none resize-none leading-relaxed"
            style={{
              border: "1.5px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text)",
            }}
          />

          <button
            type="submit"
            disabled={loading || !selectedPersonId || !date}
            className="w-full h-[54px] rounded-btn text-white font-bold text-base mt-7 disabled:opacity-60 transition-opacity"
            style={{
              background: "#7C5CFF",
              boxShadow: "0 14px 30px -10px rgba(124,92,255,.7)",
            }}
          >
            {loading ? "Saving…" : "Save this moment"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function NewEventPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "var(--canvas)" }} />}>
      <NewEventForm />
    </Suspense>
  )
}
