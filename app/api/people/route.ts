import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const people = await prisma.person.findMany({
    where: { userId: session.user.id },
    include: { events: { orderBy: { date: "asc" } } },
    orderBy: { createdAt: "desc" },
  })

  return Response.json(people)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { name, relation, notes, color } = body

  if (!name || !relation) {
    return Response.json({ error: "Name and relation are required" }, { status: 400 })
  }

  const person = await prisma.person.create({
    data: {
      userId: session.user.id,
      name: name.trim(),
      relation,
      notes: notes?.trim() || null,
      color: color || "#EDE8FF",
    },
  })

  return Response.json(person, { status: 201 })
}
