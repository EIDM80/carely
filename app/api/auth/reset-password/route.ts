import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  const { token, password } = await req.json()

  if (!token || !password) {
    return Response.json({ error: "Token and password are required" }, { status: 400 })
  }

  if (password.length < 8) {
    return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 })
  }

  const record = await prisma.verificationToken.findUnique({ where: { token } })

  if (!record || record.expires < new Date()) {
    return Response.json({ error: "Reset link has expired. Please request a new one." }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email: record.identifier } })
  if (!user) return Response.json({ error: "User not found" }, { status: 404 })

  const hashed = await bcrypt.hash(password, 12)

  await prisma.user.update({ where: { id: user.id }, data: { hashedPassword: hashed } })
  await prisma.verificationToken.delete({ where: { token } })

  return Response.json({ ok: true })
}
