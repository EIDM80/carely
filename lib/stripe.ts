import Stripe from "stripe"

export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-05-27.dahlia",
  })
}

export const STRIPE_PRICES = {
  premium: process.env.STRIPE_PRICE_PREMIUM || "",
  family: process.env.STRIPE_PRICE_FAMILY || "",
}
