"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAppStore } from "@/store/app-store"
import { Sparkles, Repeat, Clock, Check, Send } from "@/components/icons"
import { getInitials } from "@/lib/utils"

const OCCASIONS = ["Birthday", "Anniversary", "Graduation", "Engagement", "Just Because"]
const TONES = [
  { label: "Romantic", bg: "#FFE7E1", color: "#EC6E8E" },
  { label: "Friendly", bg: "#DCEEFF", color: "#3B82F6" },
  { label: "Emotional", bg: "#EDE8FF", color: "#7C5CFF" },
  { label: "Formal", bg: "#F3F4F6", color: "#6B7280" },
  { label: "Funny", bg: "#FEF9C3", color: "#CA8A04" },
]

const SCHEDULE_OPTIONS = ["Day of", "3 days before", "1 week before", "Morning of"]

interface Person {
  id: string
  name: string
  color: string
  whatsappPhone?: string | null
}

function AIForm() {
  const searchParams = useSearchParams()
  const { showToast } = useAppStore()

  const preselectedPersonId = searchParams.get("personId") || ""
  const preselectedType = searchParams.get("type") || "Birthday"

  const [people, setPeople] = useState<Person[]>([])
  const [selectedPersonId, setSelectedPersonId] = useState(preselectedPersonId)
  const [type, setType] = useState(preselectedType)
  const [tone, setTone] = useState("Friendly")
  const [notes, setNotes] = useState("")
  const [generating, setGenerating] = useState(false)
  const [draft, setDraft] = useState("")
  const [personName, setPersonName] = useState("")
  const [showSchedule, setShowSchedule] = useState(false)
  const [schedTiming, setSchedTiming] = useState("Day of")
  const [channel, setChannel] = useState<"whatsapp" | "manual">("manual")
  const [whatsappPhone, setWhatsappPhone] = useState("")
  const [saved, setSaved] = useState(false)
  const [scheduled, setScheduled] = useState(false)
  const [scheduling, setScheduling] = useState(false)

  useEffect(() => {
    fetch("/api/people")
      .then((r) => r.json())
      .then((data: Person[]) => {
        setPeople(data)
        if (preselectedPersonId && data.length > 0) {
          const p = data.find((x) => x.id === preselectedPersonId)
          if (p) setPersonName(p.name)
        }
      })
      .catch(() => {})
  }, [])

  async function generate() {
    if (!selectedPersonId) {
      showToast("Select a person first.", "error")
      return
    }
    setGenerating(true)
    setDraft("")
    setSaved(false)
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personId: selectedPersonId, type, tone, notes }),
      })
      const data = await res.json()
      if (res.ok) {
        setDraft(data.message)
        setPersonName(data.person?.name || personName)
      } else {
        showToast(data.error || "Generation failed.", "error")
      }
    } catch {
      showToast("Generation failed.", "error")
    } finally {
      setGenerating(false)
    }
  }

  async function saveDraft() {
    if (!draft || !selectedPersonId) return
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personId: selectedPersonId, tone, content: draft }),
      })
      setSaved(true)
      showToast("Message saved!", "success")
    } catch {
      showToast("Could not save.", "error")
    }
  }

  async function handleSchedule() {
    if (!draft || !selectedPersonId) return
    if (channel === "whatsapp" && !whatsappPhone.trim()) {
      showToast("Enter their WhatsApp number to auto-send.", "error")
      return
    }
    setScheduling(true)
    try {
      const scheduledAt = resolveScheduledAt(schedTiming)
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personId: selectedPersonId,
          tone,
          content: draft,
          channel,
          scheduledAt: scheduledAt.toISOString(),
          whatsappPhone: channel === "whatsapp" ? whatsappPhone.trim() : null,
        }),
      })
      if (res.ok) {
        setShowSchedule(false)
        setScheduled(true)
        setSaved(true)
        showToast(
          channel === "whatsapp"
            ? `Will auto-send via WhatsApp ${schedTiming.toLowerCase()}!`
            : `Reminder set for ${schedTiming.toLowerCase()}!`,
          "success"
        )
      } else {
        showToast("Could not schedule message.", "error")
      }
    } catch {
      showToast("Something went wrong.", "error")
    } finally {
      setScheduling(false)
    }
  }

  function resolveScheduledAt(timing: string): Date {
    const now = new Date()
    switch (timing) {
      case "3 days before": return new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
      case "1 week before": return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      case "Morning of": {
        const d = new Date(now); d.setHours(9, 0, 0, 0); return d
      }
      default: return now // Day of
    }
  }

  const selectedPerson = people.find((p) => p.id === selectedPersonId)

  return (
    <div className="min-h-screen animate-fadeIn pb-28" style={{ background: "var(--canvas)" }}>
      <div className="px-5 pt-16">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <span
            className="w-[46px] h-[46px] rounded-[14px] flex items-center justify-center text-white"
            style={{
              background: "linear-gradient(135deg,#7C5CFF,#9B87FF)",
              boxShadow: "0 12px 24px -8px rgba(124,92,255,.6)",
            }}
          >
            <Sparkles size={24} />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
              AI Assistant
            </h1>
            <div className="text-[13px]" style={{ color: "var(--text3)" }}>Say it beautifully, every time</div>
          </div>
        </div>
        <p className="text-[15px] leading-relaxed mb-6 mt-3" style={{ color: "var(--text2)" }}>
          Tell Carely who it's for and the moment — it'll craft something personal you can edit, save, or schedule.
        </p>

        {/* For */}
        <label className="text-[13px] font-semibold mb-2.5 block" style={{ color: "var(--text2)" }}>For</label>
        <div className="flex gap-3.5 overflow-x-auto pb-2 mb-5" style={{ scrollbarWidth: "none" }}>
          {people.map((p) => {
            const selected = selectedPersonId === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => { setSelectedPersonId(p.id); setPersonName(p.name); setWhatsappPhone(p.whatsappPhone || "") }}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 transition-opacity"
                style={{ opacity: selectedPersonId && !selected ? 0.45 : 1 }}
              >
                <span
                  className="w-[54px] h-[54px] rounded-full flex items-center justify-center font-extrabold text-xl"
                  style={{
                    background: p.color,
                    color: "#1F2937",
                    boxShadow: selected ? "0 0 0 3px #7C5CFF" : "none",
                  }}
                >
                  {getInitials(p.name)}
                </span>
                <span className="text-xs font-semibold" style={{ color: "var(--text2)" }}>{p.name}</span>
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

        {/* Occasion */}
        <label className="text-[13px] font-semibold mb-2.5 block" style={{ color: "var(--text2)" }}>Occasion</label>
        <div className="flex flex-wrap gap-2.5 mb-5">
          {OCCASIONS.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setType(o)}
              className="h-10 px-4 rounded-full text-[13px] font-semibold transition-all"
              style={{
                background: type === o ? "#7C5CFF" : "var(--surface)",
                color: type === o ? "#fff" : "var(--text2)",
                border: `1.5px solid ${type === o ? "#7C5CFF" : "var(--border)"}`,
              }}
            >
              {o}
            </button>
          ))}
        </div>

        {/* Tone */}
        <label className="text-[13px] font-semibold mb-2.5 block" style={{ color: "var(--text2)" }}>Tone</label>
        <div className="flex flex-wrap gap-2.5 mb-5">
          {TONES.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setTone(t.label)}
              className="h-10 px-4 rounded-full text-[13px] font-bold transition-all"
              style={{
                background: tone === t.label ? t.color : t.bg,
                color: tone === t.label ? "#fff" : t.color,
                border: "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Personal notes */}
        <label className="text-[13px] font-semibold mb-2 block" style={{ color: "var(--text2)" }}>
          Add a personal touch{" "}
          <span className="font-normal" style={{ color: "var(--text3)" }}>(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. mention our trip to the coast…"
          rows={3}
          className="w-full rounded-[14px] px-4 py-3 text-[15px] outline-none resize-none leading-relaxed mb-5"
          style={{ border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}
        />

        {/* Generate button */}
        <button
          onClick={generate}
          disabled={generating || !selectedPersonId}
          className="w-full h-[54px] rounded-btn text-white font-bold text-base flex items-center justify-center gap-2.5 disabled:opacity-60 transition-opacity mb-0"
          style={{
            background: generating ? "#A89AFF" : "#7C5CFF",
            boxShadow: "0 14px 30px -10px rgba(124,92,255,.7)",
          }}
        >
          <Sparkles size={20} />
          {generating ? "Crafting…" : "Generate message"}
        </button>

        {/* Generating skeleton */}
        {generating && (
          <div
            className="rounded-2xl p-5 mt-5"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border2)",
              boxShadow: "0 8px 24px rgba(31,41,55,.06)",
            }}
          >
            <div className="flex items-center gap-2.5 mb-4" style={{ color: "#7C5CFF" }}>
              <Sparkles size={18} />
              <span className="text-sm font-bold">Carely is thinking…</span>
            </div>
            {[1, 0.92, 0.7].map((w, i) => (
              <div
                key={i}
                className="h-2.5 rounded-md mb-2.5 animate-pulse-soft"
                style={{ width: `${w * 100}%`, background: "var(--border2)" }}
              />
            ))}
          </div>
        )}

        {/* Draft card */}
        {draft && !generating && (
          <div
            className="rounded-2xl p-5 mt-5 animate-slideUp"
            style={{
              background: "linear-gradient(135deg,#F8F5FF,#FFF4F8)",
              border: "1px solid var(--soft-border)",
              boxShadow: "0 12px 30px -12px rgba(124,92,255,.3)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                  style={{ background: "var(--lav)", color: "#7C5CFF" }}
                >
                  <Sparkles size={18} />
                </span>
                <span className="text-[13px] font-bold" style={{ color: "#7C5CFF" }}>
                  For {personName} · {tone}
                </span>
              </div>
            </div>

            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full min-h-[130px] text-base leading-relaxed bg-transparent border-none outline-none resize-y"
              style={{ color: "var(--text)" }}
            />

            <div className="flex gap-2.5 mt-3.5">
              <button
                onClick={generate}
                className="flex-1 h-11 rounded-xl flex items-center justify-center gap-1.5 font-semibold text-sm transition-all"
                style={{
                  background: "var(--surface)",
                  border: "1.5px solid var(--border)",
                  color: "var(--text2)",
                }}
              >
                <Repeat size={16} /> Regenerate
              </button>
              <button
                onClick={saveDraft}
                disabled={saved}
                className="h-11 px-4 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all"
                style={{
                  background: saved ? "#E7F6EC" : "var(--lav)",
                  color: saved ? "#22C55E" : "#7C5CFF",
                }}
              >
                {saved ? <><Check size={16} /> Saved</> : "Save"}
              </button>
            </div>

            <button
              onClick={() => setShowSchedule(true)}
              className="w-full h-[50px] rounded-[13px] flex items-center justify-center gap-2 font-bold text-[15px] text-white mt-2.5"
              style={{
                background: "#7C5CFF",
                boxShadow: "0 12px 26px -10px rgba(124,92,255,.7)",
              }}
            >
              <Clock size={18} /> Schedule this message
            </button>

            {scheduled && (
              <div
                className="mt-3 flex items-center gap-2 px-4 py-3 rounded-xl"
                style={{ background: channel === "whatsapp" ? "#ECFDF5" : "#EDE8FF" }}
              >
                <Check size={16} style={{ color: channel === "whatsapp" ? "#25D366" : "#7C5CFF" }} />
                <span className="text-sm font-semibold" style={{ color: channel === "whatsapp" ? "#065F46" : "#4C2EAC" }}>
                  {channel === "whatsapp"
                    ? `WhatsApp auto-send · ${schedTiming}`
                    : `Reminder set · ${schedTiming}`}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Schedule modal */}
      {showSchedule && (
        <div
          className="fixed inset-0 z-50 flex items-end animate-fadeIn"
          style={{ background: "rgba(31,30,60,.4)", backdropFilter: "blur(3px)" }}
          onClick={() => setShowSchedule(false)}
        >
          <div
            className="w-full max-w-md mx-auto rounded-t-3xl p-6 pb-10 animate-slideUp"
            style={{ background: "var(--surface)", boxShadow: "0 -20px 50px -20px rgba(0,0,0,.3)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 rounded-full mx-auto mb-5" style={{ background: "var(--border)" }} />
            <div className="flex items-center gap-3 mb-5">
              <span
                className="w-11 h-11 rounded-[14px] flex items-center justify-center"
                style={{ background: "var(--lav)", color: "#7C5CFF" }}
              >
                <Clock size={24} />
              </span>
              <div>
                <h2 className="text-xl font-extrabold" style={{ color: "var(--text)" }}>Schedule message</h2>
                <div className="text-[13px]" style={{ color: "var(--text3)" }}>
                  For {personName} · {type}
                </div>
              </div>
            </div>

            {/* Timing */}
            <div className="text-[13px] font-semibold mb-2.5" style={{ color: "var(--text2)" }}>When to send</div>
            <div className="flex flex-wrap gap-2.5 mb-5">
              {SCHEDULE_OPTIONS.map((o) => (
                <button
                  key={o}
                  onClick={() => setSchedTiming(o)}
                  className="h-[42px] px-4 rounded-full text-sm font-bold transition-all"
                  style={{
                    background: schedTiming === o ? "#7C5CFF" : "var(--lav)",
                    color: schedTiming === o ? "#fff" : "#7C5CFF",
                  }}
                >
                  {o}
                </button>
              ))}
            </div>

            {/* Channel */}
            <div className="text-[13px] font-semibold mb-2.5" style={{ color: "var(--text2)" }}>How to send</div>
            <div className="flex gap-2.5 mb-5">
              <button
                onClick={() => setChannel("whatsapp")}
                className="flex-1 h-[52px] rounded-[14px] flex items-center justify-center gap-2 font-bold text-sm transition-all"
                style={{
                  background: channel === "whatsapp" ? "#25D366" : "var(--canvas)",
                  color: channel === "whatsapp" ? "#fff" : "var(--text2)",
                  border: `2px solid ${channel === "whatsapp" ? "#25D366" : "var(--border)"}`,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Auto-send via WhatsApp
              </button>
              <button
                onClick={() => setChannel("manual")}
                className="flex-1 h-[52px] rounded-[14px] flex items-center justify-center gap-2 font-bold text-sm transition-all"
                style={{
                  background: channel === "manual" ? "#7C5CFF" : "var(--canvas)",
                  color: channel === "manual" ? "#fff" : "var(--text2)",
                  border: `2px solid ${channel === "manual" ? "#7C5CFF" : "var(--border)"}`,
                }}
              >
                <Clock size={18} />
                Remind me
              </button>
            </div>

            {/* WhatsApp phone input */}
            {channel === "whatsapp" && (
              <div className="mb-5 animate-slideUp">
                <div className="text-[13px] font-semibold mb-2" style={{ color: "var(--text2)" }}>
                  {personName}'s WhatsApp number
                </div>
                <div className="relative">
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
                    className="w-full h-[50px] rounded-[13px] pl-8 pr-4 text-base outline-none"
                    style={{
                      border: `1.5px solid ${whatsappPhone ? "#25D366" : "var(--border)"}`,
                      background: "var(--canvas)",
                      color: "var(--text)",
                    }}
                  />
                </div>
                <p className="text-[12px] mt-1.5" style={{ color: "var(--text3)" }}>
                  Carely will auto-send this message via WhatsApp at the scheduled time.
                </p>
              </div>
            )}

            <button
              onClick={handleSchedule}
              disabled={scheduling || (channel === "whatsapp" && !whatsappPhone.trim())}
              className="w-full h-[54px] rounded-btn text-white font-bold text-base flex items-center justify-center gap-2 disabled:opacity-60"
              style={{
                background: channel === "whatsapp" ? "#25D366" : "#7C5CFF",
                boxShadow: channel === "whatsapp"
                  ? "0 14px 30px -10px rgba(37,211,102,.5)"
                  : "0 14px 30px -10px rgba(124,92,255,.7)",
              }}
            >
              {scheduling ? (
                "Scheduling…"
              ) : channel === "whatsapp" ? (
                <><Send size={18} /> Schedule auto-send</>
              ) : (
                <><Clock size={18} /> Set reminder</>
              )}
            </button>
            <button
              onClick={() => setShowSchedule(false)}
              className="w-full h-12 font-semibold text-[15px] mt-1"
              style={{ color: "var(--text3)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AIPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "var(--canvas)" }} />}>
      <AIForm />
    </Suspense>
  )
}
