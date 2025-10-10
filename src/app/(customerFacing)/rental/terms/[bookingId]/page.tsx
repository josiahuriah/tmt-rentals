"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

export default function TermsPage({
  params
}: {
  params: Promise<{ bookingId: string }>
}) {
  const router = useRouter()
  const [bookingId, setBookingId] = useState<string>("")
  const [accepted, setAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    params.then(p => setBookingId(p.bookingId))
  }, [params])

  const handleContinue = () => {
    if (!accepted) return
    setIsSubmitting(true)
    router.push(`/rental/checkout/${bookingId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Terms & Conditions</h1>
          <p className="text-muted-foreground">
            Please review and accept our rental terms before proceeding
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Rental Agreement</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Important Notice */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Important Things To Note</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>A valid driver's license is required at pickup for verification</li>
                    <li>$10 fee for pick-up and drop-off beyond Deadman's Cay</li>
                    <li>$100 security deposit (refundable upon return)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Terms Content */}
            <div className="prose prose-sm max-w-none space-y-6 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
              <section>
                <h3 className="font-semibold text-base mb-2">1. Vehicle Use Restrictions</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The rented vehicle shall not be used to carry passengers or property for hire.
                  The vehicle shall not be used for any illegal purpose. The vehicle shall not be 
                  operated by any person other than the named renter and authorized additional drivers.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">2. Insurance & Liability</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The Renter agrees to be held fully responsible for any and all loss of or damage 
                  to the vehicle or equipment during the rental term, whether caused by collision, 
                  fire, flood, vandalism, theft, or any other cause, except that which shall be 
                  determined to be caused by a fault or defect of the vehicle or equipment.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">3. Security Deposit</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The Renter agrees to make a deposit of $100.00 with the Owner. This deposit will 
                  be used, in the event of loss or damage to the vehicle or equipment during the 
                  rental term, to defray fully or partially the cost of necessary repairs or replacement. 
                  In the absence of damage or loss, the deposit shall be credited toward payment of 
                  the rental rate and any excess shall be returned to the Renter.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">4. Vehicle Return</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The Renter agrees to return the vehicle to the Owner at the designated location 
                  no later than the agreed upon end date and time. Late returns may incur additional 
                  charges at the daily rental rate.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">5. Fuel Policy</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Vehicles are provided with a full tank of fuel and must be returned with a full 
                  tank. Failure to return with a full tank will result in refueling charges plus 
                  a service fee.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">6. Cancellation Policy</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Cancellations made more than 48 hours before pickup time will receive a full refund. 
                  Cancellations within 48 hours may be subject to a cancellation fee.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">7. Age Requirements</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The primary renter must be at least 21 years of age and hold a valid driver's 
                  license. Additional drivers must also meet the same age and license requirements.
                </p>
              </section>
            </div>

            {/* Acceptance Checkbox */}
            <div className="pt-6 border-t space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={accepted}
                  onCheckedChange={(checked) => setAccepted(checked as boolean)}
                  className="mt-1"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm font-medium leading-relaxed cursor-pointer"
                >
                  I have read, understood, and agree to the terms and conditions of this 
                  rental agreement. I understand that I am responsible for the vehicle 
                  during the rental period and agree to return it in the same condition.
                </Label>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Go Back
                </Button>
                <Button
                  onClick={handleContinue}
                  disabled={!accepted || isSubmitting}
                  className="flex-1 bg-black hover:bg-black/90 text-brand-gold-500 font-semibold"
                >
                  {isSubmitting ? "Processing..." : "Accept & Continue to Payment"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}