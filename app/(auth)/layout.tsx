export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--canvas)" }}
    >
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        {children}
      </div>
    </div>
  )
}
