import { z } from 'zod'

// Contact Form Validation
export const contactSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  phone: z.string().optional(),
  projectType: z.enum(['web', 'mobile', 'uiux', 'other']),
  budget: z.string().optional(),
  message: z.string().min(10, 'الرسالة يجب أن تكون 10 أحرف على الأقل'),
})

// Project Validation
export const projectSchema = z.object({
  title: z.string().min(2, 'العنوان مطلوب'),
  titleAr: z.string().optional(),
  slug: z.string().min(2, 'الرابط مطلوب').regex(/^[a-z0-9-]+$/, 'الرابط يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام وشرطات فقط'),
  description: z.string().min(10, 'الوصف مطلوب'),
  descriptionAr: z.string().optional(),
  category: z.enum(['Web', 'SaaS', 'Mobile']),
  technologies: z.array(z.string()).min(1, 'تقنية واحدة على الأقل مطلوبة'),
  clientName: z.string().optional(),
  completionDate: z.string().optional(),
  featured: z.boolean().optional(),
  images: z.array(z.string()).optional(),
  caseStudyUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  displayOrder: z.number().optional(),
  status: z.enum(['draft', 'published']).optional(),
})

// Testimonial Validation
export const testimonialSchema = z.object({
  quote: z.string().min(10, 'التوصية مطلوبة'),
  quoteAr: z.string().optional(),
  authorName: z.string().min(2, 'اسم الكاتب مطلوب'),
  authorRole: z.string().optional(),
  authorRoleAr: z.string().optional(),
  authorCompany: z.string().optional(),
  authorImage: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  featured: z.boolean().optional(),
  approved: z.boolean().optional(),
  displayOrder: z.number().optional(),
})

// Team Member Validation
export const teamMemberSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  nameAr: z.string().optional(),
  role: z.string().min(2, 'المنصب مطلوب'),
  roleAr: z.string().optional(),
  bio: z.string().optional(),
  bioAr: z.string().optional(),
  image: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  displayOrder: z.number().optional(),
  isActive: z.boolean().optional(),
})

// Service Validation
export const serviceSchema = z.object({
  title: z.string().min(2, 'العنوان مطلوب'),
  titleAr: z.string().optional(),
  slug: z.string().min(2, 'الرابط مطلوب'),
  shortDescription: z.string().min(10, 'الوصف المختصر مطلوب'),
  shortDescAr: z.string().optional(),
  fullDescription: z.string().optional(),
  fullDescAr: z.string().optional(),
  icon: z.string().optional(),
  features: z.array(z.string()).optional(),
  featuresAr: z.array(z.string()).optional(),
  pricingFrom: z.number().optional(),
  displayOrder: z.number().optional(),
  isActive: z.boolean().optional(),
})

// Blog Post Validation
export const blogPostSchema = z.object({
  title: z.string().min(2, 'العنوان مطلوب'),
  titleAr: z.string().optional(),
  slug: z.string().min(2, 'الرابط مطلوب'),
  excerpt: z.string().optional(),
  excerptAr: z.string().optional(),
  content: z.string().min(50, 'المحتوى مطلوب'),
  contentAr: z.string().optional(),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published']).optional(),
  publishedAt: z.string().optional(),
})

// Quiz Result Validation
export const quizResultSchema = z.object({
  quizType: z.enum(['business', 'developer']),
  score: z.number(),
  answers: z.array(z.string()),
  result: z.string().optional(),
  userEmail: z.string().email().optional(),
})

// Newsletter Validation
export const newsletterSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
})

export type ContactInput = z.infer<typeof contactSchema>
export type ProjectInput = z.infer<typeof projectSchema>
export type TestimonialInput = z.infer<typeof testimonialSchema>
export type TeamMemberInput = z.infer<typeof teamMemberSchema>
export type ServiceInput = z.infer<typeof serviceSchema>
export type BlogPostInput = z.infer<typeof blogPostSchema>
export type QuizResultInput = z.infer<typeof quizResultSchema>
export type NewsletterInput = z.infer<typeof newsletterSchema>
