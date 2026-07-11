"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"
import { Crown, Settings, Shield, Help, Bell, ChevronRight, Logout } from "@/components/icons"

interface Props {
  user: { name: string; email: string; initial: string }
  stats: { people: number; events: number; messages: number }
  plan: string
}

const MENU = [
  { label: "Settings", href: "/profile/settings", Icon: Settings, bg: "#EDE8FF", color: "#7C5CFF" },
  { label: "Privacy & Data", href: "/profile/privacy", Icon: Shield, bg: "#DCEEFF", color: "#3B82F6" },
  { label: "Help Center", href: "/profile/help", Icon: Help, bg: "#FFF1EA", color: "#FF9E7D" },
  { label: "Notifications", href: "/notifications", Icon: Bell, bg: "#FFE7E1", color: "#EC6E8E" },
  { label: "Subscription", href: "/subscription", Icon: Crown, bg: "#FEF3C7", color: "#CA8A04" },
]

export function ProfileClient({ user, stats, plan }: Props) {
  return (
    <div className="min-h-screen animate-fadeIn pb-28" style={{ background: "var(--canvas)" }}>
      {/* Hero */}
      <div
        className="pt-16 pb-14 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(160deg,#7C5CFF,#9B87FF)" }}
      >
        <div
          className="absolute w-[200px] h-[200px] rounded-full"
          style={{ background: "rgba(255,255,255,.1)", top: -90, right: -50 }}
        />
        <span
          className="w-[84px] h-[84px] rounded-full inline-flex items-center justify-center font-extrabold text-[34px]"
          style={{
            background: "var(--surface)",
            color: "#7C5CFF",
            boxShadow: "0 14px 30px -10px rgba(0,0,0,.3)",
          }}
        >
          {user.initial}
        </span>
        <h1 className="text-[23px] font-extrabold text-white mt-3.5 mb-0.5">{user.name}</h1>
        <p className="text-sm text-white/85">{user.email}</p>
        <span
          className="inline-flex items-center gap-1.5 mt-3 px-3.5 py-1.5 rounded-full text-xs font-bold text-white"
          style={{ background: "rgba(255,255,255,.18)" }}
        >
          <Crown size={15} />
          {plan.charAt(0).toUpperCase() + plan.slice(1)} plan
        </span>
      </div>

      <div className="px-5 -mt-7">
        {/* Stats */}
        <div className="flex gap-3 mb-6">
          {[
            { label: "People", value: stats.people, color: "#7C5CFF" },
            { label: "Moments", value: stats.events, color: "#FF9E7D" },
            { label: "Messages", value: stats.messages, color: "#EC6E8E" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="flex-1 rounded-[18px] p-4 text-center"
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

        {/* Menu */}
        <div
          className="rounded-2xl overflow-hidden mb-5"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border2)",
            boxShadow: "0 8px 24px rgba(31,41,55,.05)",
          }}
        >
          {MENU.map(({ label, href, Icon, bg, color }, i) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3.5 px-[18px] py-4"
              style={{
                borderBottom: i < MENU.length - 1 ? "1px solid var(--border3)" : "none",
              }}
            >
              <span
                className="w-[38px] h-[38px] rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: bg, color }}
              >
                <Icon size={20} />
              </span>
              <span className="flex-1 text-[15px] font-semibold" style={{ color: "var(--text)" }}>
                {label}
              </span>
              <ChevronRight size={22} style={{ color: "#D1D5DB" }} />
            </Link>
          ))}
        </div>

        {/* Sign out */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full h-[52px] rounded-[14px] flex items-center justify-center gap-2.5 font-bold text-[15px] text-red-500 transition-all"
          style={{
            background: "var(--surface)",
            border: "1.5px solid #FEE2E2",
          }}
        >
          <Logout size={19} />
          Sign out
        </button>
      </div>
    </div>
  )
}
