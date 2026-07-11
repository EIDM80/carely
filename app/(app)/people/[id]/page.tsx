import { notFound } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { Event, Message } from "@prisma/client"
import { getInitials, daysUntilLabel, formatDate } from "@/lib/utils"
import { ArrowLeft, Plus, Gift, Sparkles, ChevronRight, Edit } from "@/components/icons"

type EventWithNext = Event & { nextDate: Date }

function getNextOccurrence(date: Date, repeat: boolean): Date {
  const now = new Date()
  const d = new Date(date)
  const target = new Date(now.getFullYear(), d.getMonth(), d.getDate())
  if (target < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
    if (repeat) target.setFullYear(now.getFullYear() + 1)
  }
  return target
}

function eventTypeColor(type: string) {
  switch (type.toLowerCase()) {
    case "birthday": return { tint: "#EDE8FF", dot: "#7C5CFF" }
    case "anniversary": return { tint: "#FFE7E1", dot: "#EC6E8E" }
    case "graduation": return { tint: "#DCEEFF", dot: "#3B82F6" }
    default: return { tint: "#F3F4F6", dot: "#6B7280" }
  }
}

export default async function PersonProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) return null

  const person = await prisma.person.findFirst({
    where: { id, userId: session.user.id },
    include: {
      events: { orderBy: { date: "asc" } },
      messages: { orderBy: { createdAt: "desc" }, take: 3 },
    },
  })

  if (!person) notFound()

  const now = new Date()
  const events = (person.events
    .map((e: Event) => ({ ...e, nextDate: getNextOccurrence(e.date, e.repeat) })) as EventWithNext[])
    .sort((a: EventWithNext, b: EventWithNext) => a.nextDate.getTime() - b.nextDate.getTime())

  return (
    <div className="min-h-screen animate-fadeIn pb-28">
      {/* Hero */}
      <div
        className="pt-16 pb-7 px-5 relative"
        style={{ background: "linear-gradient(150deg,#EDE8FF,#FFE0D4)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <Link
            href="/people"
            className="w-[42px] h-[42px] rounded-xl flex items-center justify-center"
            style={{
              border: "1px solid rgba(255,255,255,.7)",
              background: "rgba(255,255,255,.6)",
            }}
          >
            <ArrowLeft size={20} style={{ color: "var(--text)" }} />
          </Link>
          <Link
            href={`/people/${person.id}/edit`}
            className="w-[42px] h-[42px] rounded-xl flex items-center justify-center"
            style={{
              border: "1px solid rgba(255,255,255,.7)",
              background: "rgba(255,255,255,.6)",
            }}
          >
            <Edit size={20} style={{ color: "var(--text)" }} />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <span
            className="w-[74px] h-[74px] rounded-full flex items-center justify-center font-extrabold text-3xl flex-shrink-0"
            style={{
              background: person.color,
              color: "#1F2937",
              boxShadow: "0 10px 26px -8px rgba(31,41,55,.25)",
            }}
          >
            {getInitials(person.name)}
          </span>
          <div>
            <h1 className="text-[26px] font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
              {person.name}
            </h1>
            <span
              className="inline-block mt-1.5 text-[13px] font-bold px-3 py-1.5 rounded-full"
              style={{ background: "var(--surface)", color: "#7C5CFF" }}
            >
              {person.relation}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 pt-6">
        {/* Notes */}
        {person.notes && (
          <div
            className="rounded-[18px] px-[18px] py-4 mb-6"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border2)",
              boxShadow: "0 6px 16px rgba(31,41,55,.05)",
            }}
          >
            <div className="text-xs font-bold tracking-widest mb-1.5" style={{ color: "var(--text3)" }}>
              NOTES
            </div>
            <p className="text-[15px] leading-[1.55]" style={{ color: "var(--text)" }}>
              {person.notes}
            </p>
          </div>
        )}

        {/* Moments */}
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
            Moments
          </h2>
          <Link
            href={`/events/new?personId=${person.id}`}
            className="flex items-center gap-1 text-sm font-semibold"
            style={{ color: "#7C5CFF" }}
          >
            <Plus size={17} /> Add
          </Link>
        </div>

        {events.length === 0 ? (
          <div
            className="rounded-2xl p-6 text-center mb-6"
            style={{ background: "var(--surface)", border: "1px solid var(--border2)" }}
          >
            <p className="text-sm" style={{ color: "var(--text3)" }}>
              No moments yet.{" "}
              <Link href={`/events/new?personId=${person.id}`} className="font-semibold" style={{ color: "#7C5CFF" }}>
                Add their first one
              </Link>
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-6">
            {events.map((e: EventWithNext) => {
              const colors = eventTypeColor(e.type)
              return (
                <Link
                  key={e.id}
                  href={`/events/${e.id}/edit?back=/people/${person.id}`}
                  className="flex items-center gap-3.5 rounded-[18px] p-3.5"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border2)",
                    boxShadow: "0 6px 16px rgba(31,41,55,.05)",
                  }}
                >
                  <span
                    className="w-[46px] h-[46px] rounded-[14px] flex items-center justify-center flex-shrink-0"
                    style={{ background: colors.tint, color: colors.dot }}
                  >
                    <Gift size={24} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-bold" style={{ color: "var(--text)" }}>
                      {e.type}
                    </div>
                    <div className="text-[13px] mt-0.5" style={{ color: "var(--text3)" }}>
                      {formatDate(e.nextDate)}
                    </div>
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1.5 rounded-full"
                    style={{ color: colors.dot, background: colors.tint }}
                  >
                    {daysUntilLabel(e.nextDate)}
                  </span>
                  <ChevronRight size={18} style={{ color: "#D1D5DB" }} />
                </Link>
              )
            })}
          </div>
        )}

        {/* Saved messages */}
        {person.messages.length > 0 && (
          <>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)" }}>
              Saved messages
            </h2>
            <div className="flex flex-col gap-3 mb-6">
              {person.messages.map((m: Message) => (
                <div
                  key={m.id}
                  className="rounded-[18px] p-4"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border2)",
                    boxShadow: "0 6px 16px rgba(31,41,55,.05)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[11px] font-bold px-2 py-1 rounded-full"
                      style={{ background: "var(--lav)", color: "#7C5CFF" }}
                    >
                      {m.tone}
                    </span>
                    <span className="text-xs" style={{ color: "var(--text3)" }}>
                      AI Generated
                    </span>
                  </div>
                  <p className="text-sm leading-[1.55]" style={{ color: "var(--text)" }}>
                    {m.content}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href={`/ai?personId=${person.id}`}
            className="h-[52px] rounded-[14px] flex items-center justify-center gap-2 font-bold text-[15px] text-white"
            style={{
              background: "#7C5CFF",
              boxShadow: "0 14px 30px -10px rgba(124,92,255,.7)",
            }}
          >
            <Sparkles size={18} /> Prepare a message for {person.name}
          </Link>
          <Link
            href={`/events/new?personId=${person.id}`}
            className="h-[52px] rounded-[14px] flex items-center justify-center font-bold text-[15px]"
            style={{ background: "var(--lav)", color: "#7C5CFF" }}
          >
            Add a moment for {person.name}
          </Link>
        </div>
      </div>
    </div>
  )
}
