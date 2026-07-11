"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, ChevronLeft, ChevronRight, Gift, Edit, X } from "@/components/icons"

interface EventData {
  id: string
  type: string
  personId: string
  personName: string
  nextDate: string
  daysLabel: string
  dateLabel: string
  colors: { tint: string; dot: string }
  reminder: string
  repeat: boolean
  notes: string | null
}

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function buildCalendar(year: number, month: number, events: EventData[]) {
  const first = new Date(year, month, 1)
  const startDow = (first.getDay() + 6) % 7 // Mon-start
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()
  const todayD = today.getFullYear() === year && today.getMonth() === month ? today.getDate() : -1

  const byDay: Record<number, EventData[]> = {}
  events.forEach((e) => {
    const d = new Date(e.nextDate)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      (byDay[day] = byDay[day] || []).push(e)
    }
  })

  const cells: Array<{ blank?: true; day?: number; isToday?: boolean; events?: EventData[] }> = []
  for (let i = 0; i < startDow; i++) cells.push({ blank: true })
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, isToday: d === todayD, events: byDay[d] || [] })
  }

  const weeks: typeof cells[] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }
  return weeks
}

export function CalendarClient({
  events,
  initialYear,
  initialMonth,
}: {
  events: EventData[]
  initialYear: number
  initialMonth: number
}) {
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)

  const weeks = buildCalendar(year, month, events)

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1) }
    else setMonth((m) => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1) }
    else setMonth((m) => m + 1)
  }

  return (
    <div className="min-h-screen animate-fadeIn pb-28" style={{ background: "var(--canvas)" }}>
      <div className="px-5 pt-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-[27px] font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
            Calendar
          </h1>
          <Link
            href="/events/new"
            className="w-[46px] h-[46px] rounded-[14px] flex items-center justify-center text-white"
            style={{ background: "#7C5CFF", boxShadow: "0 12px 24px -8px rgba(124,92,255,.6)" }}
          >
            <Plus size={24} />
          </Link>
        </div>

        {/* Calendar widget */}
        <div
          className="rounded-3xl p-[18px] mb-6"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border2)",
            boxShadow: "0 8px 24px rgba(31,41,55,.06)",
          }}
        >
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ border: "1px solid var(--border2)", background: "var(--canvas)", color: "var(--text2)" }}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-[17px] font-extrabold" style={{ color: "var(--text)" }}>
              {MONTHS[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ border: "1px solid var(--border2)", background: "var(--canvas)", color: "var(--text2)" }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-0.5 mb-1.5">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center text-[11px] font-bold py-1" style={{ color: "#B9BCC4" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="flex flex-col gap-0.5">
            {weeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-0.5">
                {week.map((cell, ci) => {
                  if (cell.blank) return <div key={ci} />
                  const hasEvents = (cell.events?.length || 0) > 0
                  return (
                    <button
                      key={ci}
                      onClick={() => hasEvents && setSelectedEvent(cell.events![0])}
                      className="aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 p-0 transition-all"
                      style={{
                        background: cell.isToday ? "#7C5CFF" : hasEvents ? "var(--lav)" : "transparent",
                        cursor: hasEvents ? "pointer" : "default",
                      }}
                    >
                      <span
                        className="text-sm"
                        style={{
                          fontWeight: cell.isToday || hasEvents ? 700 : 400,
                          color: cell.isToday ? "#fff" : hasEvents ? "#7C5CFF" : "var(--text2)",
                        }}
                      >
                        {cell.day}
                      </span>
                      <span className="flex gap-0.5 h-1.5">
                        {(cell.events || []).slice(0, 3).map((e, i) => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: cell.isToday ? "rgba(255,255,255,.7)" : e.colors.dot }}
                          />
                        ))}
                      </span>
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming list */}
        <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)" }}>Upcoming</h2>
        {events.length === 0 ? (
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border2)" }}
          >
            <p className="text-sm" style={{ color: "var(--text3)" }}>
              No events yet.{" "}
              <Link href="/events/new" className="font-semibold" style={{ color: "#7C5CFF" }}>
                Add the first one
              </Link>
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {events.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelectedEvent(e)}
                className="flex items-center gap-3.5 rounded-[18px] p-3.5 text-left w-full"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border2)",
                  boxShadow: "0 6px 16px rgba(31,41,55,.05)",
                }}
              >
                <span
                  className="w-[46px] h-[46px] rounded-[14px] flex items-center justify-center flex-shrink-0"
                  style={{ background: e.colors.tint, color: e.colors.dot }}
                >
                  <Gift size={24} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-bold" style={{ color: "var(--text)" }}>
                    {e.personName}'s {e.type}
                  </div>
                  <div className="text-[13px] mt-0.5" style={{ color: "var(--text3)" }}>
                    {e.dateLabel}
                  </div>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1.5 rounded-full whitespace-nowrap"
                  style={{ color: e.colors.dot, background: e.colors.tint }}
                >
                  {e.daysLabel}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Event detail bottom sheet */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-end animate-fadeIn"
          style={{ background: "rgba(31,30,60,.4)", backdropFilter: "blur(3px)" }}
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="w-full rounded-t-3xl p-6 pb-8 animate-slideUp"
            style={{
              background: "var(--surface)",
              boxShadow: "0 -20px 50px -20px rgba(0,0,0,.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-10 h-1.5 rounded-full mx-auto mb-5"
              style={{ background: "var(--border)" }}
            />
            <div className="flex items-center gap-3.5 mb-5">
              <span
                className="w-14 h-14 rounded-[17px] flex items-center justify-center flex-shrink-0"
                style={{ background: selectedEvent.colors.tint, color: selectedEvent.colors.dot }}
              >
                <Gift size={28} />
              </span>
              <div>
                <h2 className="text-[21px] font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
                  {selectedEvent.personName}'s {selectedEvent.type}
                </h2>
                <div className="text-sm mt-0.5" style={{ color: "var(--text3)" }}>
                  {selectedEvent.dateLabel} · {selectedEvent.daysLabel}
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 mb-5">
              {[
                { label: "Reminder", value: selectedEvent.reminder.replace("_", " ") },
                { label: "Repeats", value: selectedEvent.repeat ? "Yearly" : "Once" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex-1 rounded-[14px] p-3"
                  style={{ background: "var(--canvas)" }}
                >
                  <div className="text-xs font-semibold mb-0.5" style={{ color: "var(--text3)" }}>{label}</div>
                  <div className="text-sm font-bold" style={{ color: "var(--text)" }}>{value}</div>
                </div>
              ))}
            </div>

            {selectedEvent.notes && (
              <div
                className="rounded-[14px] p-3.5 mb-5"
                style={{ background: "#FBF9FF", border: "1px solid var(--soft-border)" }}
              >
                <div className="text-xs font-bold mb-1" style={{ color: "#7C5CFF" }}>NOTE</div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text2)" }}>
                  {selectedEvent.notes}
                </p>
              </div>
            )}

            <div className="flex gap-2.5 mb-2">
              <Link
                href={`/ai?personId=${selectedEvent.personId}&type=${selectedEvent.type}`}
                className="flex-1 h-[54px] rounded-[14px] flex items-center justify-center gap-2 font-bold text-base text-white"
                style={{
                  background: "#7C5CFF",
                  boxShadow: "0 14px 30px -10px rgba(124,92,255,.7)",
                }}
              >
                Prepare a message
              </Link>
              <Link
                href={`/events/${selectedEvent.id}/edit`}
                className="w-[54px] h-[54px] rounded-[14px] flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--canvas)", border: "1.5px solid var(--border)" }}
              >
                <Edit size={20} style={{ color: "var(--text2)" }} />
              </Link>
            </div>
            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full h-12 font-semibold text-[15px]"
              style={{ color: "var(--text3)" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
