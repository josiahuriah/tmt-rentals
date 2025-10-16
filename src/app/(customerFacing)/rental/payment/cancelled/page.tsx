// src/app/(customerFacing)/rental/payment/cancelled/page.tsx
import { Suspense } from "react"
import PaymentCancelledContent from "./PaymentCancelledContent"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

/**
 * Payment Cancelled Page
 * 
 * Displayed when user cancels payment on Fygaro's hosted page
 */
export default function PaymentCancelledPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentCancelledContent />
    </Suspense>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-2">
          <CardContent className="p-12 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full">
              <Loader2 className="w-10 h-10 text-gray-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold">Loading...</h1>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}