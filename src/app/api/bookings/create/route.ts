import { NextRequest, NextResponse } from "next/server"
import db from "@/db/db"
import { generateBookingNumber } from "@/lib/availability"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      categoryId,
      firstName,
      lastName,
      email,
      phone,
      homePhone,
      additionalDriver,
      specialRequests,
      pickupDate,
      returnDate,
      numberOfDays,
      pricePerDay,
      subtotal,
      taxAmount,
      totalAmount,
      depositAmount
    } = body

    // Validate required fields
    if (!categoryId || !firstName || !lastName || !email || !phone || 
        !pickupDate || !returnDate || !numberOfDays) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if category exists and is active
    const category = await db.carCategory.findUnique({
      where: { id: categoryId, isActive: true }
    })

    if (!category) {
      return NextResponse.json(
        { error: "Invalid vehicle category" },
        { status: 400 }
      )
    }

    // Create or find customer
    const customer = await db.customer.upsert({
      where: { email },
      update: {
        firstName,
        lastName,
        phone,
        homePhone: homePhone || null
      },
      create: {
        firstName,
        lastName,
        email,
        phone,
        homePhone: homePhone || null,
        country: "Bahamas"
      }
    })

    // Generate unique booking number
    const bookingNumber = generateBookingNumber()

    // Create booking
    const booking = await db.booking.create({
      data: {
        bookingNumber,
        customerId: customer.id,
        categoryId,
        pickupDate: new Date(pickupDate),
        returnDate: new Date(returnDate),
        numberOfDays,
        pricePerDay,
        subtotal,
        taxAmount,
        totalAmount,
        depositAmount,
        additionalDriver: additionalDriver || null,
        specialRequests: specialRequests || null,
        status: "PENDING",
        paymentStatus: "UNPAID"
      }
    })

    return NextResponse.json({ 
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber
    })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
}