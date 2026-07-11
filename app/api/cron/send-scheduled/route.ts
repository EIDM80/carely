import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendWhatsApp } from "@/lib/whatsapp"

// Called by Vercel Cron (or any scheduler) — protected by CRON_SECRET
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date()

  const due = await prisma.message.findMany({
    where: {
      scheduled: true,
      sent: false,
      channel: "whatsapp",
      scheduledAt: { lte: now },
      whatsappPhone: { not: null },
    },
  })

  const results: { id: string; status: "sent" | "failed"; error?: string }[] = []

  for (const msg of due) {
    try {
      await sendWhatsApp(msg.whatsappPhone!, msg.content)
      await prisma.message.update({
        where: { id: msg.id },
        data: { sent: true },
      })
      results.push({ id: msg.id, status: "sent" })
    } catch (err) {
      results.push({ id: msg.id, status: "failed", error: String(err) })
    }
  }

  return Response.json({ processed: due.length, results })
}
