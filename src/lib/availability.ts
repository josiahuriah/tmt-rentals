import db from '@/db/db'
import { addDays } from 'date-fns'

export async function checkCategoryAvailability(
  categoryId: string,
  pickupDate: Date,
  returnDate: Date
): Promise<{ available: boolean; availableCarCount: number }> {
  // Get all cars in this category
  const carsInCategory = await db.car.findMany({
    where: {
      categoryId,
      status: 'AVAILABLE'
    },
    include: {
      bookings: {
        where: {
          status: { in: ['CONFIRMED', 'ACTIVE'] },
          OR: [
            {
              AND: [
                { pickupDate: { lte: returnDate } },
                { returnDate: { gte: pickupDate } }
              ]
            }
          ]
        }
      },
      unavailabilityPeriods: {
        where: {
          AND: [
            { startDate: { lte: returnDate } },
            { endDate: { gte: pickupDate } }
          ]
        }
      }
    }
  })

  // Count cars that are available (not booked and not in unavailability period)
  const availableCars = carsInCategory.filter(car => 
    car.bookings.length === 0 && car.unavailabilityPeriods.length === 0
  )

  return {
    available: availableCars.length > 0,
    availableCarCount: availableCars.length
  }
}

export async function getAvailableDatesForCategory(
  categoryId: string,
  startDate: Date,
  endDate: Date
): Promise<Date[]> {
  // Returns array of dates that have at least one available car
  const availableDates: Date[] = []
  let currentDate = startDate

  while (currentDate <= endDate) {
    const { available } = await checkCategoryAvailability(
      categoryId,
      currentDate,
      addDays(currentDate, 1)
    )
    
    if (available) {
      availableDates.push(new Date(currentDate))
    }
    
    currentDate = addDays(currentDate, 1)
  }

  return availableDates
}

export async function assignCarToBooking(bookingId: string): Promise<string | null> {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: { category: true }
  })

  if (!booking) return null

  // Find available car in the category
  const availableCar = await db.car.findFirst({
    where: {
      categoryId: booking.categoryId,
      status: 'AVAILABLE',
      bookings: {
        none: {
          status: { in: ['CONFIRMED', 'ACTIVE'] },
          OR: [
            {
              AND: [
                { pickupDate: { lte: booking.returnDate } },
                { returnDate: { gte: booking.pickupDate } }
              ]
            }
          ]
        }
      },
      unavailabilityPeriods: {
        none: {
          AND: [
            { startDate: { lte: booking.returnDate } },
            { endDate: { gte: booking.pickupDate } }
          ]
        }
      }
    }
  })

  if (availableCar) {
    await db.booking.update({
      where: { id: bookingId },
      data: { carId: availableCar.id }
    })
    return availableCar.id
  }

  return null
}

// Generate unique booking number
export function generateBookingNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `BK-${year}${month}${day}-${random}`
}