import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const cars = [
  { id: 1, name: "Tesla Model S", year: 2022, status: "Verified" },
  { id: 2, name: "BMW i4", year: 2023, status: "Pending" },
  { id: 3, name: "Ford Mustang Mach-E", year: 2022, status: "Verified" },
  { id: 4, name: "Audi e-tron GT", year: 2023, status: "Verified" },
]

export default function YourCars() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cars.map((car) => (
        <Link href={`/car/${car.id}`} key={car.id}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{car.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={`/placeholder.svg?height=200&width=400`}
                alt={car.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">Year: {car.year}</p>
            </CardContent>
            <CardFooter>
              <Badge variant={car.status === "Verified" ? "secondary" : "destructive"}>
                {car.status}
              </Badge>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}