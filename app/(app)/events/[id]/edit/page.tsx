"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAppStore } from "@/store/app-store"
import { ArrowLeft, Repeat, Trash } from "@/components/icons"

const OCCASION_TYPES = ["Birthday", "Anniversary", "Graduation", "Engagement", "Custom"]
const REMINDERS = [
  { label: "1 day before", value: "1_day" },
  { label: "3 days before", value: "3_days" },
  { label: "1 week before", value: "1_week" },
  { label: "2 weeks before", value: "2_weeks" },
]

interface Props {
  params: Promise<{ id: string }>
}

function EditEventForm({ params }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useAppStore()

  const backTo = searchParams.get("back") || "/calendar"

  const [eventId, setEventId] = useState("")
  const [personId, setPersonId] = useState("")
  const [personName, setPersonName] = useState("")
  const [type, setType] = useState("Birthday")
  const [date, setDate] = useState("")
  const [repeat, setRepeat] = useState(true)
  const [reminder, setReminder] = useState("3_days")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  useEffect(() => {
    params.then(({ id }) => {
      setEventId(id)
      fetch(`/api/events/${id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.error) { router.push("/calendar"); return }
          setPersonId(data.personId || "")
          setPersonName(data.person?.name || "")
          setType(data.type || "Birthday")
          setDate(data.date ? data.date.slice(0, 10) : "")
          setRepeat(data.repeat ?? true)
          setReminder(data.reminder || "3_days")
          setNotes(data.notes || "")
        })
        .catch(() => router.push("/calendar"))
        .finally(() => setFetching(false))
    })
  }, [params, router])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!date) {
      showToast("Please select a date.", "error")
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, date, repeat, reminder, notes }),
      })
      if (res.ok) {
        showToast("Moment updated!", "success")
        router.push(backTo)
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
      const res = await fetch(`/api/events/${eventId}`, { method: "DELETE" })
      if (res.ok) {
        showToast("Moment removed.", "success")
        router.push(backTo)
        router.refresh()
      } else {
        showToast("Could not delete moment.", "error")
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
              href={backTo}
              className="w-[42px] h-[42px] rounded-xl flex items-center justify-center"
              style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
            >
              <ArrowLeft size={20} style={{ color: "var(--text)" }} />
            </Link>
            <div>
              <h1 className="text-[22px] font-extrabold leading-tight" style={{ color: "var(--text)" }}>
                Edit moment
              </h1>
              {personName && (
                <p className="text-sm" style={{ color: "var(--text3)" }}>
                  for {personName}
                </p>
              )}
            </div>
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
            disabled={loading || !date}
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
              Delete this moment?
            </h3>
            <p className="text-sm text-center mb-7" style={{ color: "var(--text3)" }}>
              This can't be undone.
            </p>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full h-[54px] rounded-btn font-bold text-base text-white mb-3 disabled:opacity-60"
              style={{ background: "#EF4444" }}
            >
              {deleting ? "Deleting…" : "Yes, delete"}
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

export default function EditEventPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "var(--canvas)" }} />}>
      <EditEventForm params={params} />
    </Suspense>
  )
}
