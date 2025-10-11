import { PrismaClient } from "../src/generated/prisma"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting seed...")

  // Create car categories
  const categories = [
    {
      name: "Economy",
      description: "Fuel-efficient and affordable vehicles",
      pricePerDay: 70,
      imagePath: "/images/economy.jpg",
      displayOrder: 1,
      features: ["AC", "Automatic", "5 Seats"]
    },
    {
      name: "Sedan",
      description: "Comfortable sedans for business or leisure",
      pricePerDay: 80,
      imagePath: "/images/sedan.jpg",
      displayOrder: 2,
      features: ["AC", "Automatic", "5 Seats", "Bluetooth"]
    },
    {
      name: "Van",
      description: "Spacious vans for families or groups",
      pricePerDay: 120,
      imagePath: "/images/van.jpg",
      displayOrder: 3,
      features: ["AC", "Automatic", "7 Seats", "Bluetooth"]
    },
    {
      name: "SUV",
      description: "Versatile SUVs for any terrain",
      pricePerDay: 90,
      imagePath: "/images/suv.jpg",
      displayOrder: 4,
      features: ["AC", "Automatic", "5 Seats", "4WD"]
    },
    {
      name: "Luxury",
      description: "Premium vehicles for the ultimate experience",
      pricePerDay: 165,
      imagePath: "/images/luxury.jpg",
      displayOrder: 5,
      features: ["AC", "Automatic", "5 Seats", "Leather", "Premium Sound"]
    }
  ]

  for (const category of categories) {
    const created = await prisma.carCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category
    })
    console.log("✅ Created category:", created.name)
  }

  // Get created categories
  const economyCategory = await prisma.carCategory.findUnique({
    where: { name: "Economy" }
  })
  const sedanCategory = await prisma.carCategory.findUnique({
    where: { name: "Sedan" }
  })
  const vanCategory = await prisma.carCategory.findUnique({
    where: { name: "Van" }
  })
  const suvCategory = await prisma.carCategory.findUnique({
    where: { name: "SUV" }
  })
  const luxuryCategory = await prisma.carCategory.findUnique({
    where: { name: "Luxury" }
  })

  // Create cars - using upsert to handle existing data
  const cars = [
    // Economy
    {
      name: "Chevy Cruze",
      model: "LT",
      year: 2023,
      color: "Silver",
      licensePlate: "BAH-E001",
      categoryId: economyCategory!.id,
      status: "AVAILABLE"
    },
    {
      name: "Chevy Cruze",
      model: "LT",
      year: 2023,
      color: "White",
      licensePlate: "BAH-E002",
      categoryId: economyCategory!.id,
      status: "AVAILABLE"
    },
    {
      name: "Kia Forte",
      model: "LXS",
      year: 2023,
      color: "Blue",
      licensePlate: "BAH-E003",
      categoryId: economyCategory!.id,
      status: "AVAILABLE"
    },
    // Sedan
    {
      name: "Ford Fusion",
      model: "SE",
      year: 2023,
      color: "Black",
      licensePlate: "BAH-S001",
      categoryId: sedanCategory!.id,
      status: "AVAILABLE"
    },
    {
      name: "Ford Fusion",
      model: "SE",
      year: 2023,
      color: "Silver",
      licensePlate: "BAH-S002",
      categoryId: sedanCategory!.id,
      status: "AVAILABLE"
    },
    // Van
    {
      name: "Dodge Caravan",
      model: "SXT",
      year: 2023,
      color: "Gray",
      licensePlate: "BAH-V001",
      categoryId: vanCategory!.id,
      status: "AVAILABLE"
    },
    {
      name: "Chevy Orlando",
      model: "LT",
      year: 2023,
      color: "White",
      licensePlate: "BAH-V002",
      categoryId: vanCategory!.id,
      status: "AVAILABLE"
    },
    // SUV
    {
      name: "Dodge Journey",
      model: "SXT",
      year: 2023,
      color: "Red",
      licensePlate: "BAH-U001",
      categoryId: suvCategory!.id,
      status: "AVAILABLE"
    },
    {
      name: "Dodge Journey",
      model: "SXT",
      year: 2023,
      color: "Black",
      licensePlate: "BAH-U002",
      categoryId: suvCategory!.id,
      status: "AVAILABLE"
    },
    // Luxury
    {
      name: "Chevrolet Suburban",
      model: "Premier",
      year: 2023,
      color: "Black",
      licensePlate: "BAH-L001",
      categoryId: luxuryCategory!.id,
      status: "AVAILABLE"
    },
    {
      name: "Lincoln MKT",
      model: "Elite",
      year: 2023,
      color: "White",
      licensePlate: "BAH-L002",
      categoryId: luxuryCategory!.id,
      status: "AVAILABLE"
    }
  ]

  for (const car of cars) {
    const created = await prisma.car.upsert({
      where: { licensePlate: car.licensePlate },
      update: {
        name: car.name,
        model: car.model,
        year: car.year,
        color: car.color,
        categoryId: car.categoryId,
        status: car.status
      },
      create: car
    })
    console.log("✅ Created/Updated car:", created.name, created.licensePlate)
  }

  console.log("🎉 Seeding completed!")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })