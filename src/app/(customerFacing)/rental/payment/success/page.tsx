// src/app/(customerFacing)/rental/payment/success/page.tsx
import { Suspense } from "react"
import PaymentSuccessContent from "./PaymentSuccessContent"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

/**
 * Payment Success Handler
 * 
 * This page is where users land after completing payment on Fygaro's platform.
 * We verify the payment status and redirect to the confirmation page.
 */
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-lg">
        <Card className="border-2">
          <CardContent className="p-12 text-center space-y-6">
            <Loader2 className="w-16 h-16 mx-auto text-brand-red-500 animate-spin" />
            <h1 className="text-2xl font-bold">Processing Payment</h1>
            <p className="text-muted-foreground">Please wait...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}