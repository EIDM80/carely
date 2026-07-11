"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/app-store"
import { Bell, Sun, Moon, Sparkles, People, Gift, Crown, Calendar, ChevronRight } from "@/components/icons"

interface EventItem {
  id: string
  type: string
  personName: string
  personId: string
  nextDate: string
  daysLabel: string
  dateLabel: string
  colors: { tint: string; dot: string }
}

interface NextEventData {
  id: string
  type: string
  personName: string
  personInitial: string
  personColor: string
  daysLabel: string
  dateLabel: string
  personId: string
}

interface Props {
  userName: string
  greeting: string
  todayStr: string
  upcoming: EventItem[]
  nextEvent: NextEventData | null
  suggestion: string
  peopleCount: number
  messagesCount: number
}

function EventTypeIcon({ type }: { type: string }) {
  const t = type.toLowerCase()
  if (t === "birthday") return <Gift size={24} />
  if (t === "anniversary") return <span className="text-lg">💍</span>
  if (t === "graduation") return <span className="text-lg">🎓</span>
  if (t === "engagement") return <span className="text-lg">💍</span>
  return <Calendar size={24} />
}

export function DashboardClient({
  userName,
  greeting,
  todayStr,
  upcoming,
  nextEvent,
  suggestion,
  peopleCount,
  messagesCount,
}: Props) {
  const { theme, toggleTheme } = useAppStore()
  const router = useRouter()

  return (
    <div
      className="min-h-screen animate-fadeIn"
      style={{ background: "var(--canvas)", paddingBottom: 100 }}
    >
      <div className="px-5 pt-16">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-sm font-medium" style={{ color: "var(--text3)" }}>{todayStr}</div>
            <h1
              className="text-[27px] font-extrabold mt-1 tracking-tight"
              style={{ color: "var(--text)" }}
            >
              {greeting}, {userName}.
            </h1>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={toggleTheme}
              className="w-11 h-11 rounded-[14px] flex items-center justify-center transition-all"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border2)",
                boxShadow: "0 4px 12px rgba(31,41,55,.05)",
                color: "#7C5CFF",
              }}
            >
              {theme === "dark" ? <Sun size={21} /> : <Moon size={21} />}
            </button>
            <Link
              href="/notifications"
              className="w-11 h-11 rounded-[14px] flex items-center justify-center relative transition-all"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border2)",
                boxShadow: "0 4px 12px rgba(31,41,55,.05)",
                color: "var(--text)",
              }}
            >
              <Bell size={21} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#FF6F91] border-2 border-white" />
            </Link>
            <Link
              href="/profile"
              className="w-11 h-11 rounded-[14px] flex items-center justify-center text-white font-extrabold text-[17px]"
              style={{ background: "linear-gradient(135deg,#7C5CFF,#9B87FF)" }}
            >
              {userName[0]}
            </Link>
          </div>
        </div>

        {/* Next event hero card */}
        {nextEvent && (
          <div
            className="rounded-3xl p-6 text-white relative overflow-hidden mb-5"
            style={{
              background: "linear-gradient(150deg,#7C5CFF 0%,#9B87FF 100%)",
              boxShadow: "0 22px 44px -18px rgba(124,92,255,.7)",
            }}
          >
            <div
              className="absolute w-[170px] h-[170px] rounded-full"
              style={{
                background: "rgba(255,255,255,.12)",
                top: -70,
                right: -40,
              }}
            />
            <div className="relative flex items-center gap-2 text-[13px] font-semibold opacity-90 mb-3.5">
              <Bell size={16} />
              NEXT MOMENT
            </div>
            <div className="relative flex items-center gap-3.5 mb-4">
              <div
                className="w-[50px] h-[50px] rounded-2xl flex items-center justify-center font-extrabold text-xl"
                style={{ background: "rgba(255,255,255,.2)" }}
              >
                {nextEvent.personInitial}
              </div>
              <div>
                <div className="text-[21px] font-extrabold tracking-tight">
                  {nextEvent.personName}'s {nextEvent.type}
                </div>
                <div className="text-sm opacity-90">
                  {nextEvent.dateLabel} · {nextEvent.daysLabel}
                </div>
              </div>
            </div>
            <div className="relative flex gap-2.5">
              <Link
                href={`/ai?personId=${nextEvent.personId}&type=${nextEvent.type}`}
                className="flex-1 h-12 rounded-[14px] flex items-center justify-center gap-2 font-bold text-[15px]"
                style={{ background: "var(--surface)", color: "#7C5CFF" }}
              >
                <Sparkles size={18} /> Prepare Message
              </Link>
              <Link
                href="/calendar"
                className="h-12 px-4 rounded-[14px] flex items-center justify-center font-bold text-[15px] text-white"
                style={{ border: "1px solid rgba(255,255,255,.3)", background: "rgba(255,255,255,.16)" }}
              >
                Calendar
              </Link>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-2.5 mb-5">
          {[
            { label: "Add Person", href: "/people/new", Icon: People, tint: "var(--lav)", color: "#7C5CFF" },
            { label: "Add Event", href: "/events/new", Icon: Gift, tint: "#FFF1EA", color: "#FF9E7D" },
            { label: "Ask AI", href: "/ai", Icon: Sparkles, tint: "#DCEEFF", color: "#3B82F6" },
            { label: "Upgrade", href: "/subscription", Icon: Crown, tint: "#FFE7E1", color: "#EC6E8E" },
          ].map(({ label, href, Icon, tint, color }) => (
            <Link
              key={href}
              href={href}
              className="rounded-2xl pt-3 pb-3 flex flex-col items-center gap-2 cursor-pointer"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border2)",
                boxShadow: "0 4px 12px rgba(31,41,55,.04)",
              }}
            >
              <span
                className="w-[38px] h-[38px] rounded-xl flex items-center justify-center"
                style={{ background: tint, color }}
              >
                <Icon size={20} />
              </span>
              <span className="text-[11px] font-semibold" style={{ color: "var(--text2)" }}>
                {label}
              </span>
            </Link>
          ))}
        </div>

        {/* AI suggestion card */}
        <div
          className="flex gap-3.5 rounded-2xl p-[18px] mb-6"
          style={{
            background: "linear-gradient(135deg,#F8F5FF,#FFF4F8)",
            border: "1px solid var(--soft-border)",
          }}
        >
          <span
            className="w-[42px] h-[42px] rounded-[13px] flex items-center justify-center flex-shrink-0"
            style={{
              background: "var(--surface)",
              color: "#7C5CFF",
              boxShadow: "0 6px 14px -6px rgba(124,92,255,.4)",
            }}
          >
            <Sparkles size={23} />
          </span>
          <div className="flex-1">
            <div className="text-[13px] font-bold mb-1" style={{ color: "#7C5CFF" }}>
              Carely suggests
            </div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text2)" }}>
              {suggestion}
            </p>
            <Link
              href="/ai"
              className="h-[38px] px-4 rounded-xl inline-flex items-center text-[13px] font-semibold text-white"
              style={{ background: "#7C5CFF" }}
            >
              Prepare something thoughtful
            </Link>
          </div>
        </div>

        {/* Upcoming moments */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
            Upcoming moments
          </h2>
          <Link href="/calendar" className="text-sm font-semibold" style={{ color: "#7C5CFF" }}>
            See all
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div
            className="rounded-2xl p-6 text-center mb-6"
            style={{ background: "var(--surface)", border: "1px solid var(--border2)" }}
          >
            <p className="text-sm" style={{ color: "var(--text3)" }}>
              No upcoming events.{" "}
              <Link href="/events/new" className="font-semibold" style={{ color: "#7C5CFF" }}>
                Add one
              </Link>
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-7">
            {upcoming.map((e) => (
              <Link
                key={e.id}
                href={`/people/${e.personId}`}
                className="flex items-center gap-3.5 rounded-[18px] p-3.5 cursor-pointer"
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
                  <EventTypeIcon type={e.type} />
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
              </Link>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
            Your circle
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "People", value: peopleCount, color: "#7C5CFF" },
            { label: "Moments", value: upcoming.length, color: "#FF9E7D" },
            { label: "Messages", value: messagesCount, color: "#EC6E8E" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-[18px] p-4 text-center"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border2)",
                boxShadow: "0 6px 16px rgba(31,41,55,.05)",
              }}
            >
              <div className="text-[26px] font-extrabold" style={{ color }}>{value}</div>
              <div className="text-xs font-semibold mt-0.5" style={{ color: "var(--text3)" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
