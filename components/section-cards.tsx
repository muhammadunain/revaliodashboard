import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getProperties } from "@/lib/actions/property.action"
import Link from "next/link"

export async function SectionCards() {
  const properties = await getProperties()
  if (!properties.success || !properties.data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No properties found</p>
      </div>
    )
  }
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {properties.data?.map((property)=>{
        return(
          <Card key={property.id}  className="@container/card">
            <Link href={`properties/${property.id}`}>
        <CardHeader>
          <CardDescription>{property.address}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
           {property.country}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
             {property.city}
            </Badge>
          </CardAction>
        </CardHeader>
        </Link>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
       {property.towerShip} <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
           {property.towerShip} units
          </div>
        </CardFooter>
      </Card>
     
        )
      })}
    </div>
  )
}
