import Link from "next/link"
import { ArrowLeft, Shield, ExternalLink, Download, Trash, ChevronRight } from "@/components/icons"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen animate-fadeIn pb-28" style={{ background: "var(--canvas)" }}>
      <div className="px-5 pt-16">
        <div className="flex items-center gap-3.5 mb-6">
          <Link
            href="/profile/settings"
            className="w-[42px] h-[42px] rounded-xl flex items-center justify-center"
            style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
          >
            <ArrowLeft size={20} style={{ color: "var(--text)" }} />
          </Link>
          <h1 className="text-[22px] font-extrabold" style={{ color: "var(--text)" }}>Privacy & Data</h1>
        </div>

        {/* Hero card */}
        <div
          className="rounded-2xl p-6 mb-6 flex gap-3.5 items-start"
          style={{ background: "linear-gradient(135deg,#F8F5FF,#FFF4F8)", border: "1px solid var(--soft-border)" }}
        >
          <span
            className="w-[46px] h-[46px] rounded-[14px] flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--surface)", color: "#7C5CFF" }}
          >
            <Shield size={24} />
          </span>
          <div>
            <div className="text-base font-extrabold mb-1" style={{ color: "var(--text)" }}>
              Your moments stay yours.
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text2)" }}>
              Everything you store in Carely is encrypted. We never sell your data or share it with anyone.
            </p>
          </div>
        </div>

        {/* Links */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border2)",
            boxShadow: "0 8px 24px rgba(31,41,55,.05)",
          }}
        >
          {[
            {
              label: "Privacy Policy",
              sub: "How we handle your data",
              Icon: Shield,
              bg: "#EDE8FF",
              color: "#7C5CFF",
              textColor: "var(--text)",
            },
            {
              label: "Terms of Service",
              sub: "Rules and agreements",
              Icon: ExternalLink,
              bg: "#DCEEFF",
              color: "#3B82F6",
              textColor: "var(--text)",
            },
            {
              label: "Export my data",
              sub: "Download everything in JSON",
              Icon: Download,
              bg: "#FFF1EA",
              color: "#FF9E7D",
              textColor: "var(--text)",
            },
            {
              label: "Delete my account",
              sub: "Permanently remove all data",
              Icon: Trash,
              bg: "#FEE2E2",
              color: "#EF4444",
              textColor: "#EF4444",
            },
          ].map(({ label, sub, Icon, bg, color, textColor }, i) => (
            <button
              key={label}
              className="w-full flex items-center gap-3.5 px-[18px] py-4"
              style={{ borderBottom: i < 3 ? "1px solid var(--border3)" : "none" }}
            >
              <span
                className="w-[38px] h-[38px] rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: bg, color }}
              >
                <Icon size={20} />
              </span>
              <div className="flex-1 text-left">
                <div className="text-[15px] font-semibold" style={{ color: textColor }}>{label}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text3)" }}>{sub}</div>
              </div>
              <ChevronRight size={22} style={{ color: "#D1D5DB" }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
