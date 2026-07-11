import Link from "next/link"
import { ArrowLeft, Check } from "@/components/icons"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { SubscriptionButtons } from "./SubscriptionButtons"

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    cad: "forever",
    features: [
      "Up to 3 people",
      "Up to 5 events",
      "3 AI messages/month",
      "Basic reminders",
    ],
    gradient: null,
    recommended: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$9",
    cad: "/month",
    features: [
      "Unlimited people",
      "Unlimited events",
      "Unlimited AI messages",
      "Advanced reminders",
      "Scheduled messages",
      "Priority support",
    ],
    gradient: "linear-gradient(150deg,#7C5CFF,#9B87FF)",
    recommended: true,
  },
  {
    id: "family",
    name: "Family",
    price: "$16",
    cad: "/month",
    features: [
      "Everything in Premium",
      "Up to 5 accounts",
      "Shared event tracking",
      "Family dashboard",
    ],
    gradient: null,
    recommended: false,
  },
]

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const { success } = await searchParams
  const session = await auth()
  const sub = session?.user?.id
    ? await prisma.subscription.findUnique({ where: { userId: session.user.id } })
    : null

  const currentPlan = sub?.plan || "free"

  return (
    <div className="min-h-screen animate-fadeIn pb-28" style={{ background: "var(--canvas)" }}>
      <div className="px-5 pt-16">
        <div className="flex items-center gap-3.5 mb-5">
          <Link
            href="/profile"
            className="w-[42px] h-[42px] rounded-xl flex items-center justify-center"
            style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
          >
            <ArrowLeft size={20} style={{ color: "var(--text)" }} />
          </Link>
          <h1 className="text-[22px] font-extrabold" style={{ color: "var(--text)" }}>Plans</h1>
        </div>

        {success && (
          <div
            className="flex items-center gap-3 p-4 rounded-[16px] mb-5"
            style={{ background: "#E7F6EC", border: "1px solid #86EFAC" }}
          >
            <Check size={20} style={{ color: "#22C55E" }} />
            <div>
              <p className="font-bold text-sm" style={{ color: "#065F46" }}>Subscription activated!</p>
              <p className="text-xs" style={{ color: "#059669" }}>Welcome to Carely Premium. Enjoy all the features.</p>
            </div>
          </div>
        )}

        <div className="text-center mb-6">
          <h2 className="text-[25px] font-extrabold tracking-tight mb-1.5" style={{ color: "var(--text)" }}>
            Unlock care without limits.
          </h2>
          <p className="text-[15px]" style={{ color: "var(--text2)" }}>
            Choose the plan that fits how you care.
          </p>
        </div>

        <div className="flex flex-col gap-3.5">
          {PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.id
            return (
              <div
                key={plan.id}
                className="rounded-[22px] p-6 relative"
                style={{
                  background: plan.gradient || "var(--surface)",
                  border: plan.recommended
                    ? "2px solid #7C5CFF"
                    : "1px solid var(--border2)",
                  boxShadow: plan.recommended
                    ? "0 22px 44px -18px rgba(124,92,255,.4)"
                    : "0 8px 24px rgba(31,41,55,.06)",
                }}
              >
                {plan.recommended && (
                  <span
                    className="absolute -top-[11px] left-1/2 -translate-x-1/2 text-[11px] font-extrabold tracking-widest px-3.5 py-1 rounded-full"
                    style={{ background: "#FFB49A", color: "#7A3B22" }}
                  >
                    RECOMMENDED
                  </span>
                )}

                <div className="flex items-baseline justify-between mb-1">
                  <span
                    className="text-[19px] font-extrabold"
                    style={{ color: plan.gradient ? "#fff" : "var(--text)" }}
                  >
                    {plan.name}
                  </span>
                  <span
                    className="text-[13px] font-semibold"
                    style={{ color: plan.gradient ? "rgba(255,255,255,.8)" : "var(--text3)" }}
                  >
                    {plan.cad}
                  </span>
                </div>

                <div
                  className="text-[34px] font-extrabold tracking-tight mb-4"
                  style={{ color: plan.gradient ? "#fff" : "var(--text)" }}
                >
                  {plan.price}
                </div>

                <div className="flex flex-col gap-2.5 mb-5">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: plan.gradient ? "rgba(255,255,255,.25)" : "var(--lav)",
                          color: plan.gradient ? "#fff" : "#7C5CFF",
                        }}
                      >
                        <Check size={13} strokeWidth={2.5} />
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: plan.gradient ? "rgba(255,255,255,.9)" : "var(--text2)" }}
                      >
                        {f}
                      </span>
                    </div>
                  ))}
                </div>

                <SubscriptionButtons plan={plan} isCurrent={isCurrent} />
              </div>
            )
          })}
        </div>

        <p className="text-xs text-center mt-6" style={{ color: "var(--text3)" }}>
          Cancel anytime. No hidden fees. Billed securely via Stripe.
        </p>
      </div>
    </div>
  )
}
