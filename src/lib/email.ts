import { NextRequest, NextResponse } from "next/server"
import ContactMessageEmail from '@/email/ContactMessage'
import db from "@/db/db"

// Lazy instantiation with dynamic import - only create Resend client when needed
async function getResendClient() {
  const { Resend } = await import('resend')
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set')
  }
  return new Resend(apiKey)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Save to database
    await db.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        message: `Subject: ${subject}\n\n${message}`,
        status: "UNREAD"
      }
    })

    // Send email to owner
    const resend = await getResendClient()
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: process.env.CONTACT_EMAIL || 'info@tmtsbahamas.com',
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      react: ContactMessageEmail({ name, email, phone, subject, message }),
    })

    if (error) {
      console.error('Error sending email:', error)
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      )
    }

    console.log('Contact email sent successfully:', data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json(
      { error: "Failed to process contact form" },
      { status: 500 }
    )
  }
}