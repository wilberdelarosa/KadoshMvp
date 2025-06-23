import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/context/i18n-context" // Import I18nProvider

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kadosh RentCar Punta Cana",
  description: "Vehicle rental services in Punta Cana. Reserve your car today!",,
  // TODO: Add more metadata like open graph tags, icons etc.
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: { lang: string } // lang will be passed from [lang] segment
}>) {
  const lang = params.lang || "en" // Default to 'en' if not present

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // Kadosh is dark by default
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider initialLocale={lang as "en" | "es" | "fr"}>
            <Navbar />
            {children}
            <Footer />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
