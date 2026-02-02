import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { testimonialSchema } from '@/lib/validations'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Get single testimonial
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const testimonial = await prisma.testimonial.findUnique({
      where: { id }
    })

    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: 'التوصية غير موجودة' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: testimonial
    })
  } catch (error) {
    console.error('Error fetching testimonial:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب التوصية' },
      { status: 500 }
    )
  }
}

// PATCH - Update testimonial
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    // Partial validation
    const validatedData = testimonialSchema.partial().parse(body)

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: validatedData
    })

    return NextResponse.json({
      success: true,
      message: 'تم تحديث التوصية بنجاح',
      data: testimonial
    })
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث التوصية' },
      { status: 500 }
    )
  }
}

// DELETE - Delete testimonial
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    await prisma.testimonial.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف التوصية بنجاح'
    })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في حذف التوصية' },
      { status: 500 }
    )
  }
}
