import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { serviceSchema } from '@/lib/validations'

interface RouteParams {
  params: Promise<{ slug: string }>
}

// GET - Get single service
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params

    const service = await prisma.service.findUnique({
      where: { slug }
    })

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'الخدمة غير موجودة' },
        { status: 404 }
      )
    }

    const parsedService = {
      ...service,
      features: service.features ? JSON.parse(service.features) : [],
      featuresAr: service.featuresAr ? JSON.parse(service.featuresAr) : [],
    }

    return NextResponse.json({
      success: true,
      data: parsedService
    })
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الخدمة' },
      { status: 500 }
    )
  }
}

// PATCH - Update service
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params
    const body = await request.json()

    const validatedData = serviceSchema.partial().parse(body)

    const updateData: Record<string, unknown> = { ...validatedData }
    
    if (validatedData.features) {
      updateData.features = JSON.stringify(validatedData.features)
    }
    if (validatedData.featuresAr) {
      updateData.featuresAr = JSON.stringify(validatedData.featuresAr)
    }

    const service = await prisma.service.update({
      where: { slug },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الخدمة بنجاح',
      data: service
    })
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث الخدمة' },
      { status: 500 }
    )
  }
}

// DELETE - Delete service
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params

    await prisma.service.delete({
      where: { slug }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف الخدمة بنجاح'
    })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في حذف الخدمة' },
      { status: 500 }
    )
  }
}
