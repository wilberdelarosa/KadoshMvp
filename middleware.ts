import { NextResponse, type NextRequest } from "next/server"

const locales = ["en", "es", "fr"]
const defaultLocale = "en"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // If no locale is in the pathname, redirect to the default locale
  // e.g. incoming request is /products -> /en/products
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|kadosh-logo.jpg|placeholder.svg|bannerPrueba.jpeg).*)",
  ],
}
