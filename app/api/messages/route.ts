import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { personId, eventId, tone, content, channel, scheduledAt, whatsappPhone } = body

  if (!personId || !tone || !content) {
    return Response.json({ error: "personId, tone, and content are required" }, { status: 400 })
  }

  const person = await prisma.person.findFirst({
    where: { id: personId, userId: session.user.id },
  })
  if (!person) return Response.json({ error: "Person not found" }, { status: 404 })

  const isScheduled = !!(scheduledAt)
  const resolvedPhone = whatsappPhone || person.whatsappPhone || null

  const message = await prisma.message.create({
    data: {
      userId: session.user.id,
      personId,
      eventId: eventId || null,
      tone,
      content,
      channel: channel || "manual",
      scheduled: isScheduled,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      sent: false,
      whatsappPhone: resolvedPhone,
    },
  })

  // If phone is new, store it on the person for next time
  if (whatsappPhone && whatsappPhone !== person.whatsappPhone) {
    await prisma.person.update({
      where: { id: personId },
      data: { whatsappPhone },
    })
  }

  return Response.json(message, { status: 201 })
}
