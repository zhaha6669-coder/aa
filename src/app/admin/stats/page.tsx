'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Stats {
  projects_completed: number
  happy_clients: number
  satisfaction_rate: number
  years_experience: number
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats>({
    projects_completed: 50,
    happy_clients: 30,
    satisfaction_rate: 98,
    years_experience: 5,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/stats', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats)
      })

      const data = await res.json()
      if (data.success) {
        alert('تم حفظ الإحصائيات بنجاح')
      }
    } catch (error) {
      console.error('Error saving stats:', error)
      alert('حدث خطأ في حفظ الإحصائيات')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  const statItems = [
    { key: 'projects_completed', label: 'المشاريع المنجزة', icon: '🎨', suffix: '+' },
    { key: 'happy_clients', label: 'العملاء السعداء', icon: '😊', suffix: '+' },
    { key: 'satisfaction_rate', label: 'نسبة الرضا', icon: '⭐', suffix: '%' },
    { key: 'years_experience', label: 'سنوات الخبرة', icon: '📅', suffix: '+' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">الإحصائيات</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <>
              <span className="animate-spin">⏳</span>
              جاري الحفظ...
            </>
          ) : (
            <>💾 حفظ التغييرات</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statItems.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{item.icon}</span>
              <div>
                <h3 className="text-white font-semibold">{item.label}</h3>
                <p className="text-gray-400 text-sm">القيمة الحالية: {stats[item.key as keyof Stats]}{item.suffix}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="range"
                min={item.key === 'satisfaction_rate' ? 0 : 0}
                max={item.key === 'satisfaction_rate' ? 100 : 500}
                value={stats[item.key as keyof Stats]}
                onChange={(e) => setStats({ ...stats, [item.key]: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <input
                type="number"
                min={0}
                max={item.key === 'satisfaction_rate' ? 100 : 9999}
                value={stats[item.key as keyof Stats]}
                onChange={(e) => setStats({ ...stats, [item.key]: parseInt(e.target.value) || 0 })}
                className="w-24 px-3 py-2 bg-gray-700 text-white text-center rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">المعروض في الموقع:</span>
                <span className="text-white font-bold text-xl">
                  {stats[item.key as keyof Stats]}{item.suffix}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Preview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl p-8"
      >
        <h2 className="text-xl font-bold text-white mb-6 text-center">معاينة كيف ستظهر في الموقع</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statItems.map((item) => (
            <div key={item.key} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stats[item.key as keyof Stats]}{item.suffix}
              </p>
              <p className="text-gray-300">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
