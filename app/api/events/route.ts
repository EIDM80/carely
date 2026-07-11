import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const events = await prisma.event.findMany({
    where: { userId: session.user.id },
    include: { person: true },
    orderBy: { date: "asc" },
  })

  return Response.json(events)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { personId, type, date, repeat, reminder, notes } = body

  if (!personId || !type || !date) {
    return Response.json({ error: "personId, type, and date are required" }, { status: 400 })
  }

  const person = await prisma.person.findFirst({
    where: { id: personId, userId: session.user.id },
  })
  if (!person) return Response.json({ error: "Person not found" }, { status: 404 })

  const event = await prisma.event.create({
    data: {
      userId: session.user.id,
      personId,
      type,
      date: new Date(date),
      repeat: repeat ?? false,
      reminder: reminder || "3_days",
      notes: notes?.trim() || null,
    },
    include: { person: true },
  })

  return Response.json(event, { status: 201 })
}
