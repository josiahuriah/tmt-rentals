import { Button } from "@/components/ui/button"
// import { PageHeader } from "@/components/admin/PageHeader"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import db from "@/db/db"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { formatCurrency } from "@/lib/formatters"
import { MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

async function getBookings(searchParams: { 
  search?: string
  status?: string 
}) {
  const whereClause: any = {}

  if (searchParams.status) {
    whereClause.status = searchParams.status
  }

  if (searchParams.search) {
    whereClause.OR = [
      { bookingNumber: { contains: searchParams.search, mode: 'insensitive' } },
      { customer: { 
        OR: [
          { firstName: { contains: searchParams.search, mode: 'insensitive' } },
          { lastName: { contains: searchParams.search, mode: 'insensitive' } },
          { email: { contains: searchParams.search, mode: 'insensitive' } }
        ]
      }}
    ]
  }

  return db.booking.findMany({
    where: whereClause,
    include: {
      customer: true,
      car: true,
      category: true
    },
    orderBy: { createdAt: "desc" },
    take: 50
  })
}

export default async function BookingsPage({
  searchParams
}: {
  searchParams: Promise<{ search?: string; status?: string }>
}) {
  const params = await searchParams
  const bookings = await getBookings(params)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">
            Manage all car rental bookings
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/bookings/new">Create Booking</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input 
          placeholder="Search bookings..." 
          className="max-w-sm"
          defaultValue={params.search}
        />
        <select className="border rounded-md px-3 py-2">
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Bookings Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Pickup Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map(booking => (
                <TableRow key={booking.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link href={`/admin/bookings/${booking.id}`} className="hover:underline">
                      {booking.bookingNumber}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {booking.customer.firstName} {booking.customer.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.customer.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking.car ? (
                      <div>
                        <p className="font-medium">{booking.car.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.category.name}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">{booking.category.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Not assigned
                        </p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{format(new Date(booking.pickupDate), "MMM d, yyyy")}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.pickupDate), "h:mm a")}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking.numberOfDays} {booking.numberOfDays === 1 ? 'day' : 'days'}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(Number(booking.totalAmount))}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      booking.status === "CONFIRMED" ? "default" :
                      booking.status === "ACTIVE" ? "secondary" :
                      booking.status === "COMPLETED" ? "outline" :
                      booking.status === "PENDING" ? "outline" : "destructive"
                    }>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/bookings/${booking.id}`}>
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/bookings/${booking.id}/edit`}>
                            Edit Booking
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Cancel Booking
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}