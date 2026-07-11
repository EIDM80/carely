import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7C5CFF",
        "primary-glow": "#9B87FF",
        peach: "#FFB49A",
        rose: "#FFE7E1",
        sky: "#DCEEFF",
        lav: "#EDE8FF",
        canvas: "var(--canvas)",
        surface: "var(--surface)",
        border: "var(--border)",
        "border2": "var(--border2)",
        "border3": "var(--border3)",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderRadius: {
        "card": "20px",
        "btn": "14px",
        "modal": "24px",
        "input": "14px",
      },
      boxShadow: {
        card: "0 8px 24px rgba(31,41,55,0.08)",
        floating: "0 12px 32px rgba(31,41,55,0.12)",
        "card-dark": "0 8px 24px rgba(0,0,0,0.2)",
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease forwards",
        slideUp: "slideUp 0.35s cubic-bezier(0.32, 0.72, 0, 1) forwards",
      },
    },
  },
  plugins: [],
}

export default config
