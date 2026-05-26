import { routing } from '@/i18n/routing'
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware(routing)

const protectedPaths = ['/playground', '/settings']

function isProtectedPath(pathname: string): boolean {
  const stripped = pathname.replace(/^\/(fr|es)/, '')
  return protectedPaths.some((p) => stripped === p || stripped.startsWith(p + '/'))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip internal Next.js / static routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Lightweight session check via cookie (full verification happens in server components)
  if (isProtectedPath(pathname)) {
    const sessionCookie =
      request.cookies.get('better-auth.session_token') ??
      request.cookies.get('better-auth.session-token')

    if (!sessionCookie) {
      const locale = pathname.match(/^\/(fr|es)/)?.[1] ?? ''
      const loginPath = locale ? `/${locale}/login` : '/login'
      return NextResponse.redirect(new URL(loginPath, request.url))
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
