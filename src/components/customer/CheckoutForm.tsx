"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Lock } from "lucide-react"
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

export function CheckoutForm({ booking }: CheckoutFormProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Payment form state - ready for 3DS integration
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
    billingZip: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Format card number with spaces
    if (name === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
      setPaymentData(prev => ({ ...prev, [name]: formatted }))
      return
    }
    
    // Format expiry date as MM/YY
    if (name === "expiryDate") {
      let formatted = value.replace(/\D/g, "")
      if (formatted.length >= 2) {
        formatted = formatted.slice(0, 2) + "/" + formatted.slice(2, 4)
      }
      setPaymentData(prev => ({ ...prev, [name]: formatted }))
      return
    }
    
    setPaymentData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setError(null)

    try {
      // Validate payment data
      if (!paymentData.cardNumber || !paymentData.cardholderName || 
          !paymentData.expiryDate || !paymentData.cvv) {
        throw new Error("Please fill in all payment fields")
      }

      /**
       * PAYMENT PROCESSOR INTEGRATION POINT
       * 
       * When integrating a 3DS-compliant payment processor:
       * 1. Replace this section with your payment processor's SDK initialization
       * 2. Create a payment intent/session with the processor
       * 3. Handle 3DS authentication flow (redirect or iframe)
       * 4. Process the payment through the processor's API
       * 5. Handle success/failure responses
       * 
       * Example structure for Stripe 3DS:
       * 
       * const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)
       * const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
       *   clientSecret,
       *   {
       *     payment_method: {
       *       card: cardElement,
       *       billing_details: { name: paymentData.cardholderName }
       *     }
       *   }
       * )
       * 
       * if (stripeError) throw new Error(stripeError.message)
       * if (paymentIntent.status !== 'succeeded') throw new Error('Payment failed')
       */

      // Simulated payment processing (DEVELOPMENT ONLY)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Confirm booking and process payment
      const response = await fetch('/api/bookings/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          paymentMethod: 'CREDIT_CARD',
          amount: booking.totalAmount,
          // In production, send payment processor's transaction ID
          transactionId: `sim_${Date.now()}`, 
          // Payment data would be processed by payment processor, not sent to backend
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Payment failed')
      }

      const { success } = await response.json()

      if (success) {
        // Clear rental dates from session
        sessionStorage.removeItem('rentalDates')
        
        // Redirect to confirmation page
        router.push(`/rental/confirmation/${booking.id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed')
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Development Notice */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">Development Mode</p>
        <p>This is a simulated payment form. All submissions will be approved.</p>
      </div>

      {/* Payment Method Header */}
      <div className="flex items-center gap-2 pb-4 border-b">
        <CreditCard className="h-5 w-5 text-brand-gold-600" />
        <span className="font-semibold">Credit / Debit Card</span>
      </div>

      {/* Card Number */}
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <div className="relative">
          <Input
            id="cardNumber"
            name="cardNumber"
            value={paymentData.cardNumber}
            onChange={handleInputChange}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            required
            className="pr-12"
          />
          <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Cardholder Name */}
      <div className="space-y-2">
        <Label htmlFor="cardholderName">Cardholder Name</Label>
        <Input
          id="cardholderName"
          name="cardholderName"
          value={paymentData.cardholderName}
          onChange={handleInputChange}
          placeholder="John Doe"
          required
        />
      </div>

      {/* Expiry and CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input
            id="expiryDate"
            name="expiryDate"
            value={paymentData.expiryDate}
            onChange={handleInputChange}
            placeholder="MM/YY"
            maxLength={5}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            name="cvv"
            type="password"
            value={paymentData.cvv}
            onChange={handleInputChange}
            placeholder="123"
            maxLength={4}
            required
          />
        </div>
      </div>

      {/* Billing Zip */}
      <div className="space-y-2">
        <Label htmlFor="billingZip">Billing ZIP Code</Label>
        <Input
          id="billingZip"
          name="billingZip"
          value={paymentData.billingZip}
          onChange={handleInputChange}
          placeholder="12345"
          maxLength={10}
          required
        />
      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
        <Lock className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-1">Your payment is secure</p>
          <p className="text-xs">
            We use industry-standard encryption to protect your payment information. 
            Your card details are never stored on our servers.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t">
        <Button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-black hover:bg-black/90 text-brand-gold-500 font-semibold h-14 text-lg"
        >
          {isProcessing ? (
            <>
              <span className="animate-pulse">Processing Payment...</span>
            </>
          ) : (
            <>
              Pay {formatCurrency(Number(booking.totalAmount))}
            </>
          )}
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-3">
          By completing this payment, you agree to the rental terms and conditions
        </p>
      </div>
    </form>
  )
}