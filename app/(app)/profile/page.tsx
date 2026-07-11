import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ProfileClient } from "./ProfileClient"
import { getInitials } from "@/lib/utils"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const [peopleCount, eventsCount, messagesCount, sub] = await Promise.all([
    prisma.person.count({ where: { userId: session.user.id } }),
    prisma.event.count({ where: { userId: session.user.id } }),
    prisma.message.count({ where: { userId: session.user.id } }),
    prisma.subscription.findUnique({ where: { userId: session.user.id } }),
  ])

  return (
    <ProfileClient
      user={{
        name: session.user.name || "User",
        email: session.user.email || "",
        initial: getInitials(session.user.name || session.user.email || "U"),
      }}
      stats={{ people: peopleCount, events: eventsCount, messages: messagesCount }}
      plan={sub?.plan || "free"}
    />
  )
}
