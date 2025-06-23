"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Translations, Locale } from "@/lib/types"

// Import TypeScript translation modules
import en from "@/locales/en"
import es from "@/locales/es"
import fr from "@/locales/fr"

interface I18nContextType {
  translations: Translations
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, section?: keyof Translations) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const allTranslations: Record<Locale, Translations> = {
  en,
  es,
  fr,
}

export const I18nProvider = ({ children, initialLocale = "en" }: { children: ReactNode; initialLocale?: Locale }) => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const [translations, setTranslations] = useState<Translations>(allTranslations[initialLocale])

  useEffect(() => {
    setTranslations(allTranslations[locale])
  }, [locale])

  const setLocale = (newLocale: Locale) => {
    if (allTranslations[newLocale]) setLocaleState(newLocale)
  }

  const t = (key: string, section: keyof Translations = "common") => {
    const keys = key.split(".")
    let current: any = translations[section]
    for (const k of keys) {
      if (current && typeof current === "object" && k in current) current = current[k]
      else return key
    }
    return typeof current === "string" ? current : key
  }

  return <I18nContext.Provider value={{ translations, locale, setLocale, t }}>{children}</I18nContext.Provider>
}

export const useI18n = () => {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}
