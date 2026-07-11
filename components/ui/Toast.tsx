"use client"

import { useAppStore } from "@/store/app-store"
import { Check, X } from "@/components/icons"

export function Toast() {
  const { toast, clearToast } = useAppStore()

  if (!toast) return null

  const colors: Record<string, string> = {
    success: "#10B981",
    error: "#EF4444",
    info: "#7C5CFF",
  }

  return (
    <div
      className="fixed bottom-[100px] left-1/2 -translate-x-1/2 z-50 animate-slideUp"
      style={{ minWidth: 260, maxWidth: "90vw" }}
    >
      <div
        className="flex items-center gap-3 px-5 py-4 rounded-2xl shadow-floating"
        style={{ background: "#1F2937" }}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: colors[toast.type] + "22" }}
        >
          {toast.type === "error" ? (
            <X size={14} className="text-red-400" />
          ) : (
            <span style={{ color: colors[toast.type] }}>
              <Check size={14} />
            </span>
          )}
        </div>
        <span className="text-white text-sm font-medium">{toast.text}</span>
        <button
          onClick={clearToast}
          className="ml-auto text-gray-400 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
