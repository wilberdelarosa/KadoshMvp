"use client"

import Image from "next/image"
import Link from "next/link"
import type { Vehicle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Zap, Tag, ArrowRight, Calendar } from "lucide-react"
import { useI18n } from "@/context/i18n-context"

interface VehicleCardProps {
  vehicle: Vehicle
  onReserveClick?: (vehicle: Vehicle) => void
}

export default function VehicleCard({ vehicle, onReserveClick }: VehicleCardProps) {
  const { t, locale } = useI18n()

  return (
    <Card className="bg-card overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-kadoshGreen-DEFAULT/20 transition-all duration-300 flex flex-col h-full group border border-gray-800 hover:border-kadoshGreen-DEFAULT/50 transform hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <div className="relative w-full h-56 overflow-hidden">
          <Image
            src={vehicle.images[0] || "/image.png"}
            alt={vehicle.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-kadoshGreen-DEFAULT/90 text-kadoshBlack-DEFAULT font-semibold">
              {t(vehicle.category, "categories")}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 flex-grow">
        <h3 className="text-xl font-bold text-kadoshGreen-DEFAULT mb-2 group-hover:text-kadoshGreen-dark transition-colors">
          {vehicle.name}
        </h3>

        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-kadoshGreen-DEFAULT" />
            <span>
              {vehicle.seats} {t("seats", "common")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-kadoshGreen-DEFAULT" />
            <span>{vehicle.engine}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-kadoshGreen-DEFAULT" />
            <span className="text-kadoshGreen-DEFAULT font-semibold">
              {t("startingFrom", "vehicleCatalog")} ${vehicle.pricePerDay} {t("perDay", "vehicleCatalog")}
            </span>
          </div>
        </div>

        {vehicle.description && <p className="text-gray-400 text-sm mt-3 line-clamp-2">{vehicle.description}</p>}
      </CardContent>

      <CardFooter className="p-6 pt-0 grid grid-cols-2 gap-3">
        <Link href={`/${locale}/vehicle/${vehicle.id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full border-kadoshGreen-DEFAULT text-kadoshGreen-DEFAULT hover:bg-kadoshGreen-DEFAULT hover:text-kadoshBlack-DEFAULT transition-all duration-200 group/btn bg-transparent"
          >
            {t("viewDetails", "vehicleCatalog")}
            <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>

        <Button
          onClick={() => onReserveClick?.(vehicle)}
          className="w-full bg-kadoshGreen-DEFAULT text-kadoshBlack-DEFAULT hover:bg-kadoshGreen-dark transition-all duration-200 group/btn"
        >
          <Calendar size={16} className="mr-2" />
          {t("reserveNow", "vehicleCatalog")}
        </Button>
      </CardFooter>
    </Card>
  )
}
