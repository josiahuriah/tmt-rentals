import { notFound } from "next/navigation"
import db from "@/db/db"
import { formatCurrency } from "@/lib/formatters"
import { format } from "date-fns"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, Mail, Calendar, MapPin, Car, Phone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DownloadReceiptButton } from "@/components/customer/DownloadReceiptButton"

async function getBooking(id: string) {
  return db.booking.findUnique({
    where: { id },
    include: {
      customer: true,
      category: true,
      car: true,
      payments: {
        where: { paymentStatus: "COMPLETED" },
        orderBy: { paymentDate: "desc" },
        take: 1
      }
    }
  })
}

export default async function ConfirmationPage({
  params
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params
  const booking = await getBooking(bookingId)

  if (!booking) {
    notFound()
  }

  const payment = booking.payments[0]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Success Header */}
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-green-900">Booking Confirmed!</h1>
          <p className="text-xl text-green-700">
            Your reservation has been successfully confirmed
          </p>
          <div className="inline-block bg-green-100 px-6 py-3 rounded-lg">
            <p className="text-sm text-green-800 mb-1">Booking Number</p>
            <p className="text-2xl font-bold text-green-900">{booking.bookingNumber}</p>
          </div>
        </div>

        {/* Email Confirmation Notice */}
        <Card className="mb-6 border-2 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-green-900 mb-1">
                  Confirmation Email Sent
                </p>
                <p className="text-sm text-green-800">
                  We've sent a detailed confirmation email to{" "}
                  <span className="font-semibold">{booking.customer.email}</span>.
                  Please check your inbox (and spam folder) for booking details and receipt.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Receipt */}
        <Card className="border-2" id="receipt">
          <CardHeader className="bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Booking Receipt</h2>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(), "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              <Image
                src="/logo.png"
                alt="TMT Coconut Cruisers"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-8 space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Customer Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">
                    {booking.customer.firstName} {booking.customer.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{booking.customer.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{booking.customer.phone}</p>
                </div>
                {booking.customer.homePhone && (
                  <div>
                    <p className="text-muted-foreground">Home Phone</p>
                    <p className="font-medium">{booking.customer.homePhone}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Vehicle Information */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Car className="w-5 h-5" />
                Vehicle Details
              </h3>
              <div className="flex gap-4">
                <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {booking.category.imagePath ? (
                    <Image
                      src={booking.category.imagePath}
                      alt={booking.category.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">🚗</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2 text-sm">
                  <p className="font-bold text-lg">{booking.category.name}</p>
                  <p className="text-muted-foreground">{booking.category.description}</p>
                  {booking.car && (
                    <p className="text-sm">
                      Assigned Vehicle: <span className="font-semibold">{booking.car.name}</span>
                      {booking.car.licensePlate && ` (${booking.car.licensePlate})`}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Rental Period */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Rental Period
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Pickup</p>
                  <p className="font-semibold">
                    {format(new Date(booking.pickupDate), "EEE, MMMM d, yyyy")}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {booking.pickupLocation}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Return</p>
                  <p className="font-semibold">
                    {format(new Date(booking.returnDate), "EEE, MMMM d, yyyy")}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {booking.returnLocation}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm">
                <span className="text-muted-foreground">Duration:</span>{" "}
                <span className="font-semibold">
                  {booking.numberOfDays} {booking.numberOfDays === 1 ? "Day" : "Days"}
                </span>
              </p>
            </div>

            <Separator />

            {/* Payment Summary */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Payment Summary</h3>
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
                  <span>Total Paid</span>
                  <span className="text-green-600">
                    {formatCurrency(Number(booking.totalAmount))}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Security Deposit (Refundable)</span>
                  <span>{formatCurrency(Number(booking.depositAmount))}</span>
                </div>
                {payment && (
                  <div className="pt-2 text-xs text-muted-foreground">
                    <p>Payment Method: {payment.paymentMethod}</p>
                    <p>Transaction ID: {payment.transactionId}</p>
                    <p>Payment Date: {format(new Date(payment.paymentDate), "MMM d, yyyy 'at' h:mm a")}</p>
                  </div>
                )}
              </div>
            </div>

            {booking.additionalDriver && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Additional Driver</h3>
                  <p className="text-sm">{booking.additionalDriver}</p>
                </div>
              </>
            )}

            {booking.specialRequests && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Special Requests</h3>
                  <p className="text-sm text-muted-foreground">{booking.specialRequests}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <DownloadReceiptButton bookingId={booking.id} />
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>

        {/* Important Information */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-3">
              📋 Important Information
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Bring your valid driver's license and booking confirmation</li>
              <li>• Arrive 15 minutes before your pickup time</li>
              <li>• The $100 security deposit will be refunded upon vehicle return</li>
              <li>• For questions, contact us at +1 (242) 472-0016</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}