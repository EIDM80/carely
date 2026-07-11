import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { Event, Person } from "@prisma/client"
import { getGreeting, daysUntilLabel, formatDate, getInitials } from "@/lib/utils"
import { DashboardClient } from "./DashboardClient"

type EventWithPerson = Event & { person: Person | null; nextDate: Date }

function getNextOccurrence(date: Date, repeat: boolean): Date {
  const now = new Date()
  const d = new Date(date)
  const target = new Date(now.getFullYear(), d.getMonth(), d.getDate())
  if (target < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
    if (repeat) target.setFullYear(now.getFullYear() + 1)
    else return d
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

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const [people, events, messages] = await Promise.all([
    prisma.person.findMany({ where: { userId: session.user.id } }),
    prisma.event.findMany({
      where: { userId: session.user.id },
      include: { person: true },
      orderBy: { date: "asc" },
    }),
    prisma.message.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ])

  const now = new Date()
  const upcoming: EventWithPerson[] = events
    .map((e) => ({
      ...e,
      nextDate: getNextOccurrence(e.date, e.repeat),
    }))
    .filter((e: EventWithPerson) => e.nextDate >= new Date(now.getFullYear(), now.getMonth(), now.getDate()))
    .sort((a: EventWithPerson, b: EventWithPerson) => a.nextDate.getTime() - b.nextDate.getTime())
    .slice(0, 5)

  const nextEvent = upcoming[0]
  const greeting = getGreeting()
  const userName = session.user.name?.split(" ")[0] || "there"

  const todayStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  const suggestion = nextEvent
    ? `${nextEvent.person?.name}'s ${nextEvent.type.toLowerCase()} is ${daysUntilLabel(nextEvent.nextDate).toLowerCase()}. A heartfelt message now will make it unforgettable.`
    : people.length > 0
    ? `You have ${people.length} people in your circle. Add their upcoming moments to never miss a beat.`
    : "Start by adding the people closest to you. Carely will help you show up for them."

  return (
    <DashboardClient
      userName={userName}
      greeting={greeting}
      todayStr={todayStr}
      upcoming={upcoming.map((e: EventWithPerson) => ({
        id: e.id,
        type: e.type,
        personName: e.person?.name || "",
        personId: e.personId,
        nextDate: e.nextDate.toISOString(),
        daysLabel: daysUntilLabel(e.nextDate),
        dateLabel: formatDate(e.nextDate),
        colors: eventTypeColor(e.type),
      }))}
      nextEvent={nextEvent ? {
        id: nextEvent.id,
        type: nextEvent.type,
        personName: nextEvent.person?.name || "",
        personInitial: getInitials(nextEvent.person?.name || "?"),
        personColor: nextEvent.person?.color || "#EDE8FF",
        daysLabel: daysUntilLabel(nextEvent.nextDate),
        dateLabel: formatDate(nextEvent.nextDate),
        personId: nextEvent.personId,
      } : null}
      suggestion={suggestion}
      peopleCount={people.length}
      messagesCount={messages.length}
    />
  )
}
