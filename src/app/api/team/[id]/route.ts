import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { teamMemberSchema } from '@/lib/validations'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Get single team member
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const teamMember = await prisma.teamMember.findUnique({
      where: { id }
    })

    if (!teamMember) {
      return NextResponse.json(
        { success: false, error: 'عضو الفريق غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: teamMember
    })
  } catch (error) {
    console.error('Error fetching team member:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب عضو الفريق' },
      { status: 500 }
    )
  }
}

// PATCH - Update team member
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    const validatedData = teamMemberSchema.partial().parse(body)

    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: validatedData
    })

    return NextResponse.json({
      success: true,
      message: 'تم تحديث عضو الفريق بنجاح',
      data: teamMember
    })
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث عضو الفريق' },
      { status: 500 }
    )
  }
}

// DELETE - Delete team member
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    await prisma.teamMember.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف عضو الفريق بنجاح'
    })
  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في حذف عضو الفريق' },
      { status: 500 }
    )
  }
}
