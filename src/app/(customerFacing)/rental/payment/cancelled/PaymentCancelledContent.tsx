"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

/**
 * Payment Cancelled Content Component
 * 
 * Separated into its own component to properly handle useSearchParams with Suspense
 */
export default function PaymentCancelledContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams?.get("bookingId")

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-2 border-yellow-200">
          <CardContent className="p-12 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full">
              <XCircle className="w-10 h-10 text-yellow-600" />
            </div>
            
            <h1 className="text-2xl font-bold">Payment Cancelled</h1>
            
            <p className="text-muted-foreground">
              You cancelled the payment process. Your booking has not been confirmed.
            </p>

            {bookingId && (
              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                <p className="font-semibold mb-1">Want to complete your booking?</p>
                <p>You can return to the checkout page to try again.</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {bookingId && (
                <Button 
                  asChild 
                  className="bg-brand-red-500 hover:bg-brand-red-600 text-white"
                >
                  <Link href={`/rental/checkout/${bookingId}`}>
                    Complete Booking
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline">
                <Link href="/rental">Browse Vehicles</Link>
              </Button>
            </div>

            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                Need help?
              </p>
              <Button asChild variant="link">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}