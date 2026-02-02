import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Get all stats
export async function GET() {
  try {
    const stats = await prisma.siteStat.findMany()

    // Convert to object format
    const statsObject = stats.reduce((acc, stat) => {
      acc[stat.key] = stat.value
      return acc
    }, {} as Record<string, number>)

    // Default values if not set
    const defaultStats = {
      projects_completed: 50,
      happy_clients: 30,
      satisfaction_rate: 98,
      years_experience: 5,
      ...statsObject
    }

    return NextResponse.json({
      success: true,
      data: defaultStats
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الإحصائيات' },
      { status: 500 }
    )
  }
}

// PATCH - Update stats
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()

    const updates = Object.entries(body).map(([key, value]) => 
      prisma.siteStat.upsert({
        where: { key },
        update: { value: value as number },
        create: { key, value: value as number }
      })
    )

    await Promise.all(updates)

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الإحصائيات بنجاح'
    })
  } catch (error) {
    console.error('Error updating stats:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث الإحصائيات' },
      { status: 500 }
    )
  }
}
