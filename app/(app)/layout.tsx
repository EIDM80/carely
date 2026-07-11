import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { BottomNav } from "@/components/navigation/BottomNav"
import { SidebarNav } from "@/components/navigation/SidebarNav"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-[var(--canvas)]">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <SidebarNav user={session.user ?? {}} />
        <main className="flex-1 lg:ml-[280px] min-h-screen">
          <div className="max-w-3xl mx-auto px-10 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <main className="pb-[86px]">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
