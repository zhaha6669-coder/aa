import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Allow access to login page
    if (pathname === '/admin/login') {
      if (token) {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
      return NextResponse.next()
    }

    // Protect all other admin routes
    if (pathname.startsWith('/admin')) {
      if (!token) {
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Always allow login page
        if (pathname === '/admin/login') {
          return true
        }
        
        // Allow API routes (they have their own auth)
        if (pathname.startsWith('/api/')) {
          return true
        }
        
        // Require auth for admin pages
        if (pathname.startsWith('/admin')) {
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*']
}
