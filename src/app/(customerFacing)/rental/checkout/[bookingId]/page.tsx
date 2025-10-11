import { notFound } from "next/navigation"
import db from "@/db/db"
import { formatCurrency } from "@/lib/formatters"
import { format } from "date-fns"
import { CheckoutForm } from "@/components/customer/CheckoutForm"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

async function getBooking(id: string) {
  return db.booking.findUnique({
    where: { id },
    include: {
      customer: true,
      category: true
    }
  })
}

export default async function CheckoutPage({
  params
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params
  const booking = await getBooking(bookingId)

  if (!booking) {
    notFound()
  }

  // Convert Decimals to numbers for Client Component
  const bookingData = {
    id: booking.id,
    bookingNumber: booking.bookingNumber,
    totalAmount: Number(booking.totalAmount),
    customer: {
      firstName: booking.customer.firstName,
      lastName: booking.customer.lastName,
      email: booking.customer.email,
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Secure Checkout</h1>
          <p className="text-muted-foreground">
            Complete your payment to confirm your booking
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Payment Information</h2>
                <p className="text-sm text-muted-foreground">
                  Your payment is secure and encrypted
                </p>
              </CardHeader>
              <CardContent>
                <CheckoutForm booking={bookingData} />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-2">
              <CardHeader>
                <h3 className="text-xl font-semibold">Order Summary</h3>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Booking Number */}
                <div className="bg-brand-red-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Booking Number</p>
                  <p className="font-bold text-lg">{booking.bookingNumber}</p>
                </div>

                {/* Vehicle Info */}
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    {booking.category.imagePath ? (
                      <Image
                        src={booking.category.imagePath}
                        alt={booking.category.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl">🚗</span>
                      </div>
                    )}
                  </div>
                  <h4 className="text-xl font-bold">{booking.category.name}</h4>
                  {booking.category.features && (
                    <div className="flex flex-wrap gap-2">
                      {(booking.category.features as string[]).slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Rental Details */}
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Pickup</p>
                    <p className="font-medium">
                      {format(new Date(booking.pickupDate), "EEE, MMM d, yyyy")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.pickupLocation}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Return</p>
                    <p className="font-medium">
                      {format(new Date(booking.returnDate), "EEE, MMM d, yyyy")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.returnLocation}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Duration</p>
                    <p className="font-medium">
                      {booking.numberOfDays} {booking.numberOfDays === 1 ? 'Day' : 'Days'}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Daily Rate × {booking.numberOfDays}
                    </span>
                    <span>{formatCurrency(Number(booking.subtotal))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>{formatCurrency(Number(booking.taxAmount))}</span>
                  </div>
                  {Number(booking.pickupFee) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pickup Fee</span>
                      <span>{formatCurrency(Number(booking.pickupFee))}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-brand-red-600">
                      {formatCurrency(Number(booking.totalAmount))}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Security Deposit (Refundable)</span>
                    <span>{formatCurrency(Number(booking.depositAmount))}</span>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-green-50 p-3 rounded-lg text-xs text-green-800">
                  <p className="font-semibold mb-1">🔒 Secure Payment</p>
                  <p>Your payment information is encrypted and secure</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}