import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import db from "@/db/db"
import { formatCurrency } from "@/lib/formatters"

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

export async function CategoryCards() {
  const categories = await getCategories()

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Choose Your Perfect Vehicle
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From fuel-efficient economy cars to spacious luxury SUVs, we have
            the perfect ride for your island adventure.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-brand-red-500"
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
                      <span className="text-4xl">🚗</span>
                    </div>
                  )}
                  {/* Overlay Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-brand-red-500 text-white font-semibold">
                      {formatCurrency(Number(category.pricePerDay))}/day
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-muted-foreground">
                    {category.description || "Perfect for your journey"}
                  </p>
                </div>

                {/* Features */}
                {category.features && (
                  <div className="flex flex-wrap gap-2">
                    {(category.features as string[]).map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}

                {/* Availability */}
                <div className="flex items-center gap-2 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      category.cars.length > 0
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="text-muted-foreground">
                    {category.cars.length > 0
                      ? "Available Now"
                      : "Currently Unavailable"}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button
                  asChild
                  className="w-full bg-black hover:bg-black/90 text-brand-red-500 font-semibold"
                  disabled={category.cars.length === 0}
                >
                  <Link href={`/rental?category=${category.id}`}>
                    Book {category.name}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}