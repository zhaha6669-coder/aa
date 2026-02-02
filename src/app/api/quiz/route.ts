import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { quizResultSchema } from '@/lib/validations'

// GET - Get quiz analytics (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const quizType = searchParams.get('type')

    const where = quizType ? { quizType } : {}

    const [results, totalCount, avgScore] = await Promise.all([
      prisma.quizResult.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      prisma.quizResult.count({ where }),
      prisma.quizResult.aggregate({
        where,
        _avg: { score: true }
      })
    ])

    // Parse answers
    const parsedResults = results.map(result => ({
      ...result,
      answers: result.answers ? JSON.parse(result.answers) : [],
    }))

    return NextResponse.json({
      success: true,
      data: {
        results: parsedResults,
        analytics: {
          totalAttempts: totalCount,
          averageScore: avgScore._avg.score || 0
        }
      }
    })
  } catch (error) {
    console.error('Error fetching quiz results:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب نتائج الاستبيان' },
      { status: 500 }
    )
  }
}

// POST - Submit quiz result
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = quizResultSchema.parse(body)

    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    const quizResult = await prisma.quizResult.create({
      data: {
        quizType: validatedData.quizType,
        score: validatedData.score,
        answers: JSON.stringify(validatedData.answers),
        result: validatedData.result,
        userEmail: validatedData.userEmail,
        ipAddress,
        userAgent,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حفظ النتيجة بنجاح',
      data: { id: quizResult.id }
    }, { status: 201 })

  } catch (error) {
    console.error('Error saving quiz result:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في حفظ النتيجة' },
      { status: 500 }
    )
  }
}
