"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, Menu, Mail, Phone, PhoneIcon as Whatsapp } from "lucide-react"
import { useI18n } from "@/context/i18n-context"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { t, locale, setLocale } = useI18n()
  const router = useRouter()

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale)
    router.push(`/${newLocale}`)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-kadoshBlack-DEFAULT/90 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <Image src="/kadosh-logo.jpg" alt="Kadosh RentCar Logo" width={60} height={60} className="rounded-full" />
          <span className="text-xl font-bold text-kadoshGreen-DEFAULT">Kadosh RentCar</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Button
            variant="ghost"
            className="text-gray-300 hover:text-kadoshGreen-DEFAULT hover:bg-transparent"
            onClick={() => window.open("https://wa.me/18299391365", "_blank")}
          >
            <Whatsapp size={20} className="mr-2" />
            {t("whatsapp", "common")}
          </Button>
          <Button
            variant="ghost"
            className="text-gray-300 hover:text-kadoshGreen-DEFAULT hover:bg-transparent"
            onClick={() => (window.location.href = "mailto:kadoshrentcarpc@gmail.com")}
          >
            <Mail size={20} className="mr-2" />
            {t("email", "common")}
          </Button>
          <Button
            variant="ghost"
            className="text-gray-300 hover:text-kadoshGreen-DEFAULT hover:bg-transparent"
            onClick={() => (window.location.href = "tel:+18299391365")}
          >
            <Phone size={20} className="mr-2" />
            +1 (829) 939-1365
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-gray-300 hover:text-kadoshGreen-DEFAULT hover:bg-transparent">
                <Globe size={20} className="mr-2" />
                {locale.toUpperCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-kadoshGreen-DEFAULT">
              <DropdownMenuItem onClick={() => handleLanguageChange("en")}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange("es")}>Español</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange("fr")}>Français</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-kadoshGreen-DEFAULT">
                <Menu size={24} />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 bg-card border-kadoshGreen-DEFAULT">
              <DropdownMenuItem onClick={() => window.open("https://wa.me/18299391365", "_blank")}>
                <Whatsapp size={20} className="mr-2" />
                {t("whatsapp", "common")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => (window.location.href = "mailto:kadoshrentcarpc@gmail.com")}>
                <Mail size={20} className="mr-2" />
                {t("email", "common")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => (window.location.href = "tel:+18299391365")}>
                <Phone size={20} className="mr-2" />
                +1 (829) 939-1365
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:text-kadoshGreen-DEFAULT hover:bg-transparent"
                    >
                      <Globe size={20} className="mr-2" />
                      {locale.toUpperCase()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start" className="bg-card border-kadoshGreen-DEFAULT">
                    <DropdownMenuItem onClick={() => handleLanguageChange("en")}>English</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleLanguageChange("es")}>Español</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleLanguageChange("fr")}>Français</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
