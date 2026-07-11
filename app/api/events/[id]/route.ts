import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const event = await prisma.event.findFirst({
    where: { id, userId: session.user.id },
    include: { person: true },
  })

  if (!event) return Response.json({ error: "Not found" }, { status: 404 })
  return Response.json(event)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const result = await prisma.event.updateMany({
    where: { id, userId: session.user.id },
    data: {
      type: body.type,
      date: body.date ? new Date(body.date) : undefined,
      repeat: body.repeat,
      reminder: body.reminder,
      notes: body.notes?.trim() || null,
    },
  })

  if (result.count === 0) return Response.json({ error: "Not found" }, { status: 404 })
  return Response.json({ success: true })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await prisma.event.deleteMany({ where: { id, userId: session.user.id } })
  return Response.json({ success: true })
}
