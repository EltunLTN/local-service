// Email OTP verification with Resend
// Tokeni .env faylında RESEND_API_KEY olaraq əlavə edin

interface SendOTPResult {
  success: boolean
  message?: string
  error?: string
}

// Generate 6-digit OTP code
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP email via Resend
export async function sendOTPEmail(email: string, otpCode: string, name?: string): Promise<SendOTPResult> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set in .env")
    return { success: false, error: "Email xidməti konfiqurasiya edilməyib" }
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "UstaBul <onboarding@resend.dev>", // Resend verified domain lazımdır: noreply@ustabul.az
        to: [email],
        subject: "UstaBul - Təsdiq kodu",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #fff; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="background: linear-gradient(135deg, #f97316, #ea580c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px; margin: 0;">
                UstaBul
              </h1>
            </div>
            <h2 style="color: #1f2937; text-align: center; margin-bottom: 8px;">
              Təsdiq kodunuz
            </h2>
            <p style="color: #6b7280; text-align: center; margin-bottom: 24px;">
              ${name ? `Salam ${name},` : "Salam,"}<br/>
              Hesabınızı təsdiqləmək üçün aşağıdakı kodu daxil edin:
            </p>
            <div style="background: #f3f4f6; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1f2937;">
                ${otpCode}
              </span>
            </div>
            <p style="color: #9ca3af; text-align: center; font-size: 14px;">
              Bu kod 10 dəqiqə ərzində etibarlıdır.<br/>
              Əgər bu sorğunu siz göndərməmisinizsə, bu emaili nəzərə almayın.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="color: #9ca3af; text-align: center; font-size: 12px;">
              &copy; ${new Date().getFullYear()} UstaBul. Bütün hüquqlar qorunur.
            </p>
          </div>
        `,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Resend error:", errorData)
      return { success: false, error: "Email göndərilə bilmədi" }
    }

    return { success: true, message: "Təsdiq kodu email ünvanınıza göndərildi" }
  } catch (error) {
    console.error("Email send error:", error)
    return { success: false, error: "Email göndərmə xətası" }
  }
}

// Verify OTP code
export function verifyOTP(storedCode: string | null, storedExpires: Date | null, inputCode: string): { valid: boolean; error?: string } {
  if (!storedCode || !storedExpires) {
    return { valid: false, error: "Təsdiq kodu tapılmadı. Yeni kod tələb edin." }
  }

  if (new Date() > storedExpires) {
    return { valid: false, error: "Təsdiq kodunun müddəti bitib. Yeni kod tələb edin." }
  }

  if (storedCode !== inputCode) {
    return { valid: false, error: "Yanlış təsdiq kodu" }
  }

  return { valid: true }
}
