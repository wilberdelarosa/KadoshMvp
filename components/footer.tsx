"use client"

import { useI18n } from "@/context/i18n-context"
import {
  Phone,
  Mail,
  MapPin,
  Car,
  CreditCard,
  Plane,
  Ship,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  const { t, locale } = useI18n()

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
    <footer className="bg-kadoshBlack-light text-gray-300 py-16 px-4 sm:px-6 border-t border-kadoshGreen-DEFAULT/20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image src="/kadosh-logo.jpg" alt="Kadosh RentCar Logo" width={60} height={60} className="rounded-lg" />
              <div>
                <p className="text-kadoshGreen-DEFAULT text-xl font-bold">{t("appName", "common")}</p>
                <p className="text-sm text-gray-400">RentCar Punta Cana</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{t("availability", "footer")}</p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-kadoshGreen-DEFAULT text-lg font-semibold mb-4">{t("contactUs", "footer")}</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={handlePhone}
                  className="flex items-center gap-3 text-sm hover:text-kadoshGreen-DEFAULT transition-colors"
                >
                  <Phone size={18} className="text-kadoshGreen-DEFAULT" />
                  <span>829-939-1365</span>
                </button>
              </li>
              <li>
                <button
                  onClick={handleEmail}
                  className="flex items-center gap-3 text-sm hover:text-kadoshGreen-DEFAULT transition-colors"
                >
                  <Mail size={18} className="text-kadoshGreen-DEFAULT" />
                  <span>kadoshrentcarpc@gmail.com</span>
                </button>
              </li>
              <li>
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center gap-3 text-sm hover:text-kadoshGreen-DEFAULT transition-colors"
                >
                  <MessageCircle size={18} className="text-green-500" />
                  <span>{t("whatsapp", "common")}</span>
                </button>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <MapPin size={18} className="text-kadoshGreen-DEFAULT" />
                <span>Aeropuerto Punta Cana, Punta Cana 23000</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-kadoshGreen-DEFAULT text-lg font-semibold mb-4">{t("quickLinks", "footer")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-gray-400 hover:text-kadoshGreen-DEFAULT transition-colors text-sm"
                >
                  {t("ourFleet", "footer")}
                </Link>
              </li>
              <li>
                <button
                  onClick={handleWhatsApp}
                  className="text-gray-400 hover:text-kadoshGreen-DEFAULT transition-colors text-sm text-left"
                >
                  {t("reservations", "footer")}
                </button>
              </li>
              <li>
                <button
                  onClick={handleEmail}
                  className="text-gray-400 hover:text-kadoshGreen-DEFAULT transition-colors text-sm text-left"
                >
                  {t("support", "footer")}
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-kadoshGreen-DEFAULT text-lg font-semibold mb-4">{t("services", "footer")}</h3>
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-sm">
                <Car size={16} className="text-kadoshGreen-DEFAULT" />
                <span>{t("availability", "footer")}</span>
              </p>
              <p className="flex items-center gap-2 text-sm">
                <Plane size={16} className="text-kadoshGreen-DEFAULT" />
                <Ship size={16} className="text-kadoshGreen-DEFAULT" />
                <span>{t("delivery", "footer")}</span>
              </p>
              <p className="flex items-center gap-2 text-sm">
                <CreditCard size={16} className="text-kadoshGreen-DEFAULT" />
                <span>{t("payments", "footer")}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} {t("rightsReserved", "footer")}
              </p>
              <p className="text-xs text-gray-600">Punta Cana, Dominican Republic</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-kadoshGreen-DEFAULT font-medium">{t("followUs", "footer")}:</span>
              <div className="flex gap-3">
                <a href="#" className="text-gray-400 hover:text-kadoshGreen-DEFAULT transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-kadoshGreen-DEFAULT transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-kadoshGreen-DEFAULT transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
