"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/context/i18n-context"
import type { Locale } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Mail, Phone, Menu, X } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { locale, setLocale, t } = useI18n()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale as Locale)
    // Update URL to reflect language change
    const currentPath = window.location.pathname
    const pathWithoutLang = currentPath.replace(/^\/(en|es|fr)/, "")
    router.push(`/${newLocale}${pathWithoutLang}`)
  }

  const handleWhatsApp = () => {
    window.open("https://wa.me/18299391365", "_blank")
  }

  const handleEmail = () => {
    window.open("mailto:kadoshrentcarpc@gmail.com", "_blank")
  }

  const handlePhone = () => {
    window.open("tel:+18299391365", "_blank")
  }

  return (
    <nav className="bg-kadoshBlack-light/95 backdrop-blur-md text-white py-4 px-4 sm:px-6 sticky top-0 z-50 shadow-lg border-b border-kadoshGreen-DEFAULT/20">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={`/${locale}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image src="/kadosh-logo.jpg" alt="Kadosh RentCar Logo" width={60} height={60} className="rounded-lg" />
          <div className="hidden sm:block">
            <span className="text-2xl font-bold text-kadoshGreen-DEFAULT">{t("appName", "common")}</span>
            <p className="text-sm text-gray-400">Punta Cana</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <Link
            href={`/${locale}#vehicles`}
            className="text-gray-300 hover:text-kadoshGreen-DEFAULT transition-colors duration-200 font-medium"
          >
            {t("vehicles", "navigation")}
          </Link>

          <Button
            onClick={handleWhatsApp}
            variant="outline"
            size="sm"
            className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white gap-2"
          >
            <MessageCircle size={16} />
            {t("whatsapp", "navigation")}
          </Button>

          <Button
            onClick={handleEmail}
            variant="outline"
            size="sm"
            className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white gap-2"
          >
            <Mail size={16} />
            {t("email", "navigation")}
          </Button>

          <Button
            onClick={handlePhone}
            variant="outline"
            size="sm"
            className="border-kadoshGreen-DEFAULT text-kadoshGreen-DEFAULT hover:bg-kadoshGreen-DEFAULT hover:text-kadoshBlack-DEFAULT gap-2"
          >
            <Phone size={16} />
            {t("phone", "navigation")}
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Select value={locale} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[100px] bg-kadoshBlack-DEFAULT border-kadoshGreen-DEFAULT/30 text-white hover:border-kadoshGreen-DEFAULT">
              <SelectValue placeholder={t("language", "common")} />
            </SelectTrigger>
            <SelectContent className="bg-kadoshBlack-DEFAULT text-white border-kadoshGreen-DEFAULT/30">
              <SelectItem value="en" className="hover:bg-kadoshGreen-DEFAULT hover:text-kadoshBlack-DEFAULT">
                English
              </SelectItem>
              <SelectItem value="es" className="hover:bg-kadoshGreen-DEFAULT hover:text-kadoshBlack-DEFAULT">
                Español
              </SelectItem>
              <SelectItem value="fr" className="hover:bg-kadoshGreen-DEFAULT hover:text-kadoshBlack-DEFAULT">
                Français
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-kadoshGreen-DEFAULT"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 pb-4 border-t border-kadoshGreen-DEFAULT/20">
          <div className="flex flex-col gap-4 mt-4">
            <Link
              href={`/${locale}#vehicles`}
              className="text-gray-300 hover:text-kadoshGreen-DEFAULT transition-colors duration-200 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("vehicles", "navigation")}
            </Link>

            <div className="flex flex-col gap-2">
              <Button
                onClick={handleWhatsApp}
                variant="outline"
                size="sm"
                className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white gap-2 justify-start"
              >
                <MessageCircle size={16} />
                {t("whatsapp", "navigation")}
              </Button>

              <Button
                onClick={handleEmail}
                variant="outline"
                size="sm"
                className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white gap-2 justify-start"
              >
                <Mail size={16} />
                {t("email", "navigation")}
              </Button>

              <Button
                onClick={handlePhone}
                variant="outline"
                size="sm"
                className="border-kadoshGreen-DEFAULT text-kadoshGreen-DEFAULT hover:bg-kadoshGreen-DEFAULT hover:text-kadoshBlack-DEFAULT gap-2 justify-start"
              >
                <Phone size={16} />
                {t("phone", "navigation")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
