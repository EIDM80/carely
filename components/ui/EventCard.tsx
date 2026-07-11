import { cn, formatDate, daysUntilLabel } from "@/lib/utils"
import type { Event, Person } from "@/types"

interface EventCardProps {
  event: Event
  person?: Person
  className?: string
  onClick?: () => void
}

const eventTypeEmoji: Record<string, string> = {
  Birthday: "🎂",
  Anniversary: "💍",
  Graduation: "🎓",
  Engagement: "💍",
  Custom: "⭐",
}

const eventTypeColor: Record<string, string> = {
  Birthday: "#FFB49A",
  Anniversary: "#FFE7E1",
  Graduation: "#DCEEFF",
  Engagement: "#EDE8FF",
  Custom: "#F6F3FF",
}

export function EventCard({ event, person, className, onClick }: EventCardProps) {
  const emoji = eventTypeEmoji[event.type] ?? "⭐"
  const bgColor = eventTypeColor[event.type] ?? "#F6F3FF"
  const label = daysUntilLabel(event.date)
  const isToday = label === "Today"

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-[20px] bg-[var(--surface)] cursor-pointer transition-all hover:shadow-card active:scale-[0.99]",
        "shadow-[0_2px_8px_rgba(31,41,55,0.06)]",
        className
      )}
      onClick={onClick}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: bgColor }}
      >
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[var(--text)] font-semibold text-sm truncate">
          {person?.name ? `${person.name}'s ${event.type}` : event.type}
        </p>
        <p className="text-[var(--text3)] text-xs mt-0.5">{formatDate(event.date)}</p>
      </div>
      <div
        className={cn(
          "px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0",
          isToday
            ? "bg-[#7C5CFF] text-white"
            : "bg-[var(--lav)] text-[#7C5CFF]"
        )}
      >
        {label}
      </div>
    </div>
  )
}
