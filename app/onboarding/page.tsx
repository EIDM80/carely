"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight } from "@/components/icons"

const steps = [
  {
    kicker: "YOUR EMOTIONAL COMPASS",
    headline: "Never miss the moments that matter.",
    sub: "Carely remembers the people and occasions closest to you — so you never have to.",
    emotion: "Every moment remembered is a relationship strengthened.",
    art: (
      <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[260px]">
        <ellipse cx="100" cy="80" rx="70" ry="55" fill="#EDE8FF" />
        <circle cx="80" cy="65" r="22" fill="#7C5CFF" opacity=".18" />
        <circle cx="125" cy="90" r="16" fill="#FFB49A" opacity=".3" />
        <circle cx="70" cy="100" r="10" fill="#9B87FF" opacity=".25" />
        <path d="M100 50 C100 50 85 62 100 75 C115 62 100 50 100 50Z" fill="#7C5CFF" opacity=".7" />
        <circle cx="130" cy="55" r="6" fill="#FFB49A" opacity=".6" />
        <circle cx="65" cy="55" r="4" fill="#9B87FF" opacity=".5" />
      </svg>
    ),
  },
  {
    kicker: "PERSONAL AI MESSAGES",
    headline: "Say it beautifully, every time.",
    sub: "Carely crafts heartfelt messages in your voice — for birthdays, anniversaries, and every special day.",
    emotion: "The right words, at the right time.",
    art: (
      <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[260px]">
        <rect x="30" y="35" width="140" height="90" rx="20" fill="#EDE8FF" />
        <rect x="45" y="55" width="80" height="8" rx="4" fill="#7C5CFF" opacity=".4" />
        <rect x="45" y="70" width="110" height="8" rx="4" fill="#9B87FF" opacity=".3" />
        <rect x="45" y="85" width="65" height="8" rx="4" fill="#7C5CFF" opacity=".25" />
        <circle cx="148" cy="108" r="20" fill="#7C5CFF" />
        <path d="M140 108 L156 108 M148 100 L148 116" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    kicker: "SMART REMINDERS",
    headline: "Your relationships, on autopilot.",
    sub: "Get gentle reminders before every important moment with Carely's intelligent scheduling.",
    emotion: "Care without the stress.",
    art: (
      <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[260px]">
        <circle cx="100" cy="80" r="55" fill="#DCEEFF" />
        <circle cx="100" cy="80" r="38" fill="white" opacity=".8" />
        <circle cx="100" cy="80" r="5" fill="#7C5CFF" />
        <line x1="100" y1="80" x2="100" y2="52" stroke="#7C5CFF" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="100" y1="80" x2="117" y2="87" stroke="#FFB49A" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="155" cy="38" r="12" fill="#FFB49A" opacity=".4" />
        <circle cx="48" cy="42" r="8" fill="#9B87FF" opacity=".35" />
      </svg>
    ),
  },
  {
    kicker: "BUILT FOR EVERYONE",
    headline: "Stay close to everyone you love.",
    sub: "Family, friends, colleagues — Carely helps you show up for all of them, effortlessly.",
    emotion: "Because every relationship deserves attention.",
    art: (
      <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[260px]">
        <circle cx="100" cy="80" r="22" fill="#7C5CFF" opacity=".15" />
        <circle cx="100" cy="80" r="10" fill="#7C5CFF" opacity=".5" />
        <circle cx="55" cy="65" r="18" fill="#FFB49A" opacity=".25" />
        <circle cx="55" cy="65" r="8" fill="#FFB49A" opacity=".6" />
        <circle cx="148" cy="62" r="16" fill="#DCEEFF" opacity=".5" />
        <circle cx="148" cy="62" r="7" fill="#3B82F6" opacity=".5" />
        <circle cx="72" cy="115" r="14" fill="#EDE8FF" opacity=".6" />
        <circle cx="72" cy="115" r="6" fill="#9B87FF" opacity=".6" />
        <circle cx="130" cy="112" r="12" fill="#FFE7E1" opacity=".6" />
        <circle cx="130" cy="112" r="5" fill="#EC6E8E" opacity=".5" />
        <line x1="100" y1="80" x2="55" y2="65" stroke="#7C5CFF" strokeWidth="1.5" opacity=".2" strokeDasharray="4 3" />
        <line x1="100" y1="80" x2="148" y2="62" stroke="#7C5CFF" strokeWidth="1.5" opacity=".2" strokeDasharray="4 3" />
        <line x1="100" y1="80" x2="72" y2="115" stroke="#7C5CFF" strokeWidth="1.5" opacity=".2" strokeDasharray="4 3" />
        <line x1="100" y1="80" x2="130" y2="112" stroke="#7C5CFF" strokeWidth="1.5" opacity=".2" strokeDasharray="4 3" />
      </svg>
    ),
  },
  {
    kicker: "READY TO START?",
    headline: "Your moments await.",
    sub: "Join thousands of people who never forget what matters most.",
    emotion: "Let Carely help you care.",
    art: (
      <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[260px]">
        <path d="M100 30 C100 30 68 55 100 82 C132 55 100 30 100 30Z" fill="#7C5CFF" opacity=".8" />
        <circle cx="100" cy="105" r="28" fill="#EDE8FF" />
        <circle cx="100" cy="105" r="15" fill="#7C5CFF" opacity=".2" />
        <circle cx="60" cy="45" r="8" fill="#FFB49A" opacity=".5" />
        <circle cx="145" cy="50" r="10" fill="#9B87FF" opacity=".4" />
        <circle cx="155" cy="110" r="6" fill="#FFB49A" opacity=".4" />
        <circle cx="45" cy="115" r="7" fill="#DCEEFF" opacity=".6" />
      </svg>
    ),
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const current = steps[step]
  const isLast = step === steps.length - 1

  function next() {
    if (isLast) return
    setStep((s) => s + 1)
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(180deg, #FAFAF7, #F4F1FF)" }}
    >
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-7 pt-16 pb-10">
        {/* Skip */}
        <div className="flex justify-end mb-6">
          <Link
            href="/login"
            className="text-sm font-semibold"
            style={{ color: "var(--text3)" }}
          >
            Skip
          </Link>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === step ? 28 : 8,
                background: i === step ? "#7C5CFF" : "#D1D5DB",
              }}
            />
          ))}
        </div>

        {/* Art */}
        <div className="flex justify-center mb-8">
          {current.art}
        </div>

        {/* Content */}
        <div className="mb-10">
          <p className="text-[11px] font-bold tracking-widest mb-3" style={{ color: "#9B87FF" }}>
            {current.kicker}
          </p>
          <h1
            className="text-[30px] font-extrabold leading-tight tracking-tight mb-3"
            style={{ color: "var(--text)" }}
          >
            {current.headline}
          </h1>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--text2)" }}>
            {current.sub}
          </p>
          <p className="text-sm italic font-medium" style={{ color: "#9B87FF" }}>
            "{current.emotion}"
          </p>
        </div>

        {/* Actions */}
        <div className="mt-auto flex flex-col gap-3">
          {isLast ? (
            <>
              <Link
                href="/signup"
                className="h-[54px] rounded-btn text-white font-bold text-base flex items-center justify-center"
                style={{
                  background: "#7C5CFF",
                  boxShadow: "0 14px 30px -10px rgba(124,92,255,.7)",
                }}
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="h-[50px] flex items-center justify-center font-semibold text-[15px]"
                style={{ color: "#7C5CFF" }}
              >
                Sign In
              </Link>
            </>
          ) : (
            <button
              onClick={next}
              className="h-[54px] rounded-btn text-white font-bold text-base flex items-center justify-center gap-2"
              style={{
                background: "#7C5CFF",
                boxShadow: "0 14px 30px -10px rgba(124,92,255,.7)",
              }}
            >
              Continue <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
