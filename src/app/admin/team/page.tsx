'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface TeamMember {
  id: string
  name: string
  nameAr: string | null
  role: string
  roleAr: string | null
  bio: string | null
  bioAr: string | null
  image: string | null
  linkedin: string | null
  twitter: string | null
  github: string | null
  displayOrder: number
  isActive: boolean
}

const emptyMember = {
  name: '',
  nameAr: '',
  role: '',
  roleAr: '',
  bio: '',
  bioAr: '',
  image: '',
  linkedin: '',
  twitter: '',
  github: '',
  displayOrder: 0,
  isActive: true,
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingMember, setEditingMember] = useState<typeof emptyMember | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/team?admin=true')
      const data = await res.json()
      if (data.success) {
        setMembers(data.data)
      }
    } catch (error) {
      console.error('Error fetching team:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editingMember) return
    setSaving(true)

    try {
      const url = editingId ? `/api/team/${editingId}` : '/api/team'
      const method = editingId ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMember)
      })

      const data = await res.json()

      if (data.success) {
        fetchMembers()
        setIsEditing(false)
        setEditingMember(null)
        setEditingId(null)
      } else {
        alert(data.error || 'حدث خطأ')
      }
    } catch (error) {
      console.error('Error saving member:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العضو؟')) return

    try {
      const res = await fetch(`/api/team/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchMembers()
      }
    } catch (error) {
      console.error('Error deleting member:', error)
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/team/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })
      fetchMembers()
    } catch (error) {
      console.error('Error toggling active:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (isEditing && editingMember) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">
            {editingId ? 'تعديل عضو الفريق' : 'إضافة عضو جديد'}
          </h1>
          <button
            onClick={() => {
              setIsEditing(false)
              setEditingMember(null)
              setEditingId(null)
            }}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            إلغاء
          </button>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2">الاسم (إنجليزي) *</label>
              <input
                type="text"
                value={editingMember.name}
                onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">الاسم (عربي)</label>
              <input
                type="text"
                value={editingMember.nameAr || ''}
                onChange={(e) => setEditingMember({ ...editingMember, nameAr: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">المنصب (إنجليزي) *</label>
              <input
                type="text"
                value={editingMember.role}
                onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">المنصب (عربي)</label>
              <input
                type="text"
                value={editingMember.roleAr || ''}
                onChange={(e) => setEditingMember({ ...editingMember, roleAr: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm mb-2">السيرة (إنجليزي)</label>
              <textarea
                value={editingMember.bio || ''}
                onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                dir="ltr"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm mb-2">السيرة (عربي)</label>
              <textarea
                value={editingMember.bioAr || ''}
                onChange={(e) => setEditingMember({ ...editingMember, bioAr: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">LinkedIn</label>
              <input
                type="url"
                value={editingMember.linkedin || ''}
                onChange={(e) => setEditingMember({ ...editingMember, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Twitter</label>
              <input
                type="url"
                value={editingMember.twitter || ''}
                onChange={(e) => setEditingMember({ ...editingMember, twitter: e.target.value })}
                placeholder="https://twitter.com/..."
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">GitHub</label>
              <input
                type="url"
                value={editingMember.github || ''}
                onChange={(e) => setEditingMember({ ...editingMember, github: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                dir="ltr"
              />
            </div>

            <div className="flex items-center pt-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingMember.isActive}
                  onChange={(e) => setEditingMember({ ...editingMember, isActive: e.target.checked })}
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-white">ظاهر في الموقع</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-700">
            <button
              onClick={() => {
                setIsEditing(false)
                setEditingMember(null)
                setEditingId(null)
              }}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !editingMember.name || !editingMember.role}
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
        <h1 className="text-3xl font-bold text-white">الفريق</h1>
        <button
          onClick={() => {
            setEditingMember({ ...emptyMember })
            setEditingId(null)
            setIsEditing(true)
          }}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <span>➕</span>
          إضافة عضو
        </button>
      </div>

      {members.length === 0 ? (
        <div className="bg-gray-800 rounded-2xl p-12 text-center">
          <p className="text-5xl mb-4">👥</p>
          <p className="text-gray-400 text-lg">لا يوجد أعضاء في الفريق بعد</p>
          <button
            onClick={() => {
              setEditingMember({ ...emptyMember })
              setIsEditing(true)
            }}
            className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            أضف أول عضو
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl">
                    {member.name[0]}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{member.name}</h3>
                    <p className="text-purple-400 text-sm">{member.role}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  member.isActive 
                    ? 'bg-green-600/20 text-green-400'
                    : 'bg-red-600/20 text-red-400'
                }`}>
                  {member.isActive ? 'ظاهر' : 'مخفي'}
                </span>
              </div>

              {member.bio && (
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{member.bio}</p>
              )}

              <div className="flex gap-2 mb-4">
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400">
                    💼
                  </a>
                )}
                {member.twitter && (
                  <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400">
                    🐦
                  </a>
                )}
                {member.github && (
                  <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                    💻
                  </a>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-700">
                <button
                  onClick={() => toggleActive(member.id, member.isActive)}
                  className={`flex-1 py-2 rounded-lg transition-colors text-sm ${
                    member.isActive
                      ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400'
                      : 'bg-green-600/20 hover:bg-green-600/30 text-green-400'
                  }`}
                >
                  {member.isActive ? '🙈 إخفاء' : '👁️ إظهار'}
                </button>
                <button
                  onClick={() => {
                    setEditingMember({
                      name: member.name,
                      nameAr: member.nameAr || '',
                      role: member.role,
                      roleAr: member.roleAr || '',
                      bio: member.bio || '',
                      bioAr: member.bioAr || '',
                      image: member.image || '',
                      linkedin: member.linkedin || '',
                      twitter: member.twitter || '',
                      github: member.github || '',
                      displayOrder: member.displayOrder,
                      isActive: member.isActive,
                    })
                    setEditingId(member.id)
                    setIsEditing(true)
                  }}
                  className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
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
