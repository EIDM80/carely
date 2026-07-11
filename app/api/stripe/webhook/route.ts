import { NextRequest } from "next/server"
import { getStripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import type Stripe from "stripe"

export async function POST(req: NextRequest) {
  const stripe = getStripe()
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return Response.json({ error: "Invalid webhook signature" }, { status: 400 })
  }

  const sub = event.data.object as Stripe.Subscription

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const userId = sub.metadata?.userId
      if (!userId) break

      const plan = sub.metadata?.plan || "premium"
      const priceId = sub.items.data[0]?.price?.id || null
      const periodEnd = sub.billing_cycle_anchor
        ? new Date(sub.billing_cycle_anchor * 1000)
        : null

      await prisma.subscription.upsert({
        where: { userId },
        update: {
          plan,
          stripeSubscriptionId: sub.id,
          stripePriceId: priceId,
          status: sub.status,
          currentPeriodEnd: periodEnd,
        },
        create: {
          userId,
          plan,
          stripeSubscriptionId: sub.id,
          stripePriceId: priceId,
          status: sub.status,
          currentPeriodEnd: periodEnd,
        },
      })
      break
    }

    case "customer.subscription.deleted": {
      const userId = sub.metadata?.userId
      if (!userId) break

      await prisma.subscription.update({
        where: { userId },
        data: { plan: "free", status: "cancelled", stripeSubscriptionId: null },
      })
      break
    }
  }

  return Response.json({ received: true })
}
