"use client"

import { useState } from "react"
import Link from "next/link"
import { useAppStore } from "@/store/app-store"
import { ArrowLeft, Bell, Moon, Shield, ChevronRight, Trash } from "@/components/icons"

export default function SettingsPage() {
  const { theme, toggleTheme } = useAppStore()
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(true)

  const toggles = [
    {
      label: "Email notifications",
      sub: "Get event reminders by email",
      Icon: Bell,
      bg: "#FFE7E1",
      color: "#EC6E8E",
      value: emailNotifs,
      onToggle: () => setEmailNotifs((v) => !v),
    },
    {
      label: "Push notifications",
      sub: "Alerts on your device",
      Icon: Bell,
      bg: "#EDE8FF",
      color: "#7C5CFF",
      value: pushNotifs,
      onToggle: () => setPushNotifs((v) => !v),
    },
    {
      label: "Dark mode",
      sub: "Easy on the eyes at night",
      Icon: Moon,
      bg: "#1E293B",
      color: "#9B87FF",
      value: theme === "dark",
      onToggle: toggleTheme,
    },
  ]

  return (
    <div className="min-h-screen animate-fadeIn pb-28" style={{ background: "var(--canvas)" }}>
      <div className="px-5 pt-16">
        <div className="flex items-center gap-3.5 mb-6">
          <Link
            href="/profile"
            className="w-[42px] h-[42px] rounded-xl flex items-center justify-center"
            style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
          >
            <ArrowLeft size={20} style={{ color: "var(--text)" }} />
          </Link>
          <h1 className="text-[22px] font-extrabold" style={{ color: "var(--text)" }}>Settings</h1>
        </div>

        <div
          className="text-[13px] font-bold tracking-widest mb-2.5 ml-1"
          style={{ color: "var(--text3)" }}
        >
          PREFERENCES
        </div>
        <div
          className="rounded-2xl overflow-hidden mb-6"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border2)",
            boxShadow: "0 8px 24px rgba(31,41,55,.05)",
          }}
        >
          {toggles.map(({ label, sub, Icon, bg, color, value, onToggle }, i) => (
            <div
              key={label}
              className="flex items-center gap-3.5 px-[18px] py-4"
              style={{ borderBottom: i < toggles.length - 1 ? "1px solid var(--border3)" : "none" }}
            >
              <span
                className="w-[38px] h-[38px] rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: bg, color }}
              >
                <Icon size={20} />
              </span>
              <div className="flex-1">
                <div className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>{label}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text3)" }}>{sub}</div>
              </div>
              <button
                onClick={onToggle}
                className="w-[46px] h-7 rounded-full relative transition-all flex-shrink-0"
                style={{ background: value ? "#7C5CFF" : "var(--border2)" }}
              >
                <span
                  className="absolute top-[3px] w-[21px] h-[21px] rounded-full transition-all"
                  style={{
                    left: value ? "calc(100% - 24px)" : 3,
                    background: "white",
                    boxShadow: "0 2px 5px rgba(0,0,0,.2)",
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        <div
          className="text-[13px] font-bold tracking-widest mb-2.5 ml-1"
          style={{ color: "var(--text3)" }}
        >
          ACCOUNT
        </div>
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border2)",
            boxShadow: "0 8px 24px rgba(31,41,55,.05)",
          }}
        >
          {[
            { label: "Change Password", Icon: Shield, bg: "#EDE8FF", color: "#7C5CFF", textColor: "var(--text)" },
            { label: "Export My Data", Icon: Shield, bg: "#DCEEFF", color: "#3B82F6", textColor: "var(--text)" },
            { label: "Delete Account", Icon: Trash, bg: "#FEE2E2", color: "#EF4444", textColor: "#EF4444" },
          ].map(({ label, Icon, bg, color, textColor }, i) => (
            <button
              key={label}
              className="w-full flex items-center gap-3.5 px-[18px] py-4"
              style={{ borderBottom: i < 2 ? "1px solid var(--border3)" : "none" }}
            >
              <span
                className="w-[38px] h-[38px] rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: bg, color }}
              >
                <Icon size={20} />
              </span>
              <span className="flex-1 text-[15px] font-semibold text-left" style={{ color: textColor }}>
                {label}
              </span>
              <ChevronRight size={22} style={{ color: "#D1D5DB" }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
