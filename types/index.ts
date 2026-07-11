export interface Person {
  id: string
  userId: string
  name: string
  relation: string
  notes?: string | null
  color: string
  photoUrl?: string | null
  createdAt: Date
  updatedAt: Date
  events?: Event[]
  messages?: Message[]
}

export interface Event {
  id: string
  userId: string
  personId: string
  type: string
  date: Date
  repeat: boolean
  reminder: string
  notes?: string | null
  createdAt: Date
  updatedAt: Date
  person?: Person
}

export interface Message {
  id: string
  userId: string
  personId: string
  eventId?: string | null
  tone: string
  content: string
  scheduled: boolean
  scheduledAt?: Date | null
  sent: boolean
  createdAt: Date
  updatedAt: Date
  person?: Person
  event?: Event
}

export interface Subscription {
  id: string
  userId: string
  plan: "free" | "premium" | "family"
  stripeCustomerId?: string | null
  stripePriceId?: string | null
  stripeSubscriptionId?: string | null
  status: string
  currentPeriodEnd?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
}
