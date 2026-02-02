import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { projectSchema } from '@/lib/validations'

// GET - List all projects (public: published only, admin: all)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit
    const isAdmin = searchParams.get('admin') === 'true'

    const where: Record<string, unknown> = {}
    
    // Public users only see published projects
    if (!isAdmin) {
      where.status = 'published'
    } else if (status) {
      where.status = status
    }

    if (category) where.category = category
    if (featured === 'true') where.featured = true

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: [
          { featured: 'desc' },
          { displayOrder: 'asc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit,
      }),
      prisma.project.count({ where })
    ])

    // Parse JSON fields
    const parsedProjects = projects.map(project => ({
      ...project,
      technologies: project.technologies ? JSON.parse(project.technologies) : [],
      images: project.images ? JSON.parse(project.images) : [],
    }))

    return NextResponse.json({
      success: true,
      data: parsedProjects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب المشاريع' },
      { status: 500 }
    )
  }
}

// POST - Create new project (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = projectSchema.parse(body)

    // Check if slug exists
    const existingProject = await prisma.project.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingProject) {
      return NextResponse.json(
        { success: false, error: 'الرابط موجود مسبقاً' },
        { status: 400 }
      )
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        title: validatedData.title,
        titleAr: validatedData.titleAr,
        slug: validatedData.slug,
        description: validatedData.description,
        descriptionAr: validatedData.descriptionAr,
        category: validatedData.category,
        technologies: JSON.stringify(validatedData.technologies),
        clientName: validatedData.clientName,
        completionDate: validatedData.completionDate ? new Date(validatedData.completionDate) : null,
        featured: validatedData.featured || false,
        images: validatedData.images ? JSON.stringify(validatedData.images) : null,
        caseStudyUrl: validatedData.caseStudyUrl || null,
        liveUrl: validatedData.liveUrl || null,
        githubUrl: validatedData.githubUrl || null,
        displayOrder: validatedData.displayOrder || 0,
        status: validatedData.status || 'draft',
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء المشروع بنجاح',
      data: project
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating project:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صالحة', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء المشروع' },
      { status: 500 }
    )
  }
}
