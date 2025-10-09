import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookingCalendar } from "@/components/admin/BookingCalendar"
// import { QuickStats } from "@/components/admin/QuickStats"
import db from "@/db/db"
import { formatCurrency } from "@/lib/formatters"
import { startOfMonth, endOfMonth, startOfYear } from "date-fns"

async function getDashboardData() {
  const now = new Date()
  const startOfCurrentMonth = startOfMonth(now)
  const endOfCurrentMonth = endOfMonth(now)
  const startOfCurrentYear = startOfYear(now)

  // Total revenue (completed bookings)
  const revenueData = await db.payment.aggregate({
    where: {
      paymentStatus: "COMPLETED"
    },
    _sum: { amount: true }
  })

  // Monthly revenue
  const monthlyRevenue = await db.payment.aggregate({
    where: {
      paymentStatus: "COMPLETED",
      paymentDate: {
        gte: startOfCurrentMonth,
        lte: endOfCurrentMonth
      }
    },
    _sum: { amount: true }
  })

  // Active bookings
  const activeBookings = await db.booking.count({
    where: {
      status: { in: ["CONFIRMED", "ACTIVE"] }
    }
  })

  // Upcoming bookings (next 30 days)
  const upcomingBookings = await db.booking.count({
    where: {
      status: "CONFIRMED",
      pickupDate: {
        gte: now,
        lte: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      }
    }
  })

  // Cars available
  const availableCars = await db.car.count({
    where: { status: "AVAILABLE" }
  })

  // Cars in maintenance
  const carsInMaintenance = await db.car.count({
    where: { status: "MAINTENANCE" }
  })

  // Get all bookings for calendar
  const bookings = await db.booking.findMany({
    where: {
      status: { in: ["CONFIRMED", "ACTIVE", "PENDING"] },
      pickupDate: { gte: startOfCurrentMonth }
    },
    include: {
      customer: true,
      car: true,
      category: true
    },
    orderBy: { pickupDate: "asc" }
  })

  return {
    totalRevenue: Number(revenueData._sum.amount || 0),
    monthlyRevenue: Number(monthlyRevenue._sum.amount || 0),
    activeBookings,
    upcomingBookings,
    availableCars,
    carsInMaintenance,
    bookings
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your car rental business
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(data.monthlyRevenue)} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Bookings
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeBookings}</div>
            <p className="text-xs text-muted-foreground">
              {data.upcomingBookings} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Cars
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M14 16c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
              <path d="M5 13v-3a8 8 0 1 1 16 0v3" />
              <path d="M16 16v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.availableCars}</div>
            <p className="text-xs text-muted-foreground">
              {data.carsInMaintenance} in maintenance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Occupancy Rate
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.availableCars > 0 
                ? Math.round((data.activeBookings / (data.availableCars + data.activeBookings)) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Current utilization
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Booking Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Calendar</CardTitle>
          <CardDescription>
            Click on a date to view bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BookingCalendar bookings={data.bookings} />
        </CardContent>
      </Card>
    </div>
  )
}