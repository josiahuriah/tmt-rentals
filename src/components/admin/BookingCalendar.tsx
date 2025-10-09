"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { format, isSameDay } from "date-fns"
import Link from "next/link"
import { Card } from "@/components/ui/card"

type Booking = {
  id: string
  bookingNumber: string
  pickupDate: Date
  returnDate: Date
  status: string
  customer: {
    firstName: string
    lastName: string
  }
  category: {
    name: string
  }
  car: {
    name: string
  } | null
}

export function BookingCalendar({ bookings }: { bookings: Booking[] }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Get bookings for selected date
  const bookingsForDate = bookings.filter(booking => {
    if (!selectedDate) return false
    return isSameDay(new Date(booking.pickupDate), selectedDate) ||
           isSameDay(new Date(booking.returnDate), selectedDate)
  })

  // Get dates with bookings for highlighting
  const datesWithBookings = bookings.map(b => new Date(b.pickupDate))

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Calendar */}
      <div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiers={{
            booked: datesWithBookings
          }}
          modifiersStyles={{
            booked: {
              fontWeight: 'bold',
              textDecoration: 'underline'
            }
          }}
          className="rounded-md border"
        />
      </div>

      {/* Bookings for selected date */}
      <div className="space-y-4">
        <h3 className="font-semibold">
          {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
        </h3>
        
        {bookingsForDate.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No bookings for this date
          </p>
        ) : (
          <div className="space-y-3">
            {bookingsForDate.map(booking => (
              <Link key={booking.id} href={`/admin/bookings/${booking.id}`}>
                <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {booking.customer.firstName} {booking.customer.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.bookingNumber}
                      </p>
                      <p className="text-sm">
                        {booking.car?.name || booking.category.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(booking.pickupDate), "MMM d")} - {format(new Date(booking.returnDate), "MMM d")}
                      </p>
                    </div>
                    <Badge variant={
                      booking.status === "CONFIRMED" ? "default" :
                      booking.status === "ACTIVE" ? "secondary" :
                      booking.status === "PENDING" ? "outline" : "destructive"
                    }>
                      {booking.status}
                    </Badge>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}