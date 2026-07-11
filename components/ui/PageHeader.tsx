"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "@/components/icons"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  showBack?: boolean
  onBack?: () => void
  action?: React.ReactNode
  className?: string
}

export function PageHeader({ title, showBack = true, onBack, action, className }: PageHeaderProps) {
  const router = useRouter()

  return (
    <div className={cn("flex items-center gap-4 mb-6", className)}>
      {showBack && (
        <button
          onClick={onBack ?? (() => router.back())}
          className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center shadow-[0_2px_8px_rgba(31,41,55,0.08)] transition-all hover:shadow-card active:scale-95 flex-shrink-0"
        >
          <ArrowLeft size={18} className="text-[var(--text)]" />
        </button>
      )}
      <h1 className="flex-1 text-[var(--text)] font-bold text-xl">{title}</h1>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
