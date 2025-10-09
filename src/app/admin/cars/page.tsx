import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import db from "@/db/db"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

async function getCarsData() {
  const [cars, categories] = await Promise.all([
    db.car.findMany({
      include: {
        category: true,
        bookings: {
          where: {
            status: { in: ["CONFIRMED", "ACTIVE"] }
          }
        }
      },
      orderBy: [
        { category: { name: "asc" } },
        { name: "asc" }
      ]
    }),
    db.carCategory.findMany({
      include: {
        cars: true
      },
      orderBy: { displayOrder: "asc" }
    })
  ])

  return { cars, categories }
}

export default async function CarsPage() {
  const { cars, categories } = await getCarsData()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Fleet Management</h1>
          <p className="text-muted-foreground">
            Manage your car inventory and categories
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/categories/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/cars/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Car
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="cars" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cars">All Cars ({cars.length})</TabsTrigger>
          <TabsTrigger value="categories">Categories ({categories.length})</TabsTrigger>
        </TabsList>

        {/* Cars Tab */}
        <TabsContent value="cars" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>License Plate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Active Bookings</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cars.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No cars found. Add your first car to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  cars.map(car => (
                    <TableRow key={car.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{car.name}</p>
                          {car.model && (
                            <p className="text-sm text-muted-foreground">
                              {car.year} {car.model}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{car.category.name}</TableCell>
                      <TableCell>
                        {car.licensePlate || (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          car.status === "AVAILABLE" ? "default" :
                          car.status === "RENTED" ? "secondary" :
                          car.status === "MAINTENANCE" ? "outline" : "destructive"
                        }>
                          {car.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {car.bookings.length > 0 ? (
                          <span className="font-medium">{car.bookings.length}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
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
                              <Link href={`/admin/cars/${car.id}/edit`}>
                                Edit Car
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              View History
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              Mark as Maintenance
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Remove Car
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
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map(category => (
              <div
                key={category.id}
                className="rounded-lg border p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/categories/${category.id}/edit`}>
                          Edit Category
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        disabled={category.cars.length > 0}
                      >
                        Delete Category
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price per day</span>
                    <span className="font-medium">
                      ${Number(category.pricePerDay)}/day
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cars in fleet</span>
                    <span className="font-medium">{category.cars.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={category.isActive ? "default" : "outline"}>
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}