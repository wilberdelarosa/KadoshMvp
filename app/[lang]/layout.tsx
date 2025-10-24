import type { ReactNode } from "react"

import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import { I18nProvider } from "@/context/i18n-context"
import type { Locale } from "@/lib/types"

const SUPPORTED_LOCALES: Locale[] = ["en", "es", "fr"]
const isLocale = (value: string): value is Locale => (SUPPORTED_LOCALES as string[]).includes(value)

export default function LangLayout({
  children,
  params,
}: {
  children: ReactNode
  params: { lang: string }
}) {
  const langParam = params.lang
  const currentLocale: Locale = isLocale(langParam) ? langParam : "en"

  return (
    <I18nProvider initialLocale={currentLocale}>
      <Navbar />
      {children}
      <Footer />
    </I18nProvider>
  )
}
