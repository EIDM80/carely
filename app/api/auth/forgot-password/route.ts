import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email) return Response.json({ error: "Email is required" }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })

  // Always return 200 — don't reveal whether the email exists
  if (!user || !user.hashedPassword) {
    return Response.json({ ok: true })
  }

  const token = crypto.randomBytes(32).toString("hex")
  const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  await prisma.verificationToken.upsert({
    where: { identifier_token: { identifier: email, token } },
    update: { token, expires },
    create: { identifier: email, token, expires },
  })

  try {
    await sendPasswordResetEmail(email, token)
  } catch (err) {
    console.error("Failed to send reset email:", err)
    return Response.json({ error: "Could not send email. Check RESEND_API_KEY." }, { status: 500 })
  }

  return Response.json({ ok: true })
}
