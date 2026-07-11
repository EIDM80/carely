import { cn } from "@/lib/utils"

interface LoadingStateProps {
  rows?: number
  className?: string
}

function SkeletonLine({ width = "100%", height = 16 }: { width?: string; height?: number }) {
  return (
    <div
      className="rounded-lg bg-[var(--border2)] animate-pulse"
      style={{ width, height }}
    />
  )
}

export function LoadingState({ rows = 3, className }: LoadingStateProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-[20px] bg-[var(--surface)] shadow-[0_2px_8px_rgba(31,41,55,0.06)]"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--border2)] animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonLine width="60%" height={14} />
              <SkeletonLine width="40%" height={12} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("p-4 rounded-[20px] bg-[var(--surface)] shadow-[0_2px_8px_rgba(31,41,55,0.06)]", className)}>
      <div className="space-y-3">
        <SkeletonLine width="40%" height={12} />
        <SkeletonLine width="70%" height={20} />
        <SkeletonLine width="55%" height={14} />
      </div>
    </div>
  )
}
