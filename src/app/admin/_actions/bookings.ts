"use server"

import db from "@/db/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Decimal } from "@prisma/client/runtime/library"

export async function updateBookingStatus(
  bookingId: string,
  status: string
) {
  await db.booking.update({
    where: { id: bookingId },
    data: { status }
  })

  revalidatePath("/admin/bookings")
  revalidatePath(`/admin/bookings/${bookingId}`)
}

export async function cancelBooking(
  bookingId: string,
  reason?: string
) {
  await db.booking.update({
    where: { id: bookingId },
    data: {
      status: "CANCELLED",
      cancellationReason: reason,
      cancelledAt: new Date()
    }
  })

  // If car was assigned, make it available again
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: { carId: true }
  })

  if (booking?.carId) {
    await db.car.update({
      where: { id: booking.carId },
      data: { status: "AVAILABLE" }
    })
  }

  revalidatePath("/admin/bookings")
  revalidatePath(`/admin/bookings/${bookingId}`)
}

export async function assignCarToBooking(
  bookingId: string,
  carId: string
) {
  // Check if car is available
  const car = await db.car.findUnique({
    where: { id: carId },
    select: { status: true }
  })

  if (car?.status !== "AVAILABLE") {
    throw new Error("Car is not available")
  }

  await db.booking.update({
    where: { id: bookingId },
    data: { carId }
  })

  await db.car.update({
    where: { id: carId },
    data: { status: "RENTED" }
  })

  revalidatePath("/admin/bookings")
  revalidatePath(`/admin/bookings/${bookingId}`)
}

export async function updateBookingDates(
  bookingId: string,
  pickupDate: Date,
  returnDate: Date
) {
  const diffTime = Math.abs(returnDate.getTime() - pickupDate.getTime())
  const numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: { pricePerDay: true, pickupFee: true, taxAmount: true }
  })

  if (!booking) throw new Error("Booking not found")

  const subtotal = new Decimal(booking.pricePerDay).times(numberOfDays)
  const totalAmount = subtotal
    .plus(booking.pickupFee)
    .plus(booking.taxAmount)

  await db.booking.update({
    where: { id: bookingId },
    data: {
      pickupDate,
      returnDate,
      numberOfDays,
      subtotal,
      totalAmount
    }
  })

  revalidatePath("/admin/bookings")
  revalidatePath(`/admin/bookings/${bookingId}`)
}