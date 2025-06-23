"use client"
import Image from "next/image"
import type { Vehicle } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Users, Zap, Info, CheckCircle } from "lucide-react"
import { useI18n } from "@/context/i18n-context"

interface VehicleDetailModalProps {
  vehicle: Vehicle | null
  isOpen: boolean
  onClose: () => void
  onReserveClick: (vehicle: Vehicle) => void
}

export default function VehicleDetailModal({ vehicle, isOpen, onClose, onReserveClick }: VehicleDetailModalProps) {
  const { t } = useI18n()

  if (!vehicle) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[800px] bg-card text-foreground border-kadoshGreen-DEFAULT">
        <DialogHeader>
          <DialogTitle className="text-2xl text-kadoshGreen-DEFAULT">{vehicle.name}</DialogTitle>
          <DialogDescription className="capitalize">{t(vehicle.category, "categories")}</DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-kadoshGreen-DEFAULT">{t("gallery", "vehicleDetails")}</h3>
            {vehicle.images.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {vehicle.images.map((src, index) => (
                    <CarouselItem key={index}>
                      <div className="relative w-full h-64 rounded-md overflow-hidden">
                        <Image
                          src={src || "/placeholder.svg"}
                          alt={`${vehicle.name} image ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {vehicle.images.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-kadoshBlack-light/70 text-kadoshGreen-DEFAULT hover:bg-kadoshGreen-DEFAULT hover:text-kadoshBlack-light border-kadoshGreen-DEFAULT" />
                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-kadoshBlack-light/70 text-kadoshGreen-DEFAULT hover:bg-kadoshGreen-DEFAULT hover:text-kadoshBlack-light border-kadoshGreen-DEFAULT" />
                  </>
                )}
              </Carousel>
            ) : (
              <p className="text-muted-foreground">No images available.</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-kadoshGreen-DEFAULT">
              {t("specifications", "vehicleDetails")}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-kadoshGreen-DEFAULT" />
                <span>
                  {vehicle.seats} {t("seats", "common")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-kadoshGreen-DEFAULT" />
                <span>
                  {t("engine", "common")}: {vehicle.engine}
                </span>
              </div>
              {vehicle.description && (
                <div className="flex items-start gap-2">
                  <Info size={18} className="text-kadoshGreen-DEFAULT mt-0.5" />
                  <p>{vehicle.description}</p>
                </div>
              )}
              {vehicle.features && vehicle.features.length > 0 && (
                <div>
                  <h4 className="font-medium mt-3 mb-1 text-kadoshGreen-DEFAULT/80">Features:</h4>
                  <ul className="list-none space-y-1">
                    {vehicle.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-kadoshGreen-DEFAULT" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="border-kadoshGreen-DEFAULT text-kadoshGreen-DEFAULT hover:bg-kadoshGreen-DEFAULT hover:text-kadoshBlack-DEFAULT"
            >
              {t("close", "common")}
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="bg-kadoshGreen-DEFAULT text-kadoshBlack-DEFAULT hover:bg-kadoshGreen-dark"
            onClick={() => {
              onReserveClick(vehicle)
              onClose()
            }}
          >
            {t("reserve", "common")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
