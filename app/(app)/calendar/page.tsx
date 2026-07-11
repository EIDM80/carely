import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { Event, Person } from "@prisma/client"
import { formatDate, daysUntilLabel } from "@/lib/utils"
import { CalendarClient } from "./CalendarClient"

type EventWithPerson = Event & { person: Person | null }

function getNextOccurrence(date: Date, repeat: boolean): Date {
  const now = new Date()
  const d = new Date(date)
  const target = new Date(now.getFullYear(), d.getMonth(), d.getDate())
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (target < today) {
    if (repeat) target.setFullYear(now.getFullYear() + 1)
  }
  return target
}

function eventTypeColor(type: string) {
  switch (type.toLowerCase()) {
    case "birthday": return { tint: "#EDE8FF", dot: "#7C5CFF" }
    case "anniversary": return { tint: "#FFE7E1", dot: "#EC6E8E" }
    case "graduation": return { tint: "#DCEEFF", dot: "#3B82F6" }
    case "engagement": return { tint: "#FFF1EA", dot: "#FF9E7D" }
    default: return { tint: "#F3F4F6", dot: "#6B7280" }
  }
}

export default async function CalendarPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const events = await prisma.event.findMany({
    where: { userId: session.user.id },
    include: { person: true },
    orderBy: { date: "asc" },
  })

  const today = new Date()
  const allEvents = events
    .map((e: EventWithPerson) => ({
      id: e.id,
      type: e.type,
      personId: e.personId,
      personName: e.person?.name || "",
      nextDate: getNextOccurrence(e.date, e.repeat).toISOString(),
      daysLabel: daysUntilLabel(getNextOccurrence(e.date, e.repeat)),
      dateLabel: formatDate(getNextOccurrence(e.date, e.repeat)),
      colors: eventTypeColor(e.type),
      reminder: e.reminder,
      repeat: e.repeat,
      notes: e.notes,
    }))
    .sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime())

  return (
    <CalendarClient
      events={allEvents}
      initialYear={today.getFullYear()}
      initialMonth={today.getMonth()}
    />
  )
}
