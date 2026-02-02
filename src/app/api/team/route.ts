import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { teamMemberSchema } from '@/lib/validations'

// GET - List team members
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isAdmin = searchParams.get('admin') === 'true'

    const where = isAdmin ? {} : { isActive: true }

    const teamMembers = await prisma.teamMember.findMany({
      where,
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'asc' }
      ],
    })

    return NextResponse.json({
      success: true,
      data: teamMembers
    })
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب أعضاء الفريق' },
      { status: 500 }
    )
  }
}

// POST - Create team member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = teamMemberSchema.parse(body)

    const teamMember = await prisma.teamMember.create({
      data: validatedData
    })

    return NextResponse.json({
      success: true,
      message: 'تم إضافة عضو الفريق بنجاح',
      data: teamMember
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في إضافة عضو الفريق' },
      { status: 500 }
    )
  }
}
