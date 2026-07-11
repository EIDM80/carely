import { create } from "zustand"
import { persist } from "zustand/middleware"

type ToastType = "success" | "error" | "info"

interface Toast {
  text: string
  type: ToastType
}

interface AppState {
  theme: "light" | "dark"
  toast: Toast | null
  sidebarOpen: boolean
  setTheme: (theme: "light" | "dark") => void
  toggleTheme: () => void
  showToast: (text: string, type?: ToastType) => void
  clearToast: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "light",
      toast: null,
      sidebarOpen: false,
      setTheme: (theme) => {
        set({ theme })
        if (typeof document !== "undefined") {
          if (theme === "dark") {
            document.documentElement.classList.add("dark")
            localStorage.setItem("carely.dark", "1")
          } else {
            document.documentElement.classList.remove("dark")
            localStorage.removeItem("carely.dark")
          }
        }
      },
      toggleTheme: () => {
        const current = get().theme
        get().setTheme(current === "light" ? "dark" : "light")
      },
      showToast: (text, type = "success") => {
        set({ toast: { text, type } })
        setTimeout(() => set({ toast: null }), 3000)
      },
      clearToast: () => set({ toast: null }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: "carely-store",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)
