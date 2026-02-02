'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface DashboardStats {
  contacts: { total: number; new: number }
  projects: { total: number; published: number }
  testimonials: { total: number; pending: number }
  subscribers: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [recentContacts, setRecentContacts] = useState<Array<{
    id: string
    name: string
    email: string
    projectType: string
    status: string
    createdAt: string
  }>>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [contactsRes, projectsRes, testimonialsRes, subscribersRes] = await Promise.all([
        fetch('/api/contact?limit=5'),
        fetch('/api/portfolio?admin=true'),
        fetch('/api/testimonials?admin=true'),
        fetch('/api/newsletter?limit=1'),
      ])

      const contacts = await contactsRes.json()
      const projects = await projectsRes.json()
      const testimonials = await testimonialsRes.json()
      const subscribers = await subscribersRes.json()

      setStats({
        contacts: {
          total: contacts.pagination?.total || 0,
          new: contacts.data?.filter((c: { status: string }) => c.status === 'new').length || 0
        },
        projects: {
          total: projects.data?.length || 0,
          published: projects.data?.filter((p: { status: string }) => p.status === 'published').length || 0
        },
        testimonials: {
          total: testimonials.data?.length || 0,
          pending: testimonials.data?.filter((t: { approved: boolean }) => !t.approved).length || 0
        },
        subscribers: subscribers.pagination?.total || 0
      })

      setRecentContacts(contacts.data || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { 
      title: 'الرسائل', 
      value: stats?.contacts.total || 0, 
      subValue: `${stats?.contacts.new || 0} جديدة`,
      icon: '✉️',
      color: 'from-blue-500 to-cyan-500',
      href: '/admin/contacts'
    },
    { 
      title: 'المشاريع', 
      value: stats?.projects.total || 0, 
      subValue: `${stats?.projects.published || 0} منشورة`,
      icon: '🎨',
      color: 'from-purple-500 to-pink-500',
      href: '/admin/portfolio'
    },
    { 
      title: 'التوصيات', 
      value: stats?.testimonials.total || 0, 
      subValue: `${stats?.testimonials.pending || 0} بانتظار الموافقة`,
      icon: '⭐',
      color: 'from-yellow-500 to-orange-500',
      href: '/admin/testimonials'
    },
    { 
      title: 'المشتركين', 
      value: stats?.subscribers || 0, 
      subValue: 'في النشرة البريدية',
      icon: '📧',
      color: 'from-green-500 to-emerald-500',
      href: '/admin/newsletter'
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">لوحة التحكم</h1>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <span>🔄</span>
          تحديث
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.a
            key={card.title}
            href={card.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="block"
          >
            <div className={`bg-gradient-to-br ${card.color} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/80 text-sm">{card.title}</p>
                  <p className="text-4xl font-bold text-white mt-2">{card.value}</p>
                  <p className="text-white/70 text-sm mt-1">{card.subValue}</p>
                </div>
                <span className="text-4xl">{card.icon}</span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Recent Contacts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">آخر الرسائل</h2>
          <a href="/admin/contacts" className="text-purple-400 hover:text-purple-300 text-sm">
            عرض الكل ←
          </a>
        </div>

        {recentContacts.length === 0 ? (
          <p className="text-gray-400 text-center py-8">لا توجد رسائل بعد</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 text-sm border-b border-gray-700">
                  <th className="text-right pb-4">الاسم</th>
                  <th className="text-right pb-4">البريد</th>
                  <th className="text-right pb-4">نوع المشروع</th>
                  <th className="text-right pb-4">الحالة</th>
                  <th className="text-right pb-4">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {recentContacts.map((contact) => (
                  <tr key={contact.id} className="border-b border-gray-700/50 text-white">
                    <td className="py-4">{contact.name}</td>
                    <td className="py-4 text-gray-400">{contact.email}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-sm">
                        {contact.projectType}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        contact.status === 'new' 
                          ? 'bg-green-600/20 text-green-400'
                          : contact.status === 'contacted'
                          ? 'bg-blue-600/20 text-blue-400'
                          : 'bg-gray-600/20 text-gray-400'
                      }`}>
                        {contact.status === 'new' ? 'جديد' : 
                         contact.status === 'contacted' ? 'تم التواصل' :
                         contact.status === 'qualified' ? 'مؤهل' :
                         contact.status === 'converted' ? 'تم التحويل' : 'مرفوض'}
                      </span>
                    </td>
                    <td className="py-4 text-gray-400 text-sm">
                      {new Date(contact.createdAt).toLocaleDateString('ar-SA')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <a href="/admin/portfolio" className="block p-6 bg-gray-800 rounded-2xl hover:bg-gray-750 transition-colors group">
          <div className="flex items-center gap-4">
            <span className="text-3xl">➕</span>
            <div>
              <h3 className="text-white font-semibold group-hover:text-purple-400 transition-colors">إضافة مشروع</h3>
              <p className="text-gray-400 text-sm">أضف مشروعاً جديداً للمعرض</p>
            </div>
          </div>
        </a>
        <a href="/admin/testimonials" className="block p-6 bg-gray-800 rounded-2xl hover:bg-gray-750 transition-colors group">
          <div className="flex items-center gap-4">
            <span className="text-3xl">⭐</span>
            <div>
              <h3 className="text-white font-semibold group-hover:text-purple-400 transition-colors">إضافة توصية</h3>
              <p className="text-gray-400 text-sm">أضف توصية عميل جديدة</p>
            </div>
          </div>
        </a>
        <a href="/" target="_blank" className="block p-6 bg-gray-800 rounded-2xl hover:bg-gray-750 transition-colors group">
          <div className="flex items-center gap-4">
            <span className="text-3xl">🌐</span>
            <div>
              <h3 className="text-white font-semibold group-hover:text-purple-400 transition-colors">عرض الموقع</h3>
              <p className="text-gray-400 text-sm">افتح الموقع في نافذة جديدة</p>
            </div>
          </div>
        </a>
      </motion.div>
    </div>
  )
}
