import { notFound } from "next/navigation"
import db from "@/db/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { formatCurrency } from "@/lib/formatters"
import { Separator } from "@/components/ui/separator"
import { 
  Calendar, 
  Car, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  DollarSign,
  Clock,
  Edit,
  X
} from "lucide-react"

async function getBooking(id: string) {
  return db.booking.findUnique({
    where: { id },
    include: {
      customer: true,
      car: true,
      category: true,
      payments: true,
      createdBy: true
    }
  })
}

export default async function BookingDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const booking = await getBooking(id)

  if (!booking) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Booking Details</h1>
          <p className="text-muted-foreground">{booking.bookingNumber}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/bookings/${booking.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          {booking.status !== "CANCELLED" && (
            <Button variant="destructive">
              <X className="mr-2 h-4 w-4" />
              Cancel Booking
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">
                {booking.customer.firstName} {booking.customer.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {booking.customer.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {booking.customer.phone}
              </p>
            </div>
            {booking.customer.homePhone && (
              <div>
                <p className="text-sm text-muted-foreground">Home Phone</p>
                <p className="font-medium">{booking.customer.homePhone}</p>
              </div>
            )}
            {booking.customer.address && (
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <span>
                    {booking.customer.address}
                    {booking.customer.city && `, ${booking.customer.city}`}
                    {booking.customer.state && `, ${booking.customer.state}`}
                  </span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{booking.category.name}</p>
            </div>
            {booking.car ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Assigned Vehicle</p>
                  <p className="font-medium">{booking.car.name}</p>
                  {booking.car.licensePlate && (
                    <p className="text-sm text-muted-foreground">
                      {booking.car.licensePlate}
                    </p>
                  )}
                </div>
                {booking.car.color && (
                  <div>
                    <p className="text-sm text-muted-foreground">Color</p>
                    <p className="font-medium">{booking.car.color}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-muted-foreground">
                No specific vehicle assigned yet
              </div>
            )}
            {booking.additionalDriver && (
              <div>
                <p className="text-sm text-muted-foreground">Additional Driver</p>
                <p className="font-medium">{booking.additionalDriver}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rental Period */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Rental Period
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Pickup</p>
              <p className="font-medium">
                {format(new Date(booking.pickupDate), "MMMM d, yyyy 'at' h:mm a")}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <MapPin className="inline h-3 w-3 mr-1" />
                {booking.pickupLocation}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Return</p>
              <p className="font-medium">
                {format(new Date(booking.returnDate), "MMMM d, yyyy 'at' h:mm a")}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <MapPin className="inline h-3 w-3 mr-1" />
                {booking.returnLocation}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {booking.numberOfDays} {booking.numberOfDays === 1 ? 'day' : 'days'}
              </p>
            </div>
            {booking.actualPickupDate && (
              <div>
                <p className="text-sm text-muted-foreground">Actual Pickup</p>
                <p className="font-medium">
                  {format(new Date(booking.actualPickupDate), "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            )}
            {booking.actualReturnDate && (
              <div>
                <p className="text-sm text-muted-foreground">Actual Return</p>
                <p className="font-medium">
                  {format(new Date(booking.actualReturnDate), "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing & Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing & Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={
                booking.status === "CONFIRMED" ? "default" :
                booking.status === "ACTIVE" ? "secondary" :
                booking.status === "COMPLETED" ? "outline" :
                booking.status === "PENDING" ? "outline" : "destructive"
              }>
                {booking.status}
              </Badge>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rate per day</span>
                <span>{formatCurrency(Number(booking.pricePerDay))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Number of days</span>
                <span>{booking.numberOfDays}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(Number(booking.subtotal))}</span>
              </div>
              {Number(booking.pickupFee) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pickup fee</span>
                  <span>{formatCurrency(Number(booking.pickupFee))}</span>
                </div>
              )}
              {Number(booking.taxAmount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatCurrency(Number(booking.taxAmount))}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(Number(booking.totalAmount))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Deposit</span>
                <span>{formatCurrency(Number(booking.depositAmount))}</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Payment Status</span>
              <Badge variant={
                booking.paymentStatus === "PAID" ? "default" :
                booking.paymentStatus === "PARTIAL" ? "outline" : "destructive"
              }>
                {booking.paymentStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {(booking.specialRequests || booking.internalNotes) && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {booking.specialRequests && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Special Requests
                </p>
                <p className="text-sm">{booking.specialRequests}</p>
              </div>
            )}
            {booking.internalNotes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Internal Notes
                </p>
                <p className="text-sm">{booking.internalNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Booking History */}
      <Card>
        <CardHeader>
          <CardTitle>Booking History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created</span>
            <span>{format(new Date(booking.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
          </div>
          {booking.createdBy && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created by</span>
              <span>{booking.createdBy.name}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last updated</span>
            <span>{format(new Date(booking.updatedAt), "MMM d, yyyy 'at' h:mm a")}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}