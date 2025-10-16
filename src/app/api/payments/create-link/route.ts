// src/app/api/payments/create-link/route.ts
import { NextRequest, NextResponse } from "next/server"
import db from "@/db/db"
import { createFygaroPaymentLink, getFygaroWebhookUrl } from "@/lib/fygaro"

/**
 * POST /api/payments/create-link
 * 
 * Creates a Fygaro payment link for a booking.
 * This endpoint is called when the user clicks "Proceed to Payment" on checkout.
 * 
 * The payment link redirects the customer to Fygaro's hosted payment page,
 * ensuring PCI compliance by keeping card data off our servers.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId } = body

    if (!bookingId) {
      return NextResponse.json(
        { error: "Missing booking ID" },
        { status: 400 }
      )
    }

    // Fetch booking details
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        category: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    // Verify booking is in correct state
    if (booking.status !== "PENDING") {
      return NextResponse.json(
        { error: "Booking is not in pending state" },
        { status: 400 }
      )
    }

    // Prepare payment details
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    
    const paymentParams = {
      amount: Number(booking.totalAmount),
      currency: 'BSD', // Bahamian Dollar
      description: `TMT Car Rental - ${booking.category.name} (${booking.numberOfDays} ${booking.numberOfDays === 1 ? 'day' : 'days'})`,
      customerEmail: booking.customer.email,
      customerName: `${booking.customer.firstName} ${booking.customer.lastName}`,
      reference: booking.bookingNumber, // Use booking number as reference
      returnUrl: `${baseUrl}/rental/payment/callback?bookingId=${bookingId}`,
      cancelUrl: `${baseUrl}/rental/payment/cancelled?bookingId=${bookingId}`,
      webhookUrl: getFygaroWebhookUrl() // Optional - can also be set in Fygaro dashboard
    }

    console.log('Creating payment link for booking:', booking.bookingNumber)

    // Create payment link with Fygaro
    const result = await createFygaroPaymentLink(paymentParams)

    if (!result.success || !result.paymentUrl) {
      console.error('Failed to create payment link:', result.error)
      return NextResponse.json(
        { error: result.error || "Failed to create payment link" },
        { status: 500 }
      )
    }

    // Store payment ID with booking for tracking
    await db.booking.update({
      where: { id: bookingId },
      data: {
        internalNotes: `Fygaro Payment ID: ${result.paymentId}\nCreated: ${new Date().toISOString()}\n\n${booking.internalNotes || ''}`
      }
    })

    console.log('Payment link created successfully:', result.paymentId)

    // Return payment URL for redirect
    return NextResponse.json({
      success: true,
      paymentUrl: result.paymentUrl,
      paymentId: result.paymentId
    })

  } catch (error) {
    console.error("Error creating payment link:", error)
    return NextResponse.json(
      { error: "Failed to process payment request" },
      { status: 500 }
    )
  }
}