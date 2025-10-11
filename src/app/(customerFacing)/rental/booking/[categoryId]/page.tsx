import { notFound, redirect } from "next/navigation"
import db from "@/db/db"
import { BookingForm } from "@/components/customer/BookingForm"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { formatCurrency } from "@/lib/formatters"
import { Badge } from "@/components/ui/badge"

async function getCategory(id: string) {
  return db.carCategory.findUnique({
    where: { id, isActive: true },
    include: {
      cars: {
        where: { status: "AVAILABLE" },
        take: 1
      }
    }
  })
}

export default async function BookingPage({
  params
}: {
  params: Promise<{ categoryId: string }>
}) {
  const { categoryId } = await params
  const category = await getCategory(categoryId)

  if (!category) {
    notFound()
  }

  if (category.cars.length === 0) {
    redirect('/rental')
  }

  // Convert Decimal to number
  const categoryData = {
    id: category.id,
    name: category.name,
    pricePerDay: Number(category.pricePerDay),
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Complete Your Booking</h1>
          <p className="text-muted-foreground">
            Please fill in your details to reserve your vehicle
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Your Information</h2>
              </CardHeader>
              <CardContent>
                 <BookingForm category={categoryData} />
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-2">
              <CardHeader>
                <h3 className="text-xl font-semibold">Booking Summary</h3>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Vehicle Image */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                  {category.imagePath ? (
                    <Image
                      src={category.imagePath}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">🚗</span>
                    </div>
                  )}
                </div>

                {/* Vehicle Details */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-2xl font-bold">{category.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>

                  {category.features && (
                    <div className="flex flex-wrap gap-2">
                      {(category.features as string[]).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-lg">
                      <span className="font-medium">Rate per day</span>
                      <span className="font-bold text-brand-red-600">
                        {formatCurrency(Number(category.pricePerDay))}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      + Tax and fees (calculated at checkout)
                    </p>
                  </div>
                </div>

                {/* Important Info */}
                <div className="bg-blue-50 p-4 rounded-lg text-sm space-y-2">
                  <p className="font-semibold text-blue-900">📋 What to bring:</p>
                  <ul className="space-y-1 text-blue-800 text-xs">
                    <li>• Valid driver's license</li>
                    <li>• Credit/debit card for deposit</li>
                    <li>• Proof of insurance (if applicable)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}