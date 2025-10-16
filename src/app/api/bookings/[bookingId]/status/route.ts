// src/app/api/bookings/[bookingId]/status/route.ts
import { NextRequest, NextResponse } from "next/server"
import db from "@/db/db"

/**
 * GET /api/bookings/[bookingId]/status
 * 
 * Returns the current payment and booking status.
 * Used by the payment callback page to poll for payment confirmation.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await context.params

    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        bookingNumber: true,
        status: true,
        paymentStatus: true,
        totalAmount: true,
        updatedAt: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      totalAmount: Number(booking.totalAmount),
      lastUpdated: booking.updatedAt
    })

  } catch (error) {
    console.error("Error fetching booking status:", error)
    return NextResponse.json(
      { error: "Failed to fetch booking status" },
      { status: 500 }
    )
  }
}