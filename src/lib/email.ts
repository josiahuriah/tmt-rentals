import { Resend } from 'resend'
import BookingConfirmationEmail from '@/email/BookingConfirmation'

const resend = new Resend(process.env.RESEND_API_KEY)

type BookingData = {
  bookingNumber: string
  pickupDate: Date
  returnDate: Date
  numberOfDays: number
  pricePerDay: number
  subtotal: number
  taxAmount: number
  totalAmount: number
  depositAmount: number
  pickupFee?: number
  additionalDriverFee?: number
  pickupLocation: string
  returnLocation: string
  additionalDriver?: string | null
  specialRequests?: string | null
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  category: {
    name: string
    description: string | null
    pricePerDay?: number
  }
  car?: {
    name: string
    licensePlate: string | null
  } | null
}

export async function sendBookingConfirmationEmail(booking: BookingData) {
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