"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { vehiclesData } from "@/lib/vehicles"
import type { Vehicle, Locale } from "@/lib/types"
import VehicleCard from "@/components/vehicle-card"
import ReservationModal from "@/components/reservation-modal"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Filter, XCircle, Star, Clock, MapPin, CreditCard, History } from "lucide-react"
import { useI18n } from "@/context/i18n-context"
import { Toaster } from "@/components/ui/toaster"

type FilterHistoryEntry =
  | { id: number; type: "search"; value: string; timestamp: number }
  | { id: number; type: "category"; value: string; timestamp: number }
  | { id: number; type: "price"; value: [number, number]; timestamp: number }
  | { id: number; type: "seats"; value: string; timestamp: number }
  | { id: number; type: "clear"; value: "search" | "category" | "price" | "seats" | "all"; timestamp: number }

const SUPPORTED_LOCALES: Locale[] = ["en", "es", "fr"]

const KadoshVehiclePage = () => {
  const { t, locale } = useI18n()
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(vehiclesData)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedVehicleForReservation, setSelectedVehicleForReservation] = useState<Vehicle | null>(null)
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false)
  const [filterHistory, setFilterHistory] = useState<FilterHistoryEntry[]>([])
  const priceBounds = useMemo(() => {
    const prices = vehiclesData.map((v) => v.pricePerDay)
    return { min: Math.min(...prices), max: Math.max(...prices) }
  }, [])
  const [priceRange, setPriceRange] = useState<[number, number]>([priceBounds.min, priceBounds.max])
  const [minSeats, setMinSeats] = useState("")
  const skipLoggingRef = useRef(false)
  const filterInteractionRef = useRef({
    search: false,
    category: false,
    price: false,
    seats: false,
  })

  const categories = useMemo(() => {
    const cats = new Set(vehiclesData.map((v) => v.category))
    return Array.from(cats)
  }, [])

  const seatOptions = useMemo(() => {
    const seats = new Set(vehiclesData.map((v) => v.seats))
    return Array.from(seats).sort((a, b) => a - b)
  }, [])

  const runWithSkip = useCallback((callback: () => void) => {
    skipLoggingRef.current = true
    callback()
    setTimeout(() => {
      skipLoggingRef.current = false
    }, 0)
  }, [])

  const logFilterChange = useCallback((event: Omit<FilterHistoryEntry, "id" | "timestamp">) => {
    setFilterHistory((prev) => {
      const entry = { ...event, id: Date.now(), timestamp: Date.now() }
      const next = [...prev, entry]
      return next.slice(-8)
    })
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
      vehicles = vehicles.filter((v) => v.seats >= Number.parseInt(minSeats))
    }
    setFilteredVehicles(vehicles)
  }, [searchTerm, selectedCategory, priceRange, minSeats, priceBounds])

  useEffect(() => {
    if (skipLoggingRef.current) return
    if (!filterInteractionRef.current.search) {
      filterInteractionRef.current.search = true
      if (!searchTerm) return
    }
    const handler = setTimeout(() => {
      if (!searchTerm) {
        logFilterChange({ type: "clear", value: "search" })
        return
      }
      logFilterChange({ type: "search", value: searchTerm })
    }, 400)
    return () => clearTimeout(handler)
  }, [searchTerm, logFilterChange])

  useEffect(() => {
    if (skipLoggingRef.current) return
    if (!filterInteractionRef.current.category) {
      filterInteractionRef.current.category = true
      if (selectedCategory === "all") return
    }
    if (selectedCategory === "all") {
      logFilterChange({ type: "clear", value: "category" })
    } else {
      logFilterChange({ type: "category", value: selectedCategory })
    }
  }, [selectedCategory, logFilterChange])

  useEffect(() => {
    if (skipLoggingRef.current) return
    const [min, max] = priceRange
    if (!filterInteractionRef.current.price) {
      filterInteractionRef.current.price = true
      if (min === priceBounds.min && max === priceBounds.max) return
    }
    const handler = setTimeout(() => {
      if (min === priceBounds.min && max === priceBounds.max) {
        logFilterChange({ type: "clear", value: "price" })
        return
      }
      logFilterChange({ type: "price", value: [min, max] })
    }, 300)
    return () => clearTimeout(handler)
  }, [priceRange, priceBounds, logFilterChange])

  useEffect(() => {
    if (skipLoggingRef.current) return
    if (!filterInteractionRef.current.seats) {
      filterInteractionRef.current.seats = true
      if (!minSeats) return
    }
    if (!minSeats) {
      logFilterChange({ type: "clear", value: "seats" })
      return
    }
    logFilterChange({ type: "seats", value: minSeats })
  }, [minSeats, logFilterChange])

  const handleReserveClick = (vehicle: Vehicle) => {
    setSelectedVehicleForReservation(vehicle)
    setIsReservationModalOpen(true)
  }

  const closeReservationModal = () => {
    setIsReservationModalOpen(false)
    setSelectedVehicleForReservation(null)
  }

  const handleClearFilters = useCallback(() => {
    runWithSkip(() => {
      logFilterChange({ type: "clear", value: "all" })
      setSearchTerm("")
      setSelectedCategory("all")
      setPriceRange([priceBounds.min, priceBounds.max])
      setMinSeats("")
    })
  }, [logFilterChange, priceBounds.min, priceBounds.max, runWithSkip])

  const currencyFormatter = useMemo(() => {
    const localeMap: Record<Locale, string> = {
      en: "en-US",
      es: "es-ES",
      fr: "fr-FR",
    }
    const resolvedLocale: Locale = SUPPORTED_LOCALES.includes(locale) ? locale : "en"
    return new Intl.NumberFormat(localeMap[resolvedLocale] ?? "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    })
  }, [locale])

  const isDefaultPriceRange = priceRange[0] === priceBounds.min && priceRange[1] === priceBounds.max

  const activeFilters: Array<{ key: string; label: string; onRemove: () => void }> = []

  if (searchTerm.trim()) {
    activeFilters.push({
      key: "search",
      label: `${t("searchLabel", "vehicleCatalog")}: "${searchTerm}"`,
      onRemove: () =>
        runWithSkip(() => {
          logFilterChange({ type: "clear", value: "search" })
          setSearchTerm("")
        }),
    })
  }

  if (selectedCategory !== "all") {
    activeFilters.push({
      key: "category",
      label: `${t("categoryLabel", "vehicleCatalog")}: ${t(selectedCategory, "categories")}`,
      onRemove: () =>
        runWithSkip(() => {
          logFilterChange({ type: "clear", value: "category" })
          setSelectedCategory("all")
        }),
    })
  }

  if (!isDefaultPriceRange) {
    activeFilters.push({
      key: "price",
      label: `${t("priceRange", "vehicleCatalog")}: ${currencyFormatter.format(priceRange[0])} - ${currencyFormatter.format(priceRange[1])}`,
      onRemove: () =>
        runWithSkip(() => {
          logFilterChange({ type: "clear", value: "price" })
          setPriceRange([priceBounds.min, priceBounds.max])
        }),
    })
  }

  if (minSeats) {
    activeFilters.push({
      key: "seats",
      label: `${t("seatsLabel", "vehicleCatalog")}: ${minSeats}+`,
      onRemove: () =>
        runWithSkip(() => {
          logFilterChange({ type: "clear", value: "seats" })
          setMinSeats("")
        }),
    })
  }

  const historyItems = [...filterHistory].reverse()

  const renderHistoryLabel = (entry: FilterHistoryEntry) => {
    switch (entry.type) {
      case "search":
        return `${t("historySearch", "vehicleCatalog")} "${entry.value}"`
      case "category":
        return `${t("historyCategory", "vehicleCatalog")} ${t(entry.value, "categories")}`
      case "price":
        return `${t("historyPrice", "vehicleCatalog")}: ${currencyFormatter.format(entry.value[0])} - ${currencyFormatter.format(entry.value[1])}`
      case "seats":
        return `${t("historySeats", "vehicleCatalog")} ${entry.value}+`
      case "clear":
        if (entry.value === "all") return t("historyAllCleared", "vehicleCatalog")
        if (entry.value === "search") return t("historySearchCleared", "vehicleCatalog")
        if (entry.value === "category") return t("historyCategoryCleared", "vehicleCatalog")
        if (entry.value === "price") return t("historyPriceCleared", "vehicleCatalog")
        if (entry.value === "seats") return t("historySeatsCleared", "vehicleCatalog")
        return ""
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('/bannerPrueba.jpeg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-kadoshBlack-DEFAULT/90 via-kadoshBlack-DEFAULT/70 to-transparent" />

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
                  className="border-2 border-kadoshGreen-DEFAULT text-kadoshGreen-DEFAULT hover:bg-kadoshGreen-DEFAULT hover:text-kadoshBlack-DEFAULT text-lg px-8 py-4 h-auto font-semibold bg-transparent"
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
            <div className="mb-12 grid lg:grid-cols-[2fr,1fr] gap-6">
              <div className="p-8 bg-card rounded-2xl shadow-2xl border border-gray-800">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-kadoshGreen-DEFAULT mb-2">{t("filters", "vehicleCatalog")}</h3>
                    <p className="text-sm text-gray-400 max-w-xl">{t("filtersHelper", "vehicleCatalog")}</p>
                  </div>
                  <div className="bg-kadoshBlack-light border border-kadoshGreen-DEFAULT/30 rounded-xl px-6 py-4 text-center shadow-inner">
                    <p className="text-xs uppercase tracking-wider text-gray-400">{t("resultsFound", "vehicleCatalog")}</p>
                    <p className="text-2xl font-bold text-kadoshGreen-DEFAULT">
                      {filteredVehicles.length}
                      <span className="text-base font-medium text-gray-500"> / {vehiclesData.length}</span>
                    </p>
                    <p className="text-xs text-gray-500">{t("resultsOutOf", "vehicleCatalog")}</p>
                  </div>
                </div>
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
                        <span>{currencyFormatter.format(priceRange[0])}</span>
                        <span>{currencyFormatter.format(priceRange[1])}</span>
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
                      onClick={handleClearFilters}
                      variant="outline"
                      className="w-full border-kadoshGreen-DEFAULT text-kadoshGreen-DEFAULT hover:bg-kadoshGreen-DEFAULT hover:text-kadoshBlack-DEFAULT h-12 text-lg font-semibold"
                    >
                      <XCircle size={18} className="mr-2" />
                      {t("clearFilters", "common")}
                    </Button>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Filter size={18} className="text-kadoshGreen-DEFAULT" />
                    <span className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                      {t("activeFilters", "vehicleCatalog")}
                    </span>
                  </div>
                  {activeFilters.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {activeFilters.map((activeFilter) => (
                        <Badge
                          key={activeFilter.key}
                          variant="secondary"
                          className="bg-kadoshGreen-DEFAULT/15 text-kadoshGreen-DEFAULT border border-kadoshGreen-DEFAULT/40 py-2 px-3 text-sm flex items-center gap-2"
                        >
                          <span>{activeFilter.label}</span>
                          <button
                            type="button"
                            onClick={activeFilter.onRemove}
                            className="rounded-full bg-kadoshBlack-light/60 p-1 hover:bg-kadoshGreen-DEFAULT hover:text-kadoshBlack-DEFAULT transition"
                            aria-label={t("clearFilters", "common")}
                          >
                            <XCircle size={14} />
                          </button>
                        </Badge>
                      ))}
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={handleClearFilters}
                        className="text-sm text-gray-400 hover:text-kadoshGreen-DEFAULT hover:bg-kadoshGreen-DEFAULT/10"
                      >
                        {t("clearAll", "vehicleCatalog")}
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">{t("noActiveFilters", "vehicleCatalog")}</p>
                  )}
                </div>
              </div>

              <aside className="p-6 bg-card rounded-2xl shadow-xl border border-gray-800 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <History size={18} className="text-kadoshGreen-DEFAULT" />
                  <span className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                    {t("filterHistory", "vehicleCatalog")}
                  </span>
                </div>
                <Separator className="bg-gray-800" />
                {historyItems.length > 0 ? (
                  <ScrollArea className="h-48 pr-2">
                    <div className="space-y-4">
                      {historyItems.map((entry) => (
                        <div key={entry.id} className="border-l-2 border-kadoshGreen-DEFAULT/40 pl-3">
                          <p className="text-sm text-gray-300">{renderHistoryLabel(entry)}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <p className="text-sm text-gray-500">{t("historyEmpty", "vehicleCatalog")}</p>
                )}
              </aside>
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

export default KadoshVehiclePage
