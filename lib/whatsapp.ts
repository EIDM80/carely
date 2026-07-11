import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER // e.g. +14155238886

export async function sendWhatsApp(to: string, body: string) {
  if (!accountSid || !authToken || !fromNumber) {
    throw new Error("Twilio credentials not configured")
  }

  const client = twilio(accountSid, authToken)

  const normalised = to.startsWith("+") ? to : `+${to}`

  await client.messages.create({
    from: `whatsapp:${fromNumber}`,
    to: `whatsapp:${normalised}`,
    body,
  })
}

export function whatsappDeepLink(phone: string, text: string) {
  const normalised = phone.replace(/\D/g, "")
  return `https://wa.me/${normalised}?text=${encodeURIComponent(text)}`
}
