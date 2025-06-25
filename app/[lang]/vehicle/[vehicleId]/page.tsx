"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { vehiclesData } from "@/lib/vehicles"
import type { Vehicle, Locale } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { ArrowLeft, Users, Zap, Tag, CheckCircle } from "lucide-react"
import { useI18n, I18nProvider } from "@/context/i18n-context"
import ReservationForm from "@/components/reservation-form"
import { Toaster } from "@/components/ui/toaster"

const VehicleDetailContent = ({ lang }: { lang: Locale }) => {
  const { t } = useI18n()
  const params = useParams()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [showReservationForm, setShowReservationForm] = useState(false)
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

  useEffect(() => {
    const vehicleId = params.vehicleId as string
    const foundVehicle = vehiclesData.find((v) => v.id === vehicleId)
    setVehicle(foundVehicle || null)
  }, [params.vehicleId])

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-kadoshGreen-DEFAULT mb-4">{t("noVehicles", "vehicleCatalog")}</h1>
          <Link href={`/${lang}`}>
            <Button variant="outline" className="border-kadoshGreen-DEFAULT text-kadoshGreen-DEFAULT">
              {t("backToFleet", "vehicleDetails")}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto py-8 px-4">
        {/* Back Button */}
        <div className="mb-8">
          <Link href={`/${lang}`}>
            <Button
              variant="outline"
              className="border-kadoshGreen-DEFAULT text-kadoshGreen-DEFAULT hover:bg-kadoshGreen-DEFAULT hover:text-kadoshBlack-DEFAULT"
            >
              <ArrowLeft size={18} className="mr-2" />
              {t("backToFleet", "vehicleDetails")}
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Vehicle Gallery */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-kadoshGreen-DEFAULT mb-2">{vehicle.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <Badge variant="secondary" className="bg-kadoshGreen-DEFAULT/20 text-kadoshGreen-DEFAULT">
                  {t(vehicle.category, "categories")}
                </Badge>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 text-kadoshGreen-DEFAULT">{t("gallery", "vehicleDetails")}</h3>
              {vehicle.images.length > 0 ? (
                <>
                <Carousel className="w-full" setApi={setCarouselApi}>
                  <CarouselContent>
                    {vehicle.images.map((src, index) => (
                      <CarouselItem key={index}>
                        <div className="relative w-full h-80 rounded-xl overflow-hidden">
                          <Image
                            src={src || "/placeholder.svg?width=600&height=400"}
                            alt={`${vehicle.name} ${t("gallery", "vehicleDetails")} ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {vehicle.images.length > 1 && (
                    <>
                      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-kadoshBlack-light/80 text-kadoshGreen-DEFAULT hover:bg-kadoshGreen-DEFAULT hover:text-kadoshBlack-light border-kadoshGreen-DEFAULT" />
                      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-kadoshBlack-light/80 text-kadoshGreen-DEFAULT hover:bg-kadoshGreen-DEFAULT hover:text-kadoshBlack-light border-kadoshGreen-DEFAULT" />
                    </>
                  )}
                </Carousel>
                {vehicle.images.length > 1 && (
                  <div className="mt-4 flex justify-center gap-3 overflow-x-auto">
                    {vehicle.images.map((src, idx) => (
                      <button
                        key={idx}
                        onClick={() => carouselApi?.scrollTo(idx)}
                        className={cn(
                          "relative h-16 w-24 rounded overflow-hidden border-2",
                          idx === selectedIndex ? "border-kadoshGreen-DEFAULT" : "border-transparent"
                        )}
                      >
                        <Image src={src} alt={`thumb ${idx + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
                </>
              ) : (
                <div className="w-full h-80 bg-gray-800 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500">{t("noVehicles", "vehicleCatalog")}</p>
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 text-kadoshGreen-DEFAULT">
                {t("vehicleSpecs", "vehicleDetails")}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-kadoshBlack-light rounded-lg">
                  <Users size={20} className="text-kadoshGreen-DEFAULT" />
                  <span className="font-medium">
                    {vehicle.seats} {t("seats", "common")}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-kadoshBlack-light rounded-lg">
                  <Zap size={20} className="text-kadoshGreen-DEFAULT" />
                  <span className="font-medium">{vehicle.engine}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-kadoshBlack-light rounded-lg">
                  <Tag size={20} className="text-kadoshGreen-DEFAULT" />
                  <span className="font-medium text-kadoshGreen-DEFAULT">
                    ${vehicle.pricePerDay} {t("pricePerDay", "vehicleDetails")}
                  </span>
                </div>
              </div>
            </div>

            {vehicle.description && (
              <div className="bg-card rounded-2xl p-6 border border-gray-800">
                <h3 className="text-xl font-semibold mb-4 text-kadoshGreen-DEFAULT">
                  {t("description", "vehicleDetails")}
                </h3>
                <p className="text-gray-300 leading-relaxed">{vehicle.description}</p>
              </div>
            )}

            {vehicle.features && vehicle.features.length > 0 && (
              <div className="bg-card rounded-2xl p-6 border border-gray-800">
                <h3 className="text-xl font-semibold mb-4 text-kadoshGreen-DEFAULT">
                  {t("included", "vehicleDetails")}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {vehicle.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2">
                      <CheckCircle size={16} className="text-kadoshGreen-DEFAULT" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={() => setShowReservationForm(true)}
              className="w-full bg-kadoshGreen-DEFAULT text-kadoshBlack-DEFAULT hover:bg-kadoshGreen-dark text-lg py-6 font-semibold"
            >
              {t("bookThisVehicle", "vehicleDetails")}
            </Button>
          </div>
        </div>

        {/* Reservation Form */}
        {showReservationForm && (
          <div className="mt-12">
            <ReservationForm vehicle={vehicle} onFormSubmitSuccess={() => setShowReservationForm(false)} />
          </div>
        )}
      </main>
      <Toaster />
    </div>
  )
}

export default function VehicleDetailPage({ params }: { params: any }) {
  const { lang } = params as { lang: Locale }
  const currentLang = ["en", "es", "fr"].includes(lang) ? lang : "en"

  return (
    <I18nProvider initialLocale={currentLang}>
      <VehicleDetailContent lang={currentLang} />
    </I18nProvider>
  )
}
