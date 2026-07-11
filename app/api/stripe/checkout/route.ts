import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getStripe, STRIPE_PRICES } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { plan } = await req.json()

  if (!["premium", "family"].includes(plan)) {
    return Response.json({ error: "Invalid plan" }, { status: 400 })
  }

  const priceId = STRIPE_PRICES[plan as "premium" | "family"]
  if (!priceId) {
    return Response.json(
      { error: "Stripe price not configured. Set STRIPE_PRICE_PREMIUM or STRIPE_PRICE_FAMILY." },
      { status: 500 }
    )
  }

  const stripe = getStripe()
  const sub = await prisma.subscription.findUnique({ where: { userId: session.user.id } })
  let customerId = sub?.stripeCustomerId

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      name: session.user.name || undefined,
      metadata: { userId: session.user.id },
    })
    customerId = customer.id

    await prisma.subscription.upsert({
      where: { userId: session.user.id },
      update: { stripeCustomerId: customerId },
      create: { userId: session.user.id, stripeCustomerId: customerId, plan: "free" },
    })
  }

  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    subscription_data: {
      trial_period_days: plan === "premium" ? 7 : undefined,
      metadata: { userId: session.user.id, plan },
    },
    success_url: `${appUrl}/subscription?success=1`,
    cancel_url: `${appUrl}/subscription`,
  })

  return Response.json({ url: checkoutSession.url })
}
