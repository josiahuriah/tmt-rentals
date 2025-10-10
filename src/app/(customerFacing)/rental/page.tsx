import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import db from "@/db/db"
import { formatCurrency } from "@/lib/formatters"
import { RentalCalendar } from "@/components/customer/RentalCalendar"

async function getCategories() {
  return db.carCategory.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    include: {
      cars: {
        where: { status: "AVAILABLE" },
        take: 1,
      },
    },
  })
}

export default async function RentalPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-5xl font-bold">Book Your Island Ride</h1>
            <p className="text-xl text-gray-300">
              Select your perfect vehicle and dates to get started
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container space-y-12">
          {/* Date Selection Calendar */}
          <div className="max-w-4xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <h2 className="text-2xl font-bold text-center">
                  When do you need a vehicle?
                </h2>
                <p className="text-center text-muted-foreground">
                  Select your pickup and return dates
                </p>
              </CardHeader>
              <CardContent className="flex justify-center">
                <RentalCalendar />
              </CardContent>
            </Card>
          </div>

          {/* Vehicle Categories */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Choose Your Vehicle</h2>
              <p className="text-muted-foreground">
                We have {categories.length} categories available
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-brand-gold-500"
                >
                  <CardHeader className="p-0">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      {category.imagePath ? (
                        <Image
                          src={category.imagePath}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <span className="text-6xl">🚗</span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-brand-gold-500 text-black font-semibold text-base px-3 py-1">
                          {formatCurrency(Number(category.pricePerDay))}/day
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                      <p className="text-muted-foreground line-clamp-2">
                        {category.description || "Perfect for your journey"}
                      </p>
                    </div>

                    {category.features && (
                      <div className="flex flex-wrap gap-2">
                        {(category.features as string[]).slice(0, 4).map((feature, index) => (
                          <span
                            key={index}
                            className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          category.cars.length > 0
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="text-muted-foreground font-medium">
                        {category.cars.length > 0
                          ? "Available Now"
                          : "Currently Unavailable"}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0">
                    <Button
                      asChild
                      className="w-full bg-black hover:bg-black/90 text-brand-gold-500 font-semibold h-12 text-base"
                      disabled={category.cars.length === 0}
                    >
                      <Link href={`/rental/booking/${category.id}`}>
                        Select {category.name}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-white">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-brand-gold-600 mb-2">
                    $0
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Additional Driver Fee
                  </p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-brand-gold-600 mb-2">
                    $100
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Security Deposit (Refundable)
                  </p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-brand-gold-600 mb-2">
                    $10
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pickup Fee (Beyond Deadman's Cay)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}