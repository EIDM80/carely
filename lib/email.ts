import { Resend } from "resend"

const FROM = process.env.EMAIL_FROM || "Carely <noreply@carely.app>"
const APP_URL = process.env.NEXTAUTH_URL || "http://localhost:3000"

export async function sendPasswordResetEmail(email: string, token: string) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const resetUrl = `${APP_URL}/reset-password?token=${token}`

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Reset your Carely password",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#FAFAF7">
        <div style="background:linear-gradient(135deg,#7C5CFF,#9B87FF);border-radius:20px;padding:32px;text-align:center;margin-bottom:32px">
          <h1 style="color:#fff;font-size:28px;font-weight:800;margin:0">Reset your password</h1>
          <p style="color:rgba(255,255,255,.85);margin:12px 0 0">You asked to reset your Carely password.</p>
        </div>
        <p style="color:#374151;font-size:15px;line-height:1.6;margin-bottom:28px">
          Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.
        </p>
        <a href="${resetUrl}" style="display:block;background:#7C5CFF;color:#fff;text-decoration:none;font-weight:700;font-size:16px;padding:16px;border-radius:14px;text-align:center;margin-bottom:24px">
          Reset password
        </a>
        <p style="color:#9CA3AF;font-size:13px;text-align:center">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  })
}
