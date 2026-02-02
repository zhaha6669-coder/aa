import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Get single contact
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const contact = await prisma.contact.findUnique({
      where: { id }
    })

    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'الرسالة غير موجودة' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: contact
    })
  } catch (error) {
    console.error('Error fetching contact:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الرسالة' },
      { status: 500 }
    )
  }
}

// PATCH - Update contact status/notes
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    const { status, notes } = body

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الرسالة بنجاح',
      data: contact
    })
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث الرسالة' },
      { status: 500 }
    )
  }
}

// DELETE - Delete contact
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    await prisma.contact.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف الرسالة بنجاح'
    })
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في حذف الرسالة' },
      { status: 500 }
    )
  }
}
