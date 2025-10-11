import { Resend } from 'resend'
import BookingConfirmationEmail from '@/email/BookingConfirmation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendBookingConfirmationEmail(booking: any) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: booking.customer.email,
      subject: `Booking Confirmed - ${booking.bookingNumber}`,
      react: BookingConfirmationEmail({ booking }),
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, error }
    }

    console.log('Email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending booking confirmation:', error)
    return { success: false, error }
  }
}