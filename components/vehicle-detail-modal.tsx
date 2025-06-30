"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import type { Vehicle } from "@/lib/types"
import { cn } from "@/lib/utils"
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
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
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (!carouselApi) return
    const handler = () => setSelectedIndex(carouselApi.selectedScrollSnap())
    carouselApi.on("select", handler)
    handler()
    return () => {
      carouselApi.off("select", handler)
    }
  }, [carouselApi])

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
              <>
                <Carousel className="w-full" setApi={setCarouselApi}>
                  <CarouselContent>
                    {vehicle.images.map((src, index) => (
                      <CarouselItem key={index}>
                        <div className="relative w-full h-64 rounded-md overflow-hidden">
                          <Image
                            src={src || "/image.png"}
                            alt={`${vehicle.name} image ${index + 1}`}
                            fill
                            className="object-cover"
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
                {vehicle.images.length > 1 && (
                  <div className="mt-3 flex justify-center gap-2 overflow-x-auto">
                    {vehicle.images.map((src, idx) => (
                      <button
                        key={idx}
                        onClick={() => carouselApi?.scrollTo(idx)}
                        className={cn(
                          "relative h-12 w-20 rounded overflow-hidden border-2",
                          idx === selectedIndex ? "border-kadoshGreen-DEFAULT" : "border-transparent",
                        )}
                      >
                        <Image src={src || "/image.png"} alt={`thumb ${idx + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">{t("noImages", "vehicleDetails")}</p>
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
              className="border-kadoshGreen-DEFAULT text-kadoshGreen-DEFAULT hover:bg-kadoshGreen-DEFAULT hover:text-kadoshBlack-DEFAULT bg-transparent"
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
