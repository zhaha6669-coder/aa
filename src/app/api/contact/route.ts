import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { contactSchema } from '@/lib/validations'

// GET - List all contacts (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where = status ? { status } : {}

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contact.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الرسائل' },
      { status: 500 }
    )
  }
}

// POST - Submit new contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const result = contactSchema.safeParse(body)
    
    if (!result.success) {
      // Zod v4 uses 'issues' instead of 'errors'
      const issues = result.error.issues || result.error.errors || []
      const errors = issues.map((err: any) => ({
        field: err.path?.join('.') || 'unknown',
        message: err.message
      }))
      return NextResponse.json(
        { success: false, error: 'بيانات غير صالحة', errors },
        { status: 400 }
      )
    }

    const validatedData = result.data

    // Get IP and User Agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Create contact
    const contact = await prisma.contact.create({
      data: {
        ...validatedData,
        ipAddress,
        userAgent,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.',
      data: { id: contact.id }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating contact:', error)

    return NextResponse.json(
      { success: false, error: 'فشل في إرسال الرسالة' },
      { status: 500 }
    )
  }
}
