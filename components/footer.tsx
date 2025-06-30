"use client"

import Link from "next/link"
import Image from "next/image"
import { useI18n } from "@/context/i18n-context"
import { Mail, Phone, MapPin, PhoneIcon as Whatsapp } from "lucide-react"

export default function Footer() {
  const { t, locale } = useI18n()

  return (
    <footer className="bg-kadoshBlack-DEFAULT text-gray-300 py-12 px-4 border-t border-gray-800">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Company Info */}
        <div className="space-y-4">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <Image src="/kadosh-logo.jpg" alt="Kadosh RentCar Logo" width={60} height={60} className="rounded-full" />
            <span className="text-2xl font-bold text-kadoshGreen-DEFAULT">Kadosh RentCar</span>
          </Link>
          <p className="text-sm leading-relaxed">{t("footerDescription", "footer")}</p>
          <div className="flex space-x-4 mt-4">
            {/* Social Media Icons - Placeholder for now */}
            {/* <Link href="#" className="text-gray-400 hover:text-kadoshGreen-DEFAULT transition-colors">
              <Facebook size={24} />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-kadoshGreen-DEFAULT transition-colors">
              <Instagram size={24} />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-kadoshGreen-DEFAULT transition-colors">
              <Twitter size={24} />
            </Link> */}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-kadoshGreen-DEFAULT mb-6">{t("quickLinks", "footer")}</h3>
          <ul className="space-y-3">
            <li>
              <Link href={`/${locale}#vehicles`} className="hover:text-kadoshGreen-DEFAULT transition-colors">
                {t("vehicleCatalog", "common")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/terms`} className="hover:text-kadoshGreen-DEFAULT transition-colors">
                {t("termsAndConditions", "footer")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/privacy`} className="hover:text-kadoshGreen-DEFAULT transition-colors">
                {t("privacyPolicy", "footer")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold text-kadoshGreen-DEFAULT mb-6">{t("contactUs", "footer")}</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <MapPin size={20} className="text-kadoshGreen-DEFAULT" />
              <span>{t("address", "footer")}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={20} className="text-kadoshGreen-DEFAULT" />
              <a href="tel:+18299391365" className="hover:text-kadoshGreen-DEFAULT transition-colors">
                +1 (829) 939-1365
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={20} className="text-kadoshGreen-DEFAULT" />
              <a href="mailto:kadoshrentcarpc@gmail.com" className="hover:text-kadoshGreen-DEFAULT transition-colors">
                kadoshrentcarpc@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Whatsapp size={20} className="text-kadoshGreen-DEFAULT" />
              <a
                href="https://wa.me/18299391365"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-kadoshGreen-DEFAULT transition-colors"
              >
                {t("whatsapp", "common")}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Kadosh RentCar. {t("allRightsReserved", "footer")}
      </div>
    </footer>
  )
}
