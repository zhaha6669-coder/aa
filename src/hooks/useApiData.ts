'use client'

import { useState, useEffect } from 'react'

// Generic API fetch hook
export function useApiData<T>(url: string, fallbackData: T) {
  const [data, setData] = useState<T>(fallbackData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url)
        const result = await res.json()
        
        if (result.success && result.data) {
          setData(result.data.length > 0 ? result.data : fallbackData)
        }
      } catch (err) {
        console.error(`Error fetching from ${url}:`, err)
        setError(err instanceof Error ? err.message : 'Failed to fetch')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, loading, error }
}

// Portfolio Projects Hook
export interface Project {
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
}

export function useProjects() {
  return useApiData<Project[]>('/api/portfolio', [])
}

// Testimonials Hook
export interface Testimonial {
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
}

export function useTestimonials() {
  return useApiData<Testimonial[]>('/api/testimonials', [])
}

// Team Members Hook
export interface TeamMember {
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

export function useTeamMembers() {
  return useApiData<TeamMember[]>('/api/team', [])
}

// Services Hook
export interface Service {
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

export function useServices() {
  return useApiData<Service[]>('/api/services', [])
}

// Stats Hook
export interface Stats {
  projectsCompleted: number
  happyClients: number
  satisfactionRate: number
  yearsExperience: number
}

export function useStats() {
  const [stats, setStats] = useState<Stats>({
    projectsCompleted: 0,
    happyClients: 0,
    satisfactionRate: 0,
    yearsExperience: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats')
        const result = await res.json()
        
        if (result.success) {
          setStats(result.data)
        }
      } catch (err) {
        console.error('Error fetching stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading }
}
