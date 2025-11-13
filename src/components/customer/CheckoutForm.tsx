"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { CreditCard, Lock, ShieldCheck } from "lucide-react"
import { formatCurrency } from "@/lib/formatters"

interface CheckoutFormProps {
  booking: {
    id: string
    bookingNumber: string
    totalAmount: number
    customer: {
      firstName: string
      lastName: string
      email: string
    }
  }
}

/**
 * CheckoutForm Component
 * 
 * This component handles the checkout process by redirecting to Fygaro's
 * hosted payment page. No card data is collected or processed on our servers.
 * 
 * PCI Compliance: Card data is handled entirely by Fygaro (PCI Level 1 compliant)
 * 3D Secure: Fygaro handles 3DS authentication for secure transactions
 */
export function CheckoutForm({ booking }: CheckoutFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleProceedToPayment = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      // Call API to create Fygaro payment link
      const response = await fetch('/api/payments/create-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to initialize payment')
      }

      const data = await response.json()

      if (!data.success || !data.paymentUrl) {
        throw new Error('Failed to create payment session')
      }

      // Redirect to Fygaro's hosted payment page
      window.location.href = data.paymentUrl

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment initialization failed')
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Secure Payment Notice */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <ShieldCheck className="h-8 w-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-green-900">
              Secure Payment with Fygaro
            </h3>
            <p className="text-sm text-green-800">
              You'll be redirected to our secure payment partner, Fygaro, to complete
              your payment.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-4 border-b">
          <CreditCard className="h-5 w-5 text-brand-red-600" />
          <span className="font-semibold">Payment Information</span>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Booking Number:</span>
            <span className="font-semibold">{booking.bookingNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Customer:</span>
            <span className="font-semibold">
              {booking.customer.firstName} {booking.customer.lastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-semibold">{booking.customer.email}</span>
          </div>
          <div className="flex justify-between items-baseline pt-3 border-t">
            <span className="text-lg font-semibold">Total Amount:</span>
            <span className="text-2xl font-bold text-brand-red-600">
              {formatCurrency(booking.totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        

        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <ShieldCheck className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-gray-900">
              3D Secure Authentication
            </p>
            <p className="text-xs text-gray-600">
              Additional verification for your protection
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods Accepted */}
      <div className="text-center py-4 border-t border-b">
        <p className="text-sm text-muted-foreground mb-3">We accept:</p>
        <div className="flex justify-center items-center gap-4">
          <div className="text-2xl">💳</div>
          <span className="text-sm font-medium">Visa</span>
          <span className="text-sm font-medium">Mastercard</span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <Button
          onClick={handleProceedToPayment}
          disabled={isProcessing}
          className="w-full bg-brand-red-500 hover:bg-brand-red-600 text-white font-semibold h-14 text-lg"
        >
          {isProcessing ? (
            <>
              <span className="animate-pulse">Redirecting to Secure Payment...</span>
            </>
          ) : (
            <>
              <Lock className="mr-2 h-5 w-5" />
              Proceed to Secure Payment
            </>
          )}
        </Button>
      </div>

      {/* Additional Information */}
      <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
        <p className="font-semibold mb-2">What happens next?</p>
        <ul className="space-y-1 text-xs">
          <li>• You'll be redirected to Fygaro's payment page</li>
          <li>• Enter your payment details on their secure platform</li>
          <li>• Return to our site for your booking confirmation</li>
        </ul>
      </div>
    </div>
  )
}