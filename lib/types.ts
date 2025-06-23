export interface Vehicle {
  id: string
  name: string
  category: "sedan" | "suv" | "minivan" | "compact"
  images: string[] // URLs to images
  seats: number
  engine: string // e.g., "2.0L Petrol", "Electric"
  pricePerDay: number // For display, actual booking logic is manual
  description?: string
  features?: string[]
}

export type Translations = {
  common: {
    appName: string
    loading: string
    reserve: string
    allCategories: string
    searchByName: string
    seats: string
    engine: string
    comments: string
    close: string
    bookNow: string
    selectDate: string
    selectTime: string
    whatsapp: string
    email: string
    call: string
    clearFilters: string
    category: string
    success: string
    error: string
    language: string
  }
  categories: {
    sedan: string
    suv: string
    minivan: string
    compact: string
  }
  hero: {
    title: string
    subtitle: string
    cta: string
    features: {
      available24h: string
      freeDelivery: string
      bestPrices: string
      premiumService: string
    }
  }
  navigation: {
    vehicles: string
    whatsapp: string
    email: string
    phone: string
  }
  vehicleCatalog: {
    title: string
    subtitle: string
    viewDetails: string
    reserveNow: string
    startingFrom: string
    perDay: string
    noVehicles: string
    tryDifferentFilters: string
    searchPlaceholder: string
    filters: string
  }
  reservationForm: {
    title: string
    subtitle: string
    firstName: string
    lastName: string
    idOrPassport: string
    phone: string
    email: string
    pickupDate: string
    pickupTime: string
    returnDate: string
    returnTime: string
    additionalComments: string
    additionalCommentsPlaceholder: string
    submit: string
    successMessage: string
    errorMessage: string
    downloadICS: string
    reservingVehicle: string
    cancel: string
  }
  footer: {
    contactUs: string
    phone: string
    email: string
    address: string
    availability: string
    delivery: string
    payments: string
    followUs: string
    quickLinks: string
    services: string
    ourFleet: string
    reservations: string
    support: string
    rightsReserved: string
  }
  vehicleDetails: {
    title: string
    gallery: string
    specifications: string
    features: string
    description: string
    bookThisVehicle: string
    backToFleet: string
    pricePerDay: string
    vehicleSpecs: string
    included: string
    noImages: string
  }
}

export type Locale = "en" | "es" | "fr"
