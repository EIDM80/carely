import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { Event } from "@prisma/client"
import { getInitials, daysUntilLabel, formatDate } from "@/lib/utils"
import { People, Plus, ChevronRight } from "@/components/icons"

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

export default async function PeoplePage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const people = await prisma.person.findMany({
    where: { userId: session.user.id },
    include: {
      events: { orderBy: { date: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div
      className="min-h-screen animate-fadeIn"
      style={{ background: "var(--canvas)", paddingBottom: 100 }}
    >
      <div className="px-5 pt-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-1.5">
          <h1 className="text-[27px] font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
            People
          </h1>
          <Link
            href="/people/new"
            className="w-[46px] h-[46px] rounded-[14px] flex items-center justify-center text-white"
            style={{
              background: "#7C5CFF",
              boxShadow: "0 12px 24px -8px rgba(124,92,255,.6)",
            }}
          >
            <Plus size={24} />
          </Link>
        </div>
        <p className="text-[15px] mb-5" style={{ color: "var(--text3)" }}>
          {people.length} {people.length === 1 ? "person" : "people"} you care about
        </p>

        {/* Empty state */}
        {people.length === 0 && (
          <div
            className="rounded-3xl p-10 text-center mt-8"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border2)",
              boxShadow: "0 8px 24px rgba(31,41,55,.06)",
            }}
          >
            <div
              className="w-20 h-20 rounded-[26px] flex items-center justify-center mx-auto mb-5"
              style={{ background: "var(--lav)", color: "#7C5CFF" }}
            >
              <People size={40} />
            </div>
            <h3 className="text-xl font-extrabold mb-2" style={{ color: "var(--text)" }}>
              Start with someone who matters.
            </h3>
            <p className="text-[15px] leading-relaxed mb-6" style={{ color: "var(--text2)" }}>
              Add the people closest to you and Carely will help you never miss their moments.
            </p>
            <Link
              href="/people/new"
              className="h-[50px] px-7 rounded-[14px] inline-flex items-center font-bold text-[15px] text-white"
              style={{ background: "#7C5CFF" }}
            >
              Add your first person
            </Link>
          </div>
        )}

        {/* People list */}
        <div className="flex flex-col gap-3">
          {people.map((person) => {
            const nextEvent = (person.events
              .map((e: Event) => ({ ...e, nextDate: getNextOccurrence(e.date, e.repeat) })) as EventWithNext[])
              .filter((e: EventWithNext) => e.nextDate >= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))
              .sort((a: EventWithNext, b: EventWithNext) => a.nextDate.getTime() - b.nextDate.getTime())[0]

            return (
              <Link
                key={person.id}
                href={`/people/${person.id}`}
                className="flex items-center gap-3.5 rounded-[18px] p-3.5 cursor-pointer"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border2)",
                  boxShadow: "0 6px 16px rgba(31,41,55,.05)",
                }}
              >
                <span
                  className="w-[52px] h-[52px] rounded-full flex items-center justify-center font-extrabold text-xl flex-shrink-0"
                  style={{ background: person.color, color: "#1F2937" }}
                >
                  {getInitials(person.name)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-bold" style={{ color: "var(--text)" }}>
                    {person.name}
                  </div>
                  <div className="text-[13px] mt-0.5" style={{ color: "var(--text3)" }}>
                    {person.relation}
                    {nextEvent
                      ? ` · ${nextEvent.type} ${daysUntilLabel(nextEvent.nextDate).toLowerCase()}`
                      : " · No upcoming events"}
                  </div>
                </div>
                <ChevronRight size={26} style={{ color: "#D1D5DB" }} />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
