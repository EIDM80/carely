import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { Event, Person, Message } from "@prisma/client"
import { ArrowLeft, Bell, Gift, Sparkles, Check } from "@/components/icons"
import { formatRelativeTime } from "@/lib/utils"

type EventWithPerson = Event & { person: Person | null }
type MessageWithPerson = Message & { person: Person | null }

function getNextOccurrence(date: Date, repeat: boolean): Date {
  const now = new Date()
  const d = new Date(date)
  const target = new Date(now.getFullYear(), d.getMonth(), d.getDate())
  if (target < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
    if (repeat) target.setFullYear(now.getFullYear() + 1)
  }
  return target
}

function daysUntil(date: Date): number {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export default async function NotificationsPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const [events, messages] = await Promise.all([
    prisma.event.findMany({
      where: { userId: session.user.id },
      include: { person: true },
      orderBy: { date: "asc" },
    }),
    prisma.message.findMany({
      where: { userId: session.user.id },
      include: { person: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ])

  // Upcoming events within 60 days
  const upcoming = (events as EventWithPerson[])
    .map((e) => ({ ...e, nextDate: getNextOccurrence(e.date, e.repeat) }))
    .filter((e) => {
      const d = daysUntil(e.nextDate)
      return d >= 0 && d <= 60
    })
    .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime())
    .slice(0, 5)

  type NotifItem = {
    id: string
    title: string
    body: string
    time: string
    bg: string
    color: string
    unread: boolean
    kind: "event" | "message"
  }

  const notifs: NotifItem[] = []

  for (const e of upcoming) {
    const d = daysUntil(e.nextDate)
    const label = d === 0 ? "today" : d === 1 ? "tomorrow" : `in ${d} days`
    notifs.push({
      id: `event-${e.id}`,
      title: `${e.person?.name}'s ${e.type} ${label}`,
      body: d <= 3
        ? `This is coming up very soon — now's a great time to prepare something heartfelt.`
        : `You have time to craft a perfect message for ${e.person?.name}.`,
      time: d === 0 ? "Today" : d === 1 ? "Tomorrow" : `${d} days away`,
      bg: e.type.toLowerCase() === "birthday" ? "#EDE8FF"
        : e.type.toLowerCase() === "anniversary" ? "#FFE7E1"
        : "#DCEEFF",
      color: e.type.toLowerCase() === "birthday" ? "#7C5CFF"
        : e.type.toLowerCase() === "anniversary" ? "#EC6E8E"
        : "#3B82F6",
      unread: d <= 7,
      kind: "event",
    })
  }

  for (const m of messages as MessageWithPerson[]) {
    if (m.scheduled && !m.sent) {
      notifs.push({
        id: `msg-sched-${m.id}`,
        title: `Message scheduled for ${m.person?.name}`,
        body: `Your ${m.tone.toLowerCase()} message will be sent ${m.channel === "whatsapp" ? "via WhatsApp" : "as a reminder"} at the scheduled time.`,
        time: formatRelativeTime(m.createdAt),
        bg: "#E7F6EC",
        color: "#22C55E",
        unread: false,
        kind: "message",
      })
    } else if (!m.scheduled) {
      notifs.push({
        id: `msg-${m.id}`,
        title: `AI draft saved for ${m.person?.name}`,
        body: `Your ${m.tone.toLowerCase()} message is ready. Schedule it or send it when you're ready.`,
        time: formatRelativeTime(m.createdAt),
        bg: "#FFF1EA",
        color: "#FF9E7D",
        unread: false,
        kind: "message",
      })
    }
  }

  const icons: Record<string, React.ElementType> = {
    event: Gift,
    message: Sparkles,
  }

  return (
    <div className="min-h-screen animate-fadeIn pb-28" style={{ background: "var(--canvas)" }}>
      <div className="px-5 pt-16">
        <div className="flex items-center gap-3.5 mb-6">
          <Link
            href="/dashboard"
            className="w-[42px] h-[42px] rounded-xl flex items-center justify-center"
            style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
          >
            <ArrowLeft size={20} style={{ color: "var(--text)" }} />
          </Link>
          <h1 className="text-[22px] font-extrabold" style={{ color: "var(--text)" }}>
            Notifications
          </h1>
        </div>

        {notifs.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center mt-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border2)" }}
          >
            <div
              className="w-16 h-16 rounded-[20px] flex items-center justify-center mx-auto mb-4"
              style={{ background: "var(--lav)", color: "#7C5CFF" }}
            >
              <Bell size={32} />
            </div>
            <p className="font-bold mb-1" style={{ color: "var(--text)" }}>You're all caught up</p>
            <p className="text-sm" style={{ color: "var(--text3)" }}>
              Notifications about upcoming moments and saved messages will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notifs.map((n) => {
              const Icon = icons[n.kind] || Bell
              return (
                <div
                  key={n.id}
                  className="flex gap-3.5 rounded-[18px] p-4"
                  style={{
                    background: n.unread ? "var(--surface)" : "var(--canvas)",
                    border: `1px solid ${n.unread ? "var(--border2)" : "var(--border3)"}`,
                    boxShadow: n.unread ? "0 6px 16px rgba(31,41,55,.05)" : "none",
                  }}
                >
                  <span
                    className="w-[42px] h-[42px] rounded-[13px] flex items-center justify-center flex-shrink-0"
                    style={{ background: n.bg, color: n.color }}
                  >
                    <Icon size={22} />
                  </span>
                  <div className="flex-1">
                    <div className="text-[15px] font-bold" style={{ color: "var(--text)" }}>{n.title}</div>
                    <p className="text-sm leading-snug mt-0.5" style={{ color: "var(--text2)" }}>{n.body}</p>
                    <div className="text-xs mt-1.5" style={{ color: "var(--text3)" }}>{n.time}</div>
                  </div>
                  {n.unread && (
                    <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: "#7C5CFF" }} />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
