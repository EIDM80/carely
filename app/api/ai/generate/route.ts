import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import OpenAI from "openai"

const MOCK_MESSAGES: Record<string, string[]> = {
  Romantic: [
    "Every year with you is a chapter I never want to end. Happy birthday, my love — you make ordinary days feel like celebrations.",
    "Eight years and you still give me butterflies. Happy anniversary, my heart. Here's to forever looking exactly like this.",
  ],
  Friendly: [
    "Happy birthday! You deserve every good thing coming your way today and always. So grateful to have you in my corner.",
    "Another year wiser, another year more wonderful. Wishing you the kind of day that feels like a warm hug from the universe!",
  ],
  Emotional: [
    "I don't say this enough, but you have shaped who I am in ways I'm still discovering. Happy birthday — I'm so glad you exist.",
    "Watching you grow has been one of life's greatest gifts. Today is yours, and I hope it feels as extraordinary as you are.",
  ],
  Formal: [
    "Warmest congratulations on your birthday. Wishing you continued success and happiness in the year ahead.",
    "On this special occasion, please accept my sincere wishes for a wonderful birthday and a prosperous year to come.",
  ],
  Funny: [
    "Happy birthday! Another year older, another year of pretending you don't know how old you are. I respect the commitment.",
    "Congratulations on surviving another trip around the sun! You've unlocked the 'Distinguished' character skin. It suits you.",
  ],
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { personId, type, tone, notes } = body

  if (!personId || !type || !tone) {
    return Response.json({ error: "personId, type, and tone are required" }, { status: 400 })
  }

  const person = await prisma.person.findFirst({
    where: { id: personId, userId: session.user.id },
  })
  if (!person) return Response.json({ error: "Person not found" }, { status: 404 })

  if (process.env.OPENAI_API_KEY) {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      const systemPrompt = `You are Carely, an emotional relationship assistant. Generate a heartfelt, personal message in a ${tone} tone for ${person.name}'s ${type}. ${person.notes ? `Personal notes about them: ${person.notes}.` : ""} ${notes ? `Additional context: ${notes}.` : ""} Make it warm, specific, and genuine. 2-4 sentences. Return only the message text.`

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: systemPrompt }],
        max_tokens: 200,
        temperature: 0.85,
      })

      const message = completion.choices[0]?.message?.content?.trim()
      if (message) return Response.json({ message, person: { name: person.name } })
    } catch {
      // Fall through to mock
    }
  }

  // Mock response when no API key
  const pool = MOCK_MESSAGES[tone] || MOCK_MESSAGES.Friendly
  const message = pool[Math.floor(Math.random() * pool.length)]
    .replace("my love", person.name === "Sarah" ? "my love" : person.name)

  return Response.json({ message, person: { name: person.name } })
}
