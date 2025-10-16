import { NextRequest, NextResponse } from "next/server"
import db from "@/db/db"
import { FygaroWebhookValidator } from "@fygaro/webhook"

/**
 * Fygaro Webhook Handler
 * 
 * This endpoint receives payment notifications from Fygaro when payments are completed.
 * It verifies the webhook signature for security and updates booking status.
 * 
 * IMPORTANT: This webhook URL must be configured in your Fygaro Payment Button settings:
 * - Webhook URL: https://yourdomain.com/api/webhooks/fygaro
 * - Use the same FYGARO_WEBHOOK_SECRET in both your .env and Fygaro dashboard
 */

// Fygaro webhook payload types based on their documentation
interface FygaroWebhookPayload {
  transactionId: string
  reference: string // Your booking number
  customReference?: string
  authCode?: string
  currency: string
  amount: string // Dollar amount as string with 2 decimals
  createdAt: string
  card?: {
    last4?: string
    expMonth?: number
    expYear?: number
    brand?: string
  }
  client?: {
    name?: string
    email?: string
    phone?: string
  }
  billing?: {
    country?: { name: string; code: string }
    state?: { name: string }
    city?: { name: string }
    locality?: { name: string }
    address?: string
    postal_code?: string
  }
  gratuity_amount?: string
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text()
    
    // Get Fygaro headers
    const signature = request.headers.get('Fygaro-Signature')
    const keyId = request.headers.get('Fygaro-Key-ID')

    if (!signature || !keyId) {
      console.error('Missing Fygaro webhook headers')
      return NextResponse.json(
        { error: 'Missing webhook signature headers' },
        { status: 400 }
      )
    }

    // Get webhook secret from environment
    const webhookSecret = process.env.FYGARO_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error('FYGARO_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    // Verify webhook signature using official Fygaro package
    const validator = new FygaroWebhookValidator({
        secrets: {
            [keyId]: webhookSecret
    }
    })

    let isValid = false
    try {
        isValid = validator.verify_signature(signature, rawBody)
    } catch (error) {
        console.error('Webhook signature verification failed:', error)
        return NextResponse.json(
            { error: 'Invalid webhook signature' },
            { status: 401 }
    )
    }

    if (!isValid) {
      console.error('Webhook signature validation failed')
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      )
    }

    // Parse the verified payload
    const payload: FygaroWebhookPayload = JSON.parse(rawBody)

    console.log('Received verified Fygaro webhook:', {
      transactionId: payload.transactionId,
      reference: payload.reference,
      amount: payload.amount,
      currency: payload.currency
    })

    // Find booking by reference (booking number)
    const booking = await db.booking.findFirst({
      where: { bookingNumber: payload.reference },
      include: { customer: true }
    })

    if (!booking) {
      console.error('Booking not found for reference:', payload.reference)
      // Still return 200 to Fygaro to prevent retries
      return NextResponse.json(
        { received: true, warning: 'Booking not found' },
        { status: 200 }
      )
    }

    // Verify amount matches (convert Fygaro's string to number)
    const webhookAmount = parseFloat(payload.amount)
    const bookingAmount = Number(booking.totalAmount)
    
    if (Math.abs(webhookAmount - bookingAmount) > 0.01) {
      console.error('Amount mismatch:', {
        expected: bookingAmount,
        received: webhookAmount,
        booking: booking.bookingNumber
      })
      
      // Log discrepancy but still mark as paid (manual review may be needed)
      await db.booking.update({
        where: { id: booking.id },
        data: {
          internalNotes: `WARNING: Amount mismatch - Expected $${bookingAmount}, Received $${webhookAmount}\n\n${booking.internalNotes || ''}`
        }
      })
    }

    // Update booking status
    await db.booking.update({
      where: { id: booking.id },
      data: {
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        internalNotes: `Payment completed via Fygaro
Transaction ID: ${payload.transactionId}
Auth Code: ${payload.authCode || 'N/A'}
Card: ${payload.card?.brand || 'Unknown'} ending in ${payload.card?.last4 || 'N/A'}
Amount: ${payload.amount} ${payload.currency}
Processed: ${payload.createdAt}

${booking.internalNotes || ''}`
      }
    })

    console.log('Booking updated successfully:', booking.bookingNumber)

    // TODO: Send confirmation email to customer
    // You can trigger email sending here using your email service
    // Example:
    // await sendBookingConfirmationEmail(booking.customer.email, booking)

    // MUST return 200 to Fygaro to mark webhook as successfully processed
    return NextResponse.json(
      { 
        received: true,
        bookingNumber: booking.bookingNumber,
        status: 'confirmed'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error processing Fygaro webhook:', error)
    
    // Return 200 even on errors to prevent Fygaro from retrying
    // Log the error for manual review
    return NextResponse.json(
      { 
        received: true,
        error: 'Internal processing error - logged for review'
      },
      { status: 200 }
    )
  }
}

// Disable body parsing for webhook signature verification
export const dynamic = 'force-dynamic'