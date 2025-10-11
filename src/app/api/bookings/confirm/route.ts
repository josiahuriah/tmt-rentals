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

    // Convert Decimal fields to numbers for email
    const bookingForEmail = {
      ...booking,
      pricePerDay: Number(booking.pricePerDay),
      subtotal: Number(booking.subtotal),
      taxAmount: Number(booking.taxAmount),
      totalAmount: Number(booking.totalAmount),
      depositAmount: Number(booking.depositAmount),
      pickupFee: Number(booking.pickupFee),
      additionalDriverFee: Number(booking.additionalDriverFee),
      category: {
        ...booking.category,
        pricePerDay: Number(booking.category.pricePerDay)
      }
    }

    // Send confirmation email
    await sendBookingConfirmationEmail(bookingForEmail)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error confirming booking:", error)
    return NextResponse.json(
      { error: "Failed to confirm booking" },
      { status: 500 }
    )
  }
}