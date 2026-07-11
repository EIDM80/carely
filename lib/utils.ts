import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric" })
}

export function daysUntil(date: Date | string): number {
  const target = new Date(date)
  const now = new Date()
  const targetDate = new Date(target.getFullYear(), target.getMonth(), target.getDate())
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // For repeating events (birthdays etc), find next occurrence
  if (targetDate < nowDate) {
    targetDate.setFullYear(nowDate.getFullYear() + 1)
  }

  const diff = targetDate.getTime() - nowDate.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function daysUntilLabel(date: Date | string): string {
  const days = daysUntil(date)
  if (days === 0) return "Today"
  if (days === 1) return "Tomorrow"
  return `${days} days away`
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}
