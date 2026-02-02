'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Contact {
  id: string
  name: string
  email: string
  phone: string | null
  projectType: string
  budget: string | null
  message: string
  status: string
  notes: string | null
  createdAt: string
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchContacts()
  }, [statusFilter, page])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(statusFilter && { status: statusFilter })
      })
      
      const res = await fetch(`/api/contact?${params}`)
      const data = await res.json()
      
      if (data.success) {
        setContacts(data.data)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      if (res.ok) {
        fetchContacts()
        if (selectedContact?.id === id) {
          setSelectedContact({ ...selectedContact, status })
        }
      }
    } catch (error) {
      console.error('Error updating contact:', error)
    }
  }

  const updateNotes = async (id: string, notes: string) => {
    try {
      await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      })
    } catch (error) {
      console.error('Error updating notes:', error)
    }
  }

  const deleteContact = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return
    
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchContacts()
        setSelectedContact(null)
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: 'bg-green-600/20 text-green-400',
      contacted: 'bg-blue-600/20 text-blue-400',
      qualified: 'bg-purple-600/20 text-purple-400',
      converted: 'bg-yellow-600/20 text-yellow-400',
      rejected: 'bg-red-600/20 text-red-400',
    }
    const labels: Record<string, string> = {
      new: 'جديد',
      contacted: 'تم التواصل',
      qualified: 'مؤهل',
      converted: 'تم التحويل',
      rejected: 'مرفوض',
    }
    return (
      <span className={`px-2 py-1 rounded text-sm ${styles[status] || styles.new}`}>
        {labels[status] || status}
      </span>
    )
  }

  const getProjectTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      web: 'تطوير ويب',
      mobile: 'تطبيق موبايل',
      uiux: 'تصميم UI/UX',
      other: 'أخرى',
    }
    return labels[type] || type
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">الرسائل</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">كل الحالات</option>
          <option value="new">جديد</option>
          <option value="contacted">تم التواصل</option>
          <option value="qualified">مؤهل</option>
          <option value="converted">تم التحويل</option>
          <option value="rejected">مرفوض</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts List */}
        <div className="lg:col-span-2 bg-gray-800 rounded-2xl p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : contacts.length === 0 ? (
            <p className="text-gray-400 text-center py-8">لا توجد رسائل</p>
          ) : (
            <>
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 rounded-xl cursor-pointer transition-colors ${
                      selectedContact?.id === contact.id
                        ? 'bg-purple-600/20 border border-purple-500'
                        : 'bg-gray-700/50 hover:bg-gray-700'
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-semibold">{contact.name}</h3>
                        <p className="text-gray-400 text-sm">{contact.email}</p>
                      </div>
                      {getStatusBadge(contact.status)}
                    </div>
                    <p className="text-gray-300 text-sm mt-2 line-clamp-2">{contact.message}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span>{getProjectTypeLabel(contact.projectType)}</span>
                      <span>•</span>
                      <span>{new Date(contact.createdAt).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
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
            </>
          )}
        </div>

        {/* Contact Details */}
        <div className="bg-gray-800 rounded-2xl p-6">
          {selectedContact ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">تفاصيل الرسالة</h2>
                <button
                  onClick={() => deleteContact(selectedContact.id)}
                  className="p-2 text-red-400 hover:bg-red-600/20 rounded-lg transition-colors"
                >
                  🗑️
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">الاسم</label>
                  <p className="text-white">{selectedContact.name}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">البريد الإلكتروني</label>
                  <p className="text-white">{selectedContact.email}</p>
                </div>
                {selectedContact.phone && (
                  <div>
                    <label className="text-gray-400 text-sm">الهاتف</label>
                    <p className="text-white">{selectedContact.phone}</p>
                  </div>
                )}
                <div>
                  <label className="text-gray-400 text-sm">نوع المشروع</label>
                  <p className="text-white">{getProjectTypeLabel(selectedContact.projectType)}</p>
                </div>
                {selectedContact.budget && (
                  <div>
                    <label className="text-gray-400 text-sm">الميزانية</label>
                    <p className="text-white">{selectedContact.budget}</p>
                  </div>
                )}
                <div>
                  <label className="text-gray-400 text-sm">الرسالة</label>
                  <p className="text-white whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">الحالة</label>
                  <select
                    value={selectedContact.status}
                    onChange={(e) => updateStatus(selectedContact.id, e.target.value)}
                    className="w-full mt-2 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="new">جديد</option>
                    <option value="contacted">تم التواصل</option>
                    <option value="qualified">مؤهل</option>
                    <option value="converted">تم التحويل</option>
                    <option value="rejected">مرفوض</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">ملاحظات</label>
                  <textarea
                    defaultValue={selectedContact.notes || ''}
                    onBlur={(e) => updateNotes(selectedContact.id, e.target.value)}
                    placeholder="أضف ملاحظاتك هنا..."
                    className="w-full mt-2 px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-center transition-colors"
                >
                  📧 إرسال بريد
                </a>
                {selectedContact.phone && (
                  <a
                    href={`tel:${selectedContact.phone}`}
                    className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-center transition-colors"
                  >
                    📞 اتصال
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-12">
              <p className="text-5xl mb-4">📬</p>
              <p>اختر رسالة لعرض التفاصيل</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
