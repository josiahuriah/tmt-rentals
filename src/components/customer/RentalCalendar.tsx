"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { addDays, differenceInDays, isBefore, startOfDay } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as CalendarIcon, Info } from "lucide-react"

export function RentalCalendar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const today = startOfDay(new Date())
  
  const [dateRange, setDateRange] = useState<{
    from: Date
    to?: Date
  }>({
    from: today,
    to: addDays(today, 3)
  })

  // Load saved dates from sessionStorage on mount
  useEffect(() => {
    const savedDates = sessionStorage.getItem('rentalDates')
    if (savedDates) {
      const { pickupDate, returnDate } = JSON.parse(savedDates)
      setDateRange({
        from: new Date(pickupDate),
        to: new Date(returnDate)
      })
    }
  }, [])

  const handleDateSelect = (range: { from: Date; to?: Date } | undefined) => {
    if (!range?.from) return

    let fromDate = range.from
    let toDate = range.to

    // Ensure pickup date is not in the past
    if (isBefore(fromDate, today)) {
      fromDate = today
    }

    // Ensure return date is after pickup date
    if (toDate && isBefore(toDate, fromDate)) {
      toDate = addDays(fromDate, 1)
    }

    // If only from date is selected, auto-set to date to 3 days later
    if (!toDate) {
      toDate = addDays(fromDate, 3)
    }

    const updatedRange = { from: fromDate, to: toDate }
    setDateRange(updatedRange)
  }

  const handleContinue = () => {
    if (dateRange.from && dateRange.to) {
      // Store dates in sessionStorage
      sessionStorage.setItem('rentalDates', JSON.stringify({
        pickupDate: dateRange.from.toISOString(),
        returnDate: dateRange.to.toISOString()
      }))
      
      // Scroll to vehicle selection
      const element = document.getElementById('vehicle-selection')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  const numberOfDays = dateRange.from && dateRange.to
    ? differenceInDays(dateRange.to, dateRange.from)
    : 0

  const isValidSelection = numberOfDays >= 1 && numberOfDays <= 30

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Select Your Rental Period
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calendar */}
        <div className="flex justify-center">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            disabled={{ before: today }}
            className="rounded-md"
          />
        </div>

        {/* Selection Summary */}
        {dateRange.from && dateRange.to && (
          <div className="space-y-4">
            {!isValidSelection && (
              <div className="flex items-start gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold">Invalid rental period</p>
                  <p>Please select between 1 and 30 days</p>
                </div>
              </div>
            )}
            
            <div className="p-6 bg-brand-red-50 rounded-lg text-center space-y-2">
              <p className="text-sm text-muted-foreground">Rental Duration</p>
              <p className="text-3xl font-bold text-brand-red-600">
                {numberOfDays} {numberOfDays === 1 ? 'Day' : 'Days'}
              </p>
              <div className="pt-2 border-t border-brand-red-200 mt-3">
                <p className="text-sm font-medium">
                  {dateRange.from.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-xs text-muted-foreground">to</p>
                <p className="text-sm font-medium">
                  {dateRange.to.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <Button 
              onClick={handleContinue}
              disabled={!isValidSelection}
              className="w-full bg-brand-red-500 hover:bg-brand-red-600 text-black font-semibold h-12"
              size="lg"
            >
              Continue to Vehicle Selection
            </Button>
          </div>
        )}

        {/* Rental Information */}
        <div className="pt-4 border-t space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>Minimum rental: 1 day | Maximum rental: 30 days</span>
          </p>
          <p className="text-xs">
            * Prices shown are per day and do not include taxes and fees
          </p>
        </div>
      </CardContent>
      
      {/* Anchor for smooth scroll */}
      <div id="vehicle-selection" className="h-0" />
    </Card>
  )
}