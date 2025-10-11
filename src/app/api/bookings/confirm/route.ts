import { NextRequest, NextResponse } from "next/server"
import db from "@/db/db"
import { Decimal } from "@prisma/client/runtime/library"
import { sendBookingConfirmationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, paymentMethod, amount, transactionId } = body

    // Update booking status
    const booking = await db.booking.update({
      where: { id: bookingId },
      data: {
        status: "CONFIRMED",
        paymentStatus: "PAID"
      },
      include: {
        customer: true,
        category: true,
        car: true
      }
    })

    // Create payment record
    await db.payment.create({
      data: {
        bookingId: booking.id,
        amount: new Decimal(amount.toString()),
        paymentMethod,
        paymentStatus: "COMPLETED",
        transactionId,
        paymentDate: new Date()
      }
    })

    // Send confirmation email
    await sendBookingConfirmationEmail(booking)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error confirming booking:", error)
    return NextResponse.json(
      { error: "Failed to confirm booking" },
      { status: 500 }
    )
  }
}