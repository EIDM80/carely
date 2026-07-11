"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { useAppStore } from "@/store/app-store"
import {
  Home, Calendar, People, Sparkles, User, Crown, Settings,
  Sun, Moon, Logout, Heart
} from "@/components/icons"
import { getInitials } from "@/lib/utils"

const navItems = [
  { label: "Home", href: "/dashboard", Icon: Home },
  { label: "Calendar", href: "/calendar", Icon: Calendar },
  { label: "People", href: "/people", Icon: People },
  { label: "AI Assistant", href: "/ai", Icon: Sparkles },
  { label: "Profile", href: "/profile", Icon: User },
  { label: "Settings", href: "/profile/settings", Icon: Settings },
]

interface SidebarNavProps {
  user: { name?: string | null; email?: string | null; image?: string | null }
}

export function SidebarNav({ user }: SidebarNavProps) {
  const pathname = usePathname()
  const { theme, toggleTheme } = useAppStore()

  return (
    <div
      className="fixed left-0 top-0 bottom-0 w-[280px] flex flex-col z-30 border-r"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border2)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b" style={{ borderColor: "var(--border2)" }}>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#7C5CFF,#9B87FF)" }}
        >
          <Heart size={18} className="text-white" />
        </div>
        <span className="text-lg font-extrabold" style={{ color: "var(--text)" }}>
          Carely
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ label, href, Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 group"
              style={{
                background: active ? "var(--lav)" : "transparent",
                color: active ? "#7C5CFF" : "var(--text2)",
              }}
            >
              <Icon size={20} />
              <span className="text-sm font-semibold">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Upgrade card */}
      <div className="px-3 py-2">
        <Link href="/subscription">
          <div
            className="rounded-xl p-4 cursor-pointer"
            style={{ background: "linear-gradient(135deg,#7C5CFF,#9B87FF)" }}
          >
            <div className="flex items-center gap-2 text-white mb-1">
              <Crown size={16} />
              <span className="text-sm font-bold">Go Premium</span>
            </div>
            <p className="text-xs text-white/80">Unlock unlimited people & AI messages</p>
          </div>
        </Link>
      </div>

      {/* Bottom: theme + user */}
      <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: "var(--border2)" }}>
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all"
          style={{ color: "var(--text2)" }}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          <span className="text-sm font-semibold">
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </span>
        </button>

        <div className="flex items-center gap-3 px-3 py-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: "var(--lav)", color: "#7C5CFF" }}
          >
            {getInitials(user.name || user.email || "U")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
              {user.name || "User"}
            </div>
            <div className="text-xs truncate" style={{ color: "var(--text3)" }}>
              {user.email}
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-1.5 rounded-lg transition-all"
            style={{ color: "var(--text3)" }}
          >
            <Logout size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
