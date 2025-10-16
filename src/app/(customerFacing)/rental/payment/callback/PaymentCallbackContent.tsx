"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

/**
 * Payment Callback Content Component
 * 
 * Separated into its own component to properly handle useSearchParams with Suspense
 */
export default function PaymentCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams?.get("bookingId")
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Processing your payment...")
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!bookingId) {
      setStatus("error")
      setMessage("Invalid booking reference")
      return
    }

    // Poll booking status
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}/status`)
        
        if (!response.ok) {
          throw new Error("Failed to check payment status")
        }

        const data = await response.json()

        if (data.paymentStatus === "PAID" && data.status === "CONFIRMED") {
          // Payment confirmed!
          setStatus("success")
          setMessage("Payment successful! Redirecting to confirmation...")
          
          // Clear rental dates from session
          sessionStorage.removeItem("rentalDates")
          
          // Redirect to confirmation page
          setTimeout(() => {
            router.push(`/rental/confirmation/${bookingId}`)
          }, 2000)
        } else if (data.paymentStatus === "FAILED") {
          // Payment failed
          setStatus("error")
          setMessage("Payment was not successful. Please try again.")
        } else {
          // Still processing, retry
          if (retryCount < 30) { // Maximum 30 attempts (30 seconds)
            setTimeout(() => {
              setRetryCount(prev => prev + 1)
            }, 1000)
          } else {
            // Timeout - payment may still be processing
            setStatus("error")
            setMessage("Payment is taking longer than expected. Please check your email for confirmation or contact us.")
          }
        }
      } catch (error) {
        console.error("Error checking payment status:", error)
        if (retryCount < 30) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1)
          }, 1000)
        } else {
          setStatus("error")
          setMessage("Unable to verify payment status. Please contact us.")
        }
      }
    }

    checkPaymentStatus()
  }, [bookingId, retryCount, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-2">
          <CardContent className="p-12 text-center space-y-6">
            {status === "loading" && (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
                <h1 className="text-2xl font-bold">Processing Payment</h1>
                <p className="text-muted-foreground">
                  {message}
                </p>
                <p className="text-sm text-muted-foreground">
                  Please don't close this window...
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-green-900">Payment Successful!</h1>
                <p className="text-muted-foreground">
                  {message}
                </p>
              </>
            )}

            {status === "error" && (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-red-900">Payment Issue</h1>
                <p className="text-muted-foreground">
                  {message}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button asChild variant="outline">
                    <Link href="/rental">Back to Rentals</Link>
                  </Button>
                  <Button asChild className="bg-brand-red-500 hover:bg-brand-red-600">
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {status === "loading" && (
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Verifying payment with secure payment processor...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}