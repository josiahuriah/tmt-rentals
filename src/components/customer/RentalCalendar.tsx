"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { addDays } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

export function RentalCalendar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [dateRange, setDateRange] = useState<{
    from: Date
    to?: Date
  }>({
    from: new Date(),
    to: addDays(new Date(), 3)
  })

  const handleDateSelect = (range: { from: Date; to?: Date } | undefined) => {
    if (range) {
      setDateRange(range)
    }
  }

  const handleContinue = () => {
    if (dateRange.from && dateRange.to) {
      // Store dates in sessionStorage for use across pages
      sessionStorage.setItem('rentalDates', JSON.stringify({
        pickupDate: dateRange.from.toISOString(),
        returnDate: dateRange.to.toISOString()
      }))
      
      // Scroll to vehicle selection
      const element = document.getElementById('vehicle-selection')
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const numberOfDays = dateRange.from && dateRange.to
    ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="space-y-6">
      <Calendar
        mode="range"
        selected={dateRange}
        onSelect={handleDateSelect}
        numberOfMonths={2}
        disabled={{ before: new Date() }}
        className="rounded-md"
      />
      
      {dateRange.from && dateRange.to && (
        <div className="text-center space-y-4">
          <div className="p-4 bg-brand-gold-50 rounded-lg">
            <p className="text-lg font-semibold">
              {numberOfDays} {numberOfDays === 1 ? 'Day' : 'Days'} Selected
            </p>
            <p className="text-sm text-muted-foreground">
              {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
            </p>
          </div>
          <Button 
            onClick={handleContinue}
            className="bg-brand-gold-500 hover:bg-brand-gold-600 text-black font-semibold"
            size="lg"
          >
            Continue to Vehicle Selection
          </Button>
        </div>
      )}
      
      <div id="vehicle-selection" className="h-0" />
    </div>
  )
}