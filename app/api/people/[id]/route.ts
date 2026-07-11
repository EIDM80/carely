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
  const person = await prisma.person.findFirst({
    where: { id, userId: session.user.id },
    include: {
      events: { orderBy: { date: "asc" } },
      messages: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  })

  if (!person) return Response.json({ error: "Not found" }, { status: 404 })
  return Response.json(person)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { name, relation, notes, color, whatsappPhone } = body

  const person = await prisma.person.updateMany({
    where: { id, userId: session.user.id },
    data: {
      name: name?.trim(),
      relation,
      notes: notes?.trim() || null,
      color,
      whatsappPhone: whatsappPhone?.trim() || null,
    },
  })

  if (person.count === 0) return Response.json({ error: "Not found" }, { status: 404 })
  return Response.json({ success: true })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await prisma.person.deleteMany({ where: { id, userId: session.user.id } })
  return Response.json({ success: true })
}
