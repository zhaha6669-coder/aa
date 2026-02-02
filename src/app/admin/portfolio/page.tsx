'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Project {
  id: string
  title: string
  titleAr: string | null
  slug: string
  description: string
  descriptionAr: string | null
  category: string
  technologies: string[]
  clientName: string | null
  completionDate: string | null
  featured: boolean
  images: string[]
  liveUrl: string | null
  githubUrl: string | null
  displayOrder: number
  status: string
  views: number
  createdAt: string
}

const emptyProject = {
  title: '',
  titleAr: '',
  slug: '',
  description: '',
  descriptionAr: '',
  category: 'Web',
  technologies: [] as string[],
  clientName: '',
  completionDate: '',
  featured: false,
  images: [] as string[],
  liveUrl: '',
  githubUrl: '',
  displayOrder: 0,
  status: 'draft',
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingProject, setEditingProject] = useState<typeof emptyProject | null>(null)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [techInput, setTechInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/portfolio?admin=true')
      const data = await res.json()
      if (data.success) {
        setProjects(data.data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editingProject) return
    setSaving(true)

    try {
      const url = editingSlug 
        ? `/api/portfolio/${editingSlug}`
        : '/api/portfolio'
      
      const method = editingSlug ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject)
      })

      const data = await res.json()

      if (data.success) {
        fetchProjects()
        setIsEditing(false)
        setEditingProject(null)
        setEditingSlug(null)
      } else {
        alert(data.error || 'حدث خطأ')
      }
    } catch (error) {
      console.error('Error saving project:', error)
      alert('حدث خطأ في حفظ المشروع')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return

    try {
      const res = await fetch(`/api/portfolio/${slug}`, { method: 'DELETE' })
      if (res.ok) {
        fetchProjects()
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const addTech = () => {
    if (techInput.trim() && editingProject) {
      setEditingProject({
        ...editingProject,
        technologies: [...editingProject.technologies, techInput.trim()]
      })
      setTechInput('')
    }
  }

  const removeTech = (index: number) => {
    if (editingProject) {
      setEditingProject({
        ...editingProject,
        technologies: editingProject.technologies.filter((_, i) => i !== index)
      })
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (isEditing && editingProject) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">
            {editingSlug ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
          </h1>
          <button
            onClick={() => {
              setIsEditing(false)
              setEditingProject(null)
              setEditingSlug(null)
            }}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            إلغاء
          </button>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">العنوان (إنجليزي) *</label>
              <input
                type="text"
                value={editingProject.title}
                onChange={(e) => {
                  setEditingProject({ ...editingProject, title: e.target.value })
                  if (!editingSlug) {
                    setEditingProject(prev => prev ? { ...prev, slug: generateSlug(e.target.value) } : prev)
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
                value={editingProject.titleAr || ''}
                onChange={(e) => setEditingProject({ ...editingProject, titleAr: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">الرابط (Slug) *</label>
              <input
                type="text"
                value={editingProject.slug}
                onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                dir="ltr"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">التصنيف *</label>
              <select
                value={editingProject.category}
                onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Web">Web</option>
                <option value="SaaS">SaaS</option>
                <option value="Mobile">Mobile</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm mb-2">الوصف (إنجليزي) *</label>
              <textarea
                value={editingProject.description}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                dir="ltr"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm mb-2">الوصف (عربي)</label>
              <textarea
                value={editingProject.descriptionAr || ''}
                onChange={(e) => setEditingProject({ ...editingProject, descriptionAr: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
              />
            </div>

            {/* Technologies */}
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm mb-2">التقنيات المستخدمة *</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                  placeholder="أضف تقنية..."
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={addTech}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  إضافة
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {editingProject.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full flex items-center gap-2"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTech(i)}
                      className="hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* URLs */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">رابط المشروع</label>
              <input
                type="url"
                value={editingProject.liveUrl || ''}
                onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">رابط GitHub</label>
              <input
                type="url"
                value={editingProject.githubUrl || ''}
                onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                dir="ltr"
              />
            </div>

            {/* Client & Date */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">اسم العميل</label>
              <input
                type="text"
                value={editingProject.clientName || ''}
                onChange={(e) => setEditingProject({ ...editingProject, clientName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">تاريخ الإنجاز</label>
              <input
                type="date"
                value={editingProject.completionDate || ''}
                onChange={(e) => setEditingProject({ ...editingProject, completionDate: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Status & Featured */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">الحالة</label>
              <select
                value={editingProject.status}
                onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="draft">مسودة</option>
                <option value="published">منشور</option>
              </select>
            </div>

            <div className="flex items-center gap-4 pt-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingProject.featured}
                  onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-white">مشروع مميز</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-700">
            <button
              onClick={() => {
                setIsEditing(false)
                setEditingProject(null)
                setEditingSlug(null)
              }}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !editingProject.title || !editingProject.slug || !editingProject.description || editingProject.technologies.length === 0}
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
        <h1 className="text-3xl font-bold text-white">المعرض</h1>
        <button
          onClick={() => {
            setEditingProject({ ...emptyProject })
            setEditingSlug(null)
            setIsEditing(true)
          }}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <span>➕</span>
          إضافة مشروع
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-gray-800 rounded-2xl p-12 text-center">
          <p className="text-5xl mb-4">🎨</p>
          <p className="text-gray-400 text-lg">لا توجد مشاريع بعد</p>
          <button
            onClick={() => {
              setEditingProject({ ...emptyProject })
              setIsEditing(true)
            }}
            className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            أضف أول مشروع
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-2xl overflow-hidden"
            >
              <div className="h-40 bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                <span className="text-6xl">🖼️</span>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-semibold">{project.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    project.status === 'published' 
                      ? 'bg-green-600/20 text-green-400'
                      : 'bg-yellow-600/20 text-yellow-400'
                  }`}>
                    {project.status === 'published' ? 'منشور' : 'مسودة'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.slice(0, 3).map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 bg-purple-600/20 text-purple-400 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-0.5 bg-gray-700 text-gray-400 rounded text-xs">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span>👁️</span> {project.views}
                  </span>
                  <span>{project.category}</span>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => {
                      setEditingProject({
                        title: project.title,
                        titleAr: project.titleAr || '',
                        slug: project.slug,
                        description: project.description,
                        descriptionAr: project.descriptionAr || '',
                        category: project.category,
                        technologies: project.technologies,
                        clientName: project.clientName || '',
                        completionDate: project.completionDate?.split('T')[0] || '',
                        featured: project.featured,
                        images: project.images,
                        liveUrl: project.liveUrl || '',
                        githubUrl: project.githubUrl || '',
                        displayOrder: project.displayOrder,
                        status: project.status,
                      })
                      setEditingSlug(project.slug)
                      setIsEditing(true)
                    }}
                    className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                  >
                    ✏️ تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(project.slug)}
                    className="py-2 px-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
