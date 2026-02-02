import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { testimonialSchema } from '@/lib/validations'

// GET - List testimonials (public: approved only, admin: all)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isAdmin = searchParams.get('admin') === 'true'
    const featured = searchParams.get('featured')

    const where: Record<string, unknown> = {}
    
    // Public users only see approved testimonials
    if (!isAdmin) {
      where.approved = true
    }

    if (featured === 'true') where.featured = true

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ],
    })

    return NextResponse.json({
      success: true,
      data: testimonials
    })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب التوصيات' },
      { status: 500 }
    )
  }
}

// POST - Create new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = testimonialSchema.parse(body)

    // Create testimonial
    const testimonial = await prisma.testimonial.create({
      data: {
        quote: validatedData.quote,
        quoteAr: validatedData.quoteAr,
        authorName: validatedData.authorName,
        authorRole: validatedData.authorRole,
        authorRoleAr: validatedData.authorRoleAr,
        authorCompany: validatedData.authorCompany,
        authorImage: validatedData.authorImage,
        rating: validatedData.rating || 5,
        featured: validatedData.featured || false,
        approved: validatedData.approved || false,
        displayOrder: validatedData.displayOrder || 0,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء التوصية بنجاح',
      data: testimonial
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating testimonial:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صالحة', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء التوصية' },
      { status: 500 }
    )
  }
}
