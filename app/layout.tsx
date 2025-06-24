import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/context/i18n-context" // Import I18nProvider
import { use } from "react"


export const metadata: Metadata = {
  title: "Kadosh RentCar Punta Cana",
  description: "Vehicle rental services in Punta Cana. Reserve your car today!",
  // TODO: Add more metadata like open graph tags, icons etc.
  generator: "v0.dev",
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: { lang: string } // lang will be passed from [lang] segment
}>) {
  const { lang } = use(params as any) as { lang: string }
  const currentLang = ["en", "es", "fr"].includes(lang) ? lang : "en"

  return (

        
    <html lang={lang} suppressHydrationWarning>

      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // Kadosh is dark by default
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider initialLocale={currentLang as "en" | "es" | "fr"}>
            <Navbar />
            {children}
            <Footer />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
