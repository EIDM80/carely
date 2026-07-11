import Link from "next/link"
import { ArrowLeft, Search, Chat } from "@/components/icons"

const FAQS = [
  {
    q: "How do I add a person?",
    a: "Tap the People tab, then the + button in the top right. Fill in their name, relationship, and any notes about them.",
  },
  {
    q: "How does the AI message generator work?",
    a: "Tap AI in the nav, select who it's for and the occasion, choose a tone, and hit Generate. Carely crafts a personal message in seconds — you can edit, save, or schedule it.",
  },
  {
    q: "Can I set recurring annual events?",
    a: "Yes! When adding an event, toggle 'Repeat every year' to on. Carely will automatically remind you each year.",
  },
  {
    q: "Is my data private?",
    a: "Absolutely. All your data is encrypted and stored securely. We never sell or share it with third parties. See Privacy & Data for details.",
  },
  {
    q: "How do scheduled messages work?",
    a: "After generating an AI message, tap 'Schedule this message' and pick when to send it. Carely will deliver it at the right moment.",
  },
]

export default function HelpPage() {
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
          <h1 className="text-[22px] font-extrabold" style={{ color: "var(--text)" }}>Help Center</h1>
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-2.5 h-[52px] rounded-[14px] px-4 mb-6"
          style={{ border: "1.5px solid var(--border)", background: "var(--surface)" }}
        >
          <Search size={20} style={{ color: "var(--text3)" }} />
          <input
            placeholder="Search help articles…"
            className="flex-1 text-[15px] bg-transparent outline-none"
            style={{ color: "var(--text)" }}
          />
        </div>

        <div
          className="text-[13px] font-bold tracking-widest mb-2.5 ml-1"
          style={{ color: "var(--text3)" }}
        >
          FREQUENT QUESTIONS
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {FAQS.map((f) => (
            <div
              key={f.q}
              className="rounded-[18px] px-[18px] py-4"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border2)",
                boxShadow: "0 6px 16px rgba(31,41,55,.05)",
              }}
            >
              <div className="text-[15px] font-bold mb-1.5" style={{ color: "var(--text)" }}>{f.q}</div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text2)" }}>{f.a}</p>
            </div>
          ))}
        </div>

        <button
          className="w-full h-[52px] rounded-[14px] flex items-center justify-center gap-2.5 font-bold text-[15px] text-white"
          style={{
            background: "#7C5CFF",
            boxShadow: "0 14px 30px -10px rgba(124,92,255,.7)",
          }}
        >
          <Chat size={19} /> Contact support
        </button>
      </div>
    </div>
  )
}
