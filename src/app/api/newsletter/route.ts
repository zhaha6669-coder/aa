import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { newsletterSchema } from '@/lib/validations'

// GET - List subscribers (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where: { isActive: true },
        orderBy: { subscribedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.newsletterSubscriber.count({ where: { isActive: true } })
    ])

    return NextResponse.json({
      success: true,
      data: subscribers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب المشتركين' },
      { status: 500 }
    )
  }
}

// POST - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = newsletterSchema.parse(body)

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: validatedData.email }
    })

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json({
          success: false,
          error: 'البريد الإلكتروني مشترك مسبقاً'
        }, { status: 400 })
      } else {
        // Reactivate subscription
        await prisma.newsletterSubscriber.update({
          where: { email: validatedData.email },
          data: { isActive: true, unsubscribedAt: null }
        })

        return NextResponse.json({
          success: true,
          message: 'تم إعادة تفعيل اشتراكك بنجاح'
        })
      }
    }

    await prisma.newsletterSubscriber.create({
      data: { email: validatedData.email }
    })

    return NextResponse.json({
      success: true,
      message: 'تم الاشتراك بنجاح! شكراً لانضمامك.'
    }, { status: 201 })

  } catch (error) {
    console.error('Error subscribing:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في الاشتراك' },
      { status: 500 }
    )
  }
}
