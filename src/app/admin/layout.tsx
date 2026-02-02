'use client'

import { SessionProvider } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [status, router, pathname])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (!session) {
    return null
  }

  const menuItems = [
    { href: '/admin', label: 'لوحة التحكم', icon: '📊' },
    { href: '/admin/contacts', label: 'الرسائل', icon: '✉️' },
    { href: '/admin/portfolio', label: 'المعرض', icon: '🎨' },
    { href: '/admin/testimonials', label: 'التوصيات', icon: '⭐' },
    { href: '/admin/team', label: 'الفريق', icon: '👥' },
    { href: '/admin/services', label: 'الخدمات', icon: '🛠️' },
    { href: '/admin/stats', label: 'الإحصائيات', icon: '📈' },
    { href: '/admin/newsletter', label: 'النشرة البريدية', icon: '📧' },
  ]

  return (
    <div className="min-h-screen bg-gray-900 flex" dir="rtl">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 border-l border-gray-700 transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-white">Lumina Admin</h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            >
              {sidebarOpen ? '→' : '←'}
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
              {session.user?.name?.[0] || 'A'}
            </div>
            {sidebarOpen && (
              <div>
                <p className="text-white font-medium">{session.user?.name || 'Admin'}</p>
                <p className="text-gray-400 text-sm">{session.user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className={`${sidebarOpen ? 'w-full' : 'w-12'} py-2 px-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2`}
          >
            <span>🚪</span>
            {sidebarOpen && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  )
}
