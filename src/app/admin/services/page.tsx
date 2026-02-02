'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Service {
  id: string
  title: string
  titleAr: string | null
  slug: string
  shortDescription: string
  shortDescAr: string | null
  fullDescription: string | null
  fullDescAr: string | null
  icon: string | null
  features: string[]
  featuresAr: string[]
  pricingFrom: number | null
  displayOrder: number
  isActive: boolean
}

const emptyService = {
  title: '',
  titleAr: '',
  slug: '',
  shortDescription: '',
  shortDescAr: '',
  fullDescription: '',
  fullDescAr: '',
  icon: '🚀',
  features: [] as string[],
  featuresAr: [] as string[],
  pricingFrom: null as number | null,
  displayOrder: 0,
  isActive: true,
}

const icons = ['🚀', '💻', '📱', '🎨', '⚡', '🔧', '🌐', '📊', '🛡️', '🎯']

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingService, setEditingService] = useState<typeof emptyService | null>(null)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [featureInput, setFeatureInput] = useState('')
  const [featureInputAr, setFeatureInputAr] = useState('')

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services?admin=true')
      const data = await res.json()
      if (data.success) {
        setServices(data.data)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editingService) return
    setSaving(true)

    try {
      const url = editingSlug ? `/api/services/${editingSlug}` : '/api/services'
      const method = editingSlug ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService)
      })

      const data = await res.json()

      if (data.success) {
        fetchServices()
        setIsEditing(false)
        setEditingService(null)
        setEditingSlug(null)
      } else {
        alert(data.error || 'حدث خطأ')
      }
    } catch (error) {
      console.error('Error saving service:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return

    try {
      const res = await fetch(`/api/services/${slug}`, { method: 'DELETE' })
      if (res.ok) {
        fetchServices()
      }
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const addFeature = () => {
    if (featureInput.trim() && editingService) {
      setEditingService({
        ...editingService,
        features: [...editingService.features, featureInput.trim()]
      })
      setFeatureInput('')
    }
  }

  const addFeatureAr = () => {
    if (featureInputAr.trim() && editingService) {
      setEditingService({
        ...editingService,
        featuresAr: [...editingService.featuresAr, featureInputAr.trim()]
      })
      setFeatureInputAr('')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (isEditing && editingService) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">
            {editingSlug ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
          </h1>
          <button
            onClick={() => {
              setIsEditing(false)
              setEditingService(null)
              setEditingSlug(null)
            }}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            إلغاء
          </button>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Icon */}
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm mb-2">الأيقونة</label>
              <div className="flex flex-wrap gap-2">
                {icons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setEditingService({ ...editingService, icon })}
                    className={`text-3xl p-2 rounded-lg transition-colors ${
                      editingService.icon === icon 
                        ? 'bg-purple-600' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">العنوان (إنجليزي) *</label>
              <input
                type="text"
                value={editingService.title}
                onChange={(e) => {
                  setEditingService({ ...editingService, title: e.target.value })
                  if (!editingSlug) {
                    setEditingService(prev => prev ? { ...prev, slug: generateSlug(e.target.value) } : prev)
                  }
                }}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">العنوان (عربي)</label>
              <input
                type="text"
                value={editingService.titleAr || ''}
                onChange={(e) => setEditingService({ ...editingService, titleAr: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">الرابط (Slug) *</label>
              <input
                type="text"
                value={editingService.slug}
                onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">السعر يبدأ من ($)</label>
              <input
                type="number"
                value={editingService.pricingFrom || ''}
                onChange={(e) => setEditingService({ ...editingService, pricingFrom: e.target.value ? parseFloat(e.target.value) : null })}
                placeholder="500"
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm mb-2">الوصف المختصر (إنجليزي) *</label>
              <textarea
                value={editingService.shortDescription}
                onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
                dir="ltr"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm mb-2">الوصف المختصر (عربي)</label>
              <textarea
                value={editingService.shortDescAr || ''}
                onChange={(e) => setEditingService({ ...editingService, shortDescAr: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
              />
            </div>

            {/* Features EN */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">المميزات (إنجليزي)</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  placeholder="أضف ميزة..."
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  +
                </button>
              </div>
              <div className="space-y-2">
                {editingService.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg">
                    <span className="text-white flex-1" dir="ltr">{feature}</span>
                    <button
                      type="button"
                      onClick={() => setEditingService({
                        ...editingService,
                        features: editingService.features.filter((_, idx) => idx !== i)
                      })}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Features AR */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">المميزات (عربي)</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={featureInputAr}
                  onChange={(e) => setFeatureInputAr(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeatureAr())}
                  placeholder="أضف ميزة..."
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={addFeatureAr}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  +
                </button>
              </div>
              <div className="space-y-2">
                {editingService.featuresAr.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg">
                    <span className="text-white flex-1">{feature}</span>
                    <button
                      type="button"
                      onClick={() => setEditingService({
                        ...editingService,
                        featuresAr: editingService.featuresAr.filter((_, idx) => idx !== i)
                      })}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingService.isActive}
                  onChange={(e) => setEditingService({ ...editingService, isActive: e.target.checked })}
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-white">نشطة</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-700">
            <button
              onClick={() => {
                setIsEditing(false)
                setEditingService(null)
                setEditingSlug(null)
              }}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !editingService.title || !editingService.slug || !editingService.shortDescription}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="animate-spin">⏳</span>
                  جاري الحفظ...
                </>
              ) : (
                <>💾 حفظ</>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">الخدمات</h1>
        <button
          onClick={() => {
            setEditingService({ ...emptyService })
            setEditingSlug(null)
            setIsEditing(true)
          }}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <span>➕</span>
          إضافة خدمة
        </button>
      </div>

      {services.length === 0 ? (
        <div className="bg-gray-800 rounded-2xl p-12 text-center">
          <p className="text-5xl mb-4">🛠️</p>
          <p className="text-gray-400 text-lg">لا توجد خدمات بعد</p>
          <button
            onClick={() => {
              setEditingService({ ...emptyService })
              setIsEditing(true)
            }}
            className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            أضف أول خدمة
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{service.icon || '🚀'}</span>
                  <div>
                    <h3 className="text-white font-semibold">{service.title}</h3>
                    {service.pricingFrom && (
                      <p className="text-purple-400 text-sm">يبدأ من ${service.pricingFrom}</p>
                    )}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  service.isActive 
                    ? 'bg-green-600/20 text-green-400'
                    : 'bg-red-600/20 text-red-400'
                }`}>
                  {service.isActive ? 'نشطة' : 'معطلة'}
                </span>
              </div>

              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{service.shortDescription}</p>

              {service.features.length > 0 && (
                <div className="mb-4">
                  <p className="text-gray-500 text-xs mb-2">{service.features.length} مميزات</p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    setEditingService({
                      title: service.title,
                      titleAr: service.titleAr || '',
                      slug: service.slug,
                      shortDescription: service.shortDescription,
                      shortDescAr: service.shortDescAr || '',
                      fullDescription: service.fullDescription || '',
                      fullDescAr: service.fullDescAr || '',
                      icon: service.icon || '🚀',
                      features: service.features,
                      featuresAr: service.featuresAr,
                      pricingFrom: service.pricingFrom,
                      displayOrder: service.displayOrder,
                      isActive: service.isActive,
                    })
                    setEditingSlug(service.slug)
                    setIsEditing(true)
                  }}
                  className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                >
                  ✏️ تعديل
                </button>
                <button
                  onClick={() => handleDelete(service.slug)}
                  className="py-2 px-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors text-sm"
                >
                  🗑️
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
