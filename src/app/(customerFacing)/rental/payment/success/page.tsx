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
    <div