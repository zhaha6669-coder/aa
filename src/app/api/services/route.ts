import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { serviceSchema } from '@/lib/validations'

// GET - List services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isAdmin = searchParams.get('admin') === 'true'

    const where = isAdmin ? {} : { isActive: true }

    const services = await prisma.service.findMany({
      where,
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'asc' }
      ],
    })

    // Parse JSON fields
    const parsedServices = services.map(service => ({
      ...service,
      features: service.features ? JSON.parse(service.features) : [],
      featuresAr: service.featuresAr ? JSON.parse(service.featuresAr) : [],
    }))

    return NextResponse.json({
      success: true,
      data: parsedServices
    })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الخدمات' },
      { status: 500 }
    )
  }
}

// POST - Create service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = serviceSchema.parse(body)

    // Check if slug exists
    const existingService = await prisma.service.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingService) {
      return NextResponse.json(
        { success: false, error: 'الرابط موجود مسبقاً' },
        { status: 400 }
      )
    }

    const service = await prisma.service.create({
      data: {
        title: validatedData.title,
        titleAr: validatedData.titleAr,
        slug: validatedData.slug,
        shortDescription: validatedData.shortDescription,
        shortDescAr: validatedData.shortDescAr,
        fullDescription: validatedData.fullDescription,
        fullDescAr: validatedData.fullDescAr,
        icon: validatedData.icon,
        features: validatedData.features ? JSON.stringify(validatedData.features) : null,
        featuresAr: validatedData.featuresAr ? JSON.stringify(validatedData.featuresAr) : null,
        pricingFrom: validatedData.pricingFrom,
        displayOrder: validatedData.displayOrder || 0,
        isActive: validatedData.isActive ?? true,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الخدمة بنجاح',
      data: service
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء الخدمة' },
      { status: 500 }
    )
  }
}
