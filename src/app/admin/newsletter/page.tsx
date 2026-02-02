'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Subscriber {
  id: string
  email: string
  isActive: boolean
  subscribedAt: string
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchSubscribers()
  }, [page])

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/newsletter?page=${page}&limit=20`)
      const data = await res.json()
      if (data.success) {
        setSubscribers(data.data)
        setTotal(data.pagination.total)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportEmails = () => {
    const emails = subscribers.map(s => s.email).join('\n')
    const blob = new Blob([emails], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'newsletter-subscribers.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading && subscribers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">النشرة البريدية</h1>
          <p className="text-gray-400 mt-1">إجمالي المشتركين: {total}</p>
        </div>
        <button
          onClick={exportEmails}
          disabled={subscribers.length === 0}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          📥 تصدير البريد الإلكتروني
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500 to-emerald-500 p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">إجمالي المشتركين</p>
              <p className="text-4xl font-bold text-white mt-2">{total}</p>
            </div>
            <span className="text-4xl">📧</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">هذا الشهر</p>
              <p className="text-4xl font-bold text-white mt-2">
                {subscribers.filter(s => {
                  const subDate = new Date(s.subscribedAt)
                  const now = new Date()
                  return subDate.getMonth() === now.getMonth() && subDate.getFullYear() === now.getFullYear()
                }).length}
              </p>
            </div>
            <span className="text-4xl">📈</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">نشطين</p>
              <p className="text-4xl font-bold text-white mt-2">
                {subscribers.filter(s => s.isActive).length}
              </p>
            </div>
            <span className="text-4xl">✅</span>
          </div>
        </motion.div>
      </div>

      {/* Subscribers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800 rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">قائمة المشتركين</h2>

        {subscribers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-400">لا يوجد مشتركين بعد</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-gray-700">
                    <th className="text-right pb-4">#</th>
                    <th className="text-right pb-4">البريد الإلكتروني</th>
                    <th className="text-right pb-4">الحالة</th>
                    <th className="text-right pb-4">تاريخ الاشتراك</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber, index) => (
                    <tr key={subscriber.id} className="border-b border-gray-700/50 text-white">
                      <td className="py-4 text-gray-400">{(page - 1) * 20 + index + 1}</td>
                      <td className="py-4">{subscriber.email}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                          subscriber.isActive 
                            ? 'bg-green-600/20 text-green-400'
                            : 'bg-red-600/20 text-red-400'
                        }`}>
                          {subscriber.isActive ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td className="py-4 text-gray-400">
                        {new Date(subscriber.subscribedAt).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
                >
                  السابق
                </button>
                <span className="text-gray-400">
                  صفحة {page} من {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
                >
                  التالي
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}
