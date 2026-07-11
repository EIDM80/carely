import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  body?: string
  cta?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ icon, title, body, cta, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center px-8 py-12",
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-[var(--lav)] flex items-center justify-center mb-5">
          {icon}
        </div>
      )}
      <h3 className="text-[var(--text)] font-semibold text-lg mb-2">{title}</h3>
      {body && <p className="text-[var(--text2)] text-sm max-w-xs">{body}</p>}
      {cta && (
        <button
          onClick={cta.onClick}
          className="mt-6 h-[54px] px-8 rounded-[14px] bg-[#7C5CFF] text-white font-semibold text-base transition-all hover:opacity-90 active:scale-[0.98]"
        >
          {cta.label}
        </button>
      )}
    </div>
  )
}
