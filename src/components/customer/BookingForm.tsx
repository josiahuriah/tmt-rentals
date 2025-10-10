"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { differenceInDays } from "date-fns"
import { formatCurrency } from "@/lib/formatters"

const bookingSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  homePhone: z.string().optional(),
  additionalDriver: z.string().optional(),
  specialRequests: z.string().optional()
})

type BookingFormData = z.infer<typeof bookingSchema>

interface BookingFormProps {
  category: {
    id: string
    name: string
    pricePerDay: number
  }
}

export function BookingForm({ category }: BookingFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema)
  })

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Get rental dates from sessionStorage
      const rentalDatesStr = sessionStorage.getItem('rentalDates')
      if (!rentalDatesStr) {
        setError("Please select your rental dates first")
        router.push('/rental')
        return
      }

      const rentalDates = JSON.parse(rentalDatesStr)
      const pickupDate = new Date(rentalDates.pickupDate)
      const returnDate = new Date(rentalDates.returnDate)
      const numberOfDays = differenceInDays(returnDate, pickupDate)

      // Calculate pricing
      const pricePerDay = Number(category.pricePerDay)
      const subtotal = pricePerDay * numberOfDays
      const taxAmount = subtotal * 0.10 // 10% tax
      const depositAmount = 100
      const totalAmount = subtotal + taxAmount

      // Create booking
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: category.id,
          pickupDate: pickupDate.toISOString(),
          returnDate: returnDate.toISOString(),
          numberOfDays,
          pricePerDay,
          subtotal,
          taxAmount,
          totalAmount,
          depositAmount,
          ...data
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create booking')
      }

      const { bookingId } = await response.json()
      
      // Redirect to terms page
      router.push(`/rental/terms/${bookingId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personal Information</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              {...register("firstName")}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              {...register("lastName")}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="john.doe@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Mobile Phone *</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="242-555-1234"
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="homePhone">Home Phone (Optional)</Label>
            <Input
              id="homePhone"
              {...register("homePhone")}
              placeholder="242-555-5678"
            />
          </div>
        </div>
      </div>

      {/* Additional Driver */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Additional Driver (Optional)</h3>
        <p className="text-sm text-muted-foreground">
          Add an additional driver at no extra charge
        </p>
        
        <div className="space-y-2">
          <Label htmlFor="additionalDriver">Additional Driver Name & Age</Label>
          <Input
            id="additionalDriver"
            {...register("additionalDriver")}
            placeholder="Jane Doe, 28"
          />
        </div>
      </div>

      {/* Special Requests */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Special Requests (Optional)</h3>
        
        <div className="space-y-2">
          <Label htmlFor="specialRequests">Any special requirements?</Label>
          <Textarea
            id="specialRequests"
            {...register("specialRequests")}
            placeholder="Child seat, GPS, etc."
            rows={4}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black hover:bg-black/90 text-brand-gold-500 font-semibold h-12 text-base"
        >
          {isSubmitting ? "Processing..." : "Continue to Terms & Conditions"}
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-3">
          By continuing, you agree to review our terms and conditions
        </p>
      </div>
    </form>
  )
}