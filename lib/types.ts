export type Locale = "en" | "es" | "fr"

export interface Vehicle {
  id: string
  name: string
  category: "sedan" | "suv" | "minivan" | "compact" | "luxury" | "sport"
  images: string[]
  seats: number
  engine: string
  pricePerDay: number
  description?: string
  features?: string[]
}

export interface ReservationFormData {
  vehicleId: string
  pickupDate: Date
  returnDate: Date
  name: string
  email: string
  phone: string
  message?: string
}

export interface Dictionary {
  common: {
    whatsapp: string
    email: string
    phone: string
    seats: string
    engine: string
    reserve: string
    close: string
    viewDetails: string
    allCategories: string
    category: string
    searchByName: string
    clearFilters: string
    minPrice: string
    maxPrice: string
    minSeats: string
    reserveNow: string
    submit: string
    success: string
    error: string
    loading: string
    name: string
    pickupDate: string
    returnDate: string
    message: string
    required: string
    invalidEmail: string
    invalidPhone: string
    dateRangeError: string
    thankYou: string
    reservationConfirmed: string
    weWillContactYou: string
    ok: string
    sending: string
    contactInfo: string
    address: string
    selectDate: string
    selectDates: string
    pickupLocation: string
    returnLocation: string
    fullName: string
    emailAddress: string
    phoneNumber: string
    additionalNotes: string
    reservationDetails: string
    vehicle: string
    pickup: string
    return: string
    totalPrice: string
    perDay: string
    startingFrom: string
    termsAndConditions: string
    privacyPolicy: string
    vehicleCatalog: string
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
  vehicleCatalog: {
    title: string
    subtitle: string
    searchPlaceholder: string
    filters: string
    noVehicles: string
    tryDifferentFilters: string
  }
  vehicleDetails: {
    gallery: string
    specifications: string
    noImages: string
    availability: {
      available: string
      unavailable: string
      on_request: string
    }
  }
  categories: {
    sedan: string
    suv: string
    minivan: string
    compact: string
    luxury: string
    sport: string
  }
  footer: {
    footerDescription: string
    quickLinks: string
    contactUs: string
    address: string
    allRightsReserved: string
    termsAndConditions: string
    privacyPolicy: string
  }
}
