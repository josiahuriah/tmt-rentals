"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, CheckCircle } from "lucide-react"

/**
 * Payment Success Content Component
 * 
 * This component verifies the payment status and redirects to the confirmation page.
 */
export default function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('Verifying your payment...')

  useEffect(() => {
    const verifyPayment = async () => {
      const bookingId = searchParams?.get('booking_id')
      
      if (!bookingId) {
        setStatus('error')
        setMessage('Invalid payment reference')
        return
      }

      try {
        // Wait a moment to ensure webhook has been processed
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Verify booking was updated by webhook
        const response = await fetch(`/api/bookings/${bookingId}/status`)
        
        if (!response.ok) {
          throw new Error('Failed to verify payment')
        }

        const { paymentStatus } = await response.json()

        if (paymentStatus === 'PAID') {
          setStatus('success')
          setMessage('Payment successful! Redirecting...')
          
          // Clear session storage
          sessionStorage.removeItem('currentPaymentId')
          sessionStorage.removeItem('rentalDates')
          
          // Redirect to confirmation page
          setTimeout(() => {
            router.push(`/rental/confirmation/${bookingId}`)
          }, 1500)
        } else {
          // Payment might still be processing
          setMessage('Processing your payment...')
          
          // Retry after a delay
          setTimeout(verifyPayment, 3000)
        }

      } catch (error) {
        console.error('Payment verification error:', error)
        setStatus('error')
        setMessage('Unable to verify payment. Please contact support.')
      }
    }

    verifyPayment()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-lg">
        <Card className="border-2">
          <CardContent className="p-12 text-center space-y-6">
            {status === 'verifying' && (
              <>
                <Loader2 className="w-16 h-16 mx-auto text-brand-red-500 animate-spin" />
                <h1 className="text-2xl font-bold">Processing Payment</h1>
                <p className="text-muted-foreground">{message}</p>
              </>
            )}
            
            {status === 'success' && (
              <>
                <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-green-900">Payment Successful!</h1>
                <p className="text-muted-foreground">{message}</p>
              </>
            )}
            
            {status === 'error' && (
              <>
                <div className="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-4xl text-white">!</span>
                </div>
                <h1 className="text-2xl font-bold text-red-900">Payment Issue</h1>
                <p className="text-muted-foreground">{message}</p>
                <p className="text-sm text-muted-foreground mt-4">
                  Booking Reference: {searchParams?.get('booking_id')?.slice(0, 8)}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}