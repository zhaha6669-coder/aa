'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Testimonial {
  id: string
  quote: string
  quoteAr: string | null
  authorName: string
  authorRole: string | null
  authorRoleAr: string | null
  authorCompany: string | null
  authorImage: string | null
  rating: number
  featured: boolean
  approved: boolean
  displayOrder: number
  createdAt: string
}

const emptyTestimonial = {
  quote: '',
  quoteAr: '',
  authorName: '',
  authorRole: '',
  authorRoleAr: '',
  authorCompany: '',
  authorImage: '',
  rating: 5,
  featured: false,
  approved: true,
  displayOrder: 0,
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<typeof emptyTestimonial | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials?admin=true')
      const data = await res.json()
      if (data.success) {
        setTestimonials(data.data)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editingTestimonial) return
    setSaving(true)

    try {
      const url = editingId 
        ? `/api/testimonials/${editingId}`
        : '/api/testimonials'
      
      const method = editingId ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTestimonial)
      })

      const data = await res.json()

      if (data.success) {
        fetchTestimonials()
        setIsEditing(false)
        setEditingTestimonial(null)
        setEditingId(null)
      } else {
        alert(data.error || 'حدث خطأ')
      }
    } catch (error) {
      console.error('Error saving testimonial:', error)
      alert('حدث خطأ في حفظ التوصية')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه التوصية؟')) return

    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchTestimonials()
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error)
    }
  }

  const toggleApproval = async (id: string, approved: boolean) => {
    try {
      await fetch(`/api/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: !approved })
      })
      fetchTestimonials()
    } catch (error) {
      console.error('Error toggling approval:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (isEditing && editingTestimonial) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">
            {editingId ? 'تعديل التوصية' : 'إضافة توصية جديدة'}
          </h1>
          <button
            onClick={() => {
              setIsEditing(false)
              setEditingTestimonial(null)
              setEditingId(null)
            }}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            إلغاء
          </button>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quote */}
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm mb-2">نص التوصية (إنجليزي) *</label>
              <textarea
                value={editingTestimonial.quote}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
                dir="ltr"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm mb-2">نص التوصية (عربي)</label>
              <textarea
                value={editingTestimonial.quoteAr || ''}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quoteAr: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
              />
            </div>

            {/* Author Info */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">اسم الكاتب *</label>
              <input
                type="text"
                value={editingTestimonial.authorName}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, authorName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">الشركة</label>
              <input
                type="text"
                value={editingTestimonial.authorCompany || ''}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, authorCompany: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">المنصب (إنجليزي)</label>
              <input
                type="text"
                value={editingTestimonial.authorRole || ''}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, authorRole: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">المنصب (عربي)</label>
              <input
                type="text"
                value={editingTestimonial.authorRoleAr || ''}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, authorRoleAr: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">التقييم</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEditingTestimonial({ ...editingTestimonial, rating: star })}
                    className={`text-3xl transition-colors ${
                      star <= editingTestimonial.rating ? 'text-yellow-400' : 'text-gray-600'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center gap-6 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingTestimonial.featured}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, featured: e.target.checked })}
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-white">توصية مميزة</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingTestimonial.approved}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, approved: e.target.checked })}
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-green-600 focus:ring-green-500"
                />
                <span className="text-white">معتمدة للنشر</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-700">
            <button
              onClick={() => {
                setIsEditing(false)
                setEditingTestimonial(null)
                setEditingId(null)
              }}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !editingTestimonial.quote || !editingTestimonial.authorName}
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
        <h1 className="text-3xl font-bold text-white">التوصيات</h1>
        <button
          onClick={() => {
            setEditingTestimonial({ ...emptyTestimonial })
            setEditingId(null)
            setIsEditing(true)
          }}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <span>➕</span>
          إضافة توصية
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div className="bg-gray-800 rounded-2xl p-12 text-center">
          <p className="text-5xl mb-4">⭐</p>
          <p className="text-gray-400 text-lg">لا توجد توصيات بعد</p>
          <button
            onClick={() => {
              setEditingTestimonial({ ...emptyTestimonial })
              setIsEditing(true)
            }}
            className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            أضف أول توصية
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.authorName[0]}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{testimonial.authorName}</h3>
                    <p className="text-gray-400 text-sm">
                      {testimonial.authorRole}
                      {testimonial.authorCompany && ` @ ${testimonial.authorCompany}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {testimonial.featured && (
                    <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded text-xs">مميزة</span>
                  )}
                  <span className={`px-2 py-1 rounded text-xs ${
                    testimonial.approved 
                      ? 'bg-green-600/20 text-green-400'
                      : 'bg-red-600/20 text-red-400'
                  }`}>
                    {testimonial.approved ? 'معتمدة' : 'بانتظار الموافقة'}
                  </span>
                </div>
              </div>

              <p className="text-gray-300 mb-4 line-clamp-3">&quot;{testimonial.quote}&quot;</p>

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}>
                    ⭐
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-700">
                <button
                  onClick={() => toggleApproval(testimonial.id, testimonial.approved)}
                  className={`flex-1 py-2 rounded-lg transition-colors text-sm ${
                    testimonial.approved
                      ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400'
                      : 'bg-green-600/20 hover:bg-green-600/30 text-green-400'
                  }`}
                >
                  {testimonial.approved ? '❌ إلغاء الموافقة' : '✅ الموافقة'}
                </button>
                <button
                  onClick={() => {
                    setEditingTestimonial({
                      quote: testimonial.quote,
                      quoteAr: testimonial.quoteAr || '',
                      authorName: testimonial.authorName,
                      authorRole: testimonial.authorRole || '',
                      authorRoleAr: testimonial.authorRoleAr || '',
                      authorCompany: testimonial.authorCompany || '',
                      authorImage: testimonial.authorImage || '',
                      rating: testimonial.rating,
                      featured: testimonial.featured,
                      approved: testimonial.approved,
                      displayOrder: testimonial.displayOrder,
                    })
                    setEditingId(testimonial.id)
                    setIsEditing(true)
                  }}
                  className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
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
