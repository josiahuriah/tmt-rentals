import { Suspense } from "react"
import PaymentCallbackContent from "./PaymentCallbackContent"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

/**
 * Payment Callback Page
 * 
 * This page handles the return from Fygaro's hosted payment page.
 * It polls the booking status until the webhook confirms payment.
 */
export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentCallbackContent />
    </Suspense>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-2">
          <CardContent className="p-12 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold">Loading...</h1>
            <p className="text-muted-foreground">
              Please wait while we load your payment details
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}