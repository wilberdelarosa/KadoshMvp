"use client"

import { useState, useEffect, useMemo, use } from "react"
import { vehiclesData } from "@/lib/vehicles"
import type { Vehicle, Locale } from "@/lib/types"
import VehicleCard from "@/components/vehicle-card"
import ReservationModal from "@/components/reservation-modal"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Search, Filter, XCircle, Star, Clock, MapPin, CreditCard } from "lucide-react"
import { useI18n, I18nProvider } from "@/context/i18n-context"
import { Toaster } from "@/components/ui/toaster"

const PageContent = ({ lang }: { lang: Locale }) => {
  const { t } = useI18n()
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(vehiclesData)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedVehicleForReservation, setSelectedVehicleForReservation] = useState<Vehicle | null>(null)
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false)
  const priceBounds = useMemo(() => {
    const prices = vehiclesData.map((v) => v.pricePerDay)
    return { min: Math.min(...prices), max: Math.max(...prices) }
  }, [])
  const [priceRange, setPriceRange] = useState<[number, number]>([
    priceBounds.min,
    priceBounds.max,
  ])
  const [minSeats, setMinSeats] = useState("")

  const categories = useMemo(() => {
    const cats = new Set(vehiclesData.map((v) => v.category))
    return Array.from(cats)
  }, [])

  const seatOptions = useMemo(() => {
    const seats = new Set(vehiclesData.map((v) => v.seats))
    return Array.from(seats).sort((a, b) => a - b)
  }, [])

  useEffect(() => {
    let vehicles = vehiclesData
    if (searchTerm) {
      vehicles = vehicles.filter((v) => v.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (selectedCategory !== "all") {
      vehicles = vehicles.filter((v) => v.category === selectedCategory)
    }
    if (priceRange[0] > priceBounds.min) {
      vehicles = vehicles.filter((v) => v.pricePerDay >= priceRange[0])
    }
    if (priceRange[1] < priceBounds.max) {
      vehicles = vehicles.filter((v) => v.pricePerDay <= priceRange[1])
    }
    if (minSeats) {
      vehicles = vehicles.filter((v) => v.seats >= parseInt(minSeats))
    }
    setFilteredVehicles(vehicles)
  }, [searchTerm, selectedCategory, priceRange, minSeats, priceBounds])

  const handleReserveClick = (vehicle: Vehicle) => {
    setSelectedVehicleForReservation(vehicle)
    setIsReservationModalOpen(true)
  }

  const closeReservationModal = () => {
    setIsReservationModalOpen(false)
    setSelectedVehicleForReservation(null)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed transform scale-110 md:scale-100 transition-transform duration-700"
            style={{ backgroundImage: "url('/bannerPrueba.jpeg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-kadoshBlack-DEFAULT/80 via-kadoshBlack-DEFAULT/60 to-transparent" />

          <div className="relative z-10 container mx-auto px-4 text-center lg:text-left">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                <span className="text-kadoshGreen-DEFAULT">{t("title", "hero").split(" ")[0]}</span>{" "}
                {t("title", "hero").split(" ").slice(1).join(" ")}
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">{t("subtitle", "hero")}</p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  size="lg"
                  className="bg-kadoshGreen-DEFAULT text-kadoshBlack-DEFAULT hover:bg-kadoshGreen-dark text-lg px-8 py-4 h-auto font-semibold"
                  onClick={() => {
                    document.getElementById("vehicles")?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  {t("cta", "hero")}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-kadoshGreen-DEFAULT text-kadoshGreen-DEFAULT hover:bg-kadoshGreen-DEFAULT hover:text-kadoshBlack-DEFAULT text-lg px-8 py-4 h-auto font-semibold"
                  onClick={() => window.open("https://wa.me/18299391365", "_blank")}
                >
                  {t("whatsapp", "common")}
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Clock, key: "available24h" },
                  { icon: MapPin, key: "freeDelivery" },
                  { icon: Star, key: "bestPrices" },
                  { icon: CreditCard, key: "premiumService" },
                ].map(({ icon: Icon, key }) => (
                  <div key={key} className="flex items-center gap-2 text-gray-300">
                    <Icon size={20} className="text-kadoshGreen-DEFAULT" />
                    <span className="text-sm font-medium">{t(`features.${key}`, "hero")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Vehicle Catalog Section */}
        <section id="vehicles" className="py-20 px-4">
          <div className="container mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-kadoshGreen-DEFAULT mb-4">
                {t("title", "vehicleCatalog")}
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">{t("subtitle", "vehicleCatalog")}</p>
            </div>

            {/* Filters */}
            <div className="mb-12 p-8 bg-card rounded-2xl shadow-2xl border border-gray-800">
              <h3 className="text-xl font-semibold text-kadoshGreen-DEFAULT mb-6">{t("filters", "vehicleCatalog")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end">
                <div>
                  <label htmlFor="search" className="block text-sm font-semibold text-kadoshGreen-DEFAULT mb-3">
                    <Search size={16} className="inline mr-2" />
                    {t("searchByName", "common")}
                  </label>
                  <Input
                    id="search"
                    type="text"
                    placeholder={t("searchPlaceholder", "vehicleCatalog")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-input border-gray-700 focus:border-kadoshGreen-DEFAULT h-12 text-lg"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-kadoshGreen-DEFAULT mb-3">
                    <Filter size={16} className="inline mr-2" />
                    {t("category", "common")}
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full bg-input border-gray-700 focus:border-kadoshGreen-DEFAULT h-12 text-lg">
                      <SelectValue placeholder={t("category", "common")} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-kadoshGreen-DEFAULT">
                      <SelectItem value="all">{t("allCategories", "common")}</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="capitalize">
                          {t(cat, "categories")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="priceRange" className="block text-sm font-semibold text-kadoshGreen-DEFAULT mb-3">
                    {t("minPrice", "common")} - {t("maxPrice", "common")}
                  </label>
                  <div className="px-2">
                    <Slider
                      id="priceRange"
                      min={priceBounds.min}
                      max={priceBounds.max}
                      step={5}
                      value={priceRange}
                      onValueChange={(v) => setPriceRange(v as [number, number])}
                    />
                    <div className="flex justify-between text-sm mt-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="minSeats" className="block text-sm font-semibold text-kadoshGreen-DEFAULT mb-3">
                    {t("minSeats", "common")}
                  </label>
                  <Select value={minSeats} onValueChange={setMinSeats}>
                    <SelectTrigger className="w-full bg-input border-gray-700 focus:border-kadoshGreen-DEFAULT h-12 text-lg">
                      <SelectValue placeholder={t("minSeats", "common")} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-kadoshGreen-DEFAULT">
                      {seatOptions.map((seat) => (
                        <SelectItem key={seat} value={String(seat)}>
                          {seat}+
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Button
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("all")
                      setPriceRange([priceBounds.min, priceBounds.max])
                      setMinSeats("")
                    }}
                    variant="outline"
                    className="w-full border-kadoshGreen-DEFAULT text-kadoshGreen-DEFAULT hover:bg-kadoshGreen-DEFAULT hover:text-kadoshBlack-DEFAULT h-12 text-lg font-semibold"
                  >
                    <XCircle size={18} className="mr-2" />
                    {t("clearFilters", "common")}
                  </Button>
                </div>
              </div>
            </div>

            {/* Vehicle Grid */}
            {filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} onReserveClick={handleReserveClick} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <Search size={64} className="text-gray-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-400 mb-2">{t("noVehicles", "vehicleCatalog")}</h3>
                  <p className="text-gray-500">{t("tryDifferentFilters", "vehicleCatalog")}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <ReservationModal
        vehicle={selectedVehicleForReservation}
        isOpen={isReservationModalOpen}
        onClose={closeReservationModal}
      />

      <Toaster />
    </div>
  )
}


export default function KadoshVehiclePage({ params }: { params: any }) {
  const { lang } = use(params) as { lang: Locale }
  const currentLang = ["en", "es", "fr"].includes(lang) ? lang : "en"

  return (
    <I18nProvider initialLocale={currentLang}>
      <PageContent lang={currentLang} />
    </I18nProvider>
  )
}
