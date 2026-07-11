import { cn, getInitials, daysUntilLabel } from "@/lib/utils"
import { ChevronRight } from "@/components/icons"
import type { Person, Event } from "@/types"

interface PersonCardProps {
  person: Person
  nextEvent?: Event
  className?: string
  onClick?: () => void
}

const pastelColors = [
  { bg: "#FFE7E1", text: "#E87B5A" },
  { bg: "#EDE8FF", text: "#7C5CFF" },
  { bg: "#DCEEFF", text: "#2F80ED" },
  { bg: "#D1FAE5", text: "#059669" },
  { bg: "#FEF3C7", text: "#D97706" },
  { bg: "#FCE7F3", text: "#DB2777" },
]

function getColorForName(name: string): { bg: string; text: string } {
  const idx = name.charCodeAt(0) % pastelColors.length
  return pastelColors[idx] ?? pastelColors[0]!
}

export function PersonCard({ person, nextEvent, className, onClick }: PersonCardProps) {
  const colors = getColorForName(person.name)
  const initials = getInitials(person.name)

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
        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0"
        style={{ background: colors.bg, color: colors.text }}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[var(--text)] font-semibold text-sm">{person.name}</p>
        <p className="text-[var(--text3)] text-xs mt-0.5">
          {person.relation}
          {nextEvent && (
            <span className="text-[var(--text3)]">
              {" · "}
              {nextEvent.type} in {daysUntilLabel(nextEvent.date)}
            </span>
          )}
        </p>
      </div>
      <ChevronRight size={18} className="text-[var(--text3)] flex-shrink-0" />
    </div>
  )
}
