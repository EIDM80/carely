"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, People, Sparkles, User } from "@/components/icons"

const navItems = [
  { label: "Home", href: "/dashboard", Icon: Home },
  { label: "Calendar", href: "/calendar", Icon: Calendar },
  { label: "People", href: "/people", Icon: People },
  { label: "AI", href: "/ai", Icon: Sparkles },
  { label: "Profile", href: "/profile", Icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-20 flex items-start justify-around pt-3"
      style={{
        height: 86,
        background: "var(--nav-bg)",
        backdropFilter: "blur(18px)",
        borderTop: "1px solid var(--border2)",
      }}
    >
      {navItems.map(({ label, href, Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/")
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-[5px] flex-1 py-0"
          >
            <span
              className="flex items-center justify-center w-[58px] h-8 rounded-full transition-all duration-200"
              style={{
                background: active ? "var(--lav)" : "transparent",
                color: active ? "#7C5CFF" : "var(--text3)",
              }}
            >
              <Icon size={23} />
            </span>
            <span
              className="text-[11px] font-semibold"
              style={{ color: active ? "#7C5CFF" : "var(--text3)" }}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
