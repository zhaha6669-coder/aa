import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { projectSchema } from '@/lib/validations'

interface RouteParams {
  params: Promise<{ slug: string }>
}

// GET - Get single project by slug
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params

    const project = await prisma.project.findUnique({
      where: { slug }
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'المشروع غير موجود' },
        { status: 404 }
      )
    }

    // Increment views
    await prisma.project.update({
      where: { slug },
      data: { views: { increment: 1 } }
    })

    // Parse JSON fields
    const parsedProject = {
      ...project,
      technologies: project.technologies ? JSON.parse(project.technologies) : [],
      images: project.images ? JSON.parse(project.images) : [],
    }

    return NextResponse.json({
      success: true,
      data: parsedProject
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب المشروع' },
      { status: 500 }
    )
  }
}

// PATCH - Update project
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params
    const body = await request.json()

    // Partial validation
    const validatedData = projectSchema.partial().parse(body)

    // Check if new slug already exists (if slug is being changed)
    if (validatedData.slug && validatedData.slug !== slug) {
      const existingProject = await prisma.project.findUnique({
        where: { slug: validatedData.slug }
      })

      if (existingProject) {
        return NextResponse.json(
          { success: false, error: 'الرابط الجديد موجود مسبقاً' },
          { status: 400 }
        )
      }
    }

    const updateData: Record<string, unknown> = {}

    if (validatedData.title !== undefined) updateData.title = validatedData.title
    if (validatedData.titleAr !== undefined) updateData.titleAr = validatedData.titleAr
    if (validatedData.slug !== undefined) updateData.slug = validatedData.slug
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.descriptionAr !== undefined) updateData.descriptionAr = validatedData.descriptionAr
    if (validatedData.category !== undefined) updateData.category = validatedData.category
    if (validatedData.technologies !== undefined) updateData.technologies = JSON.stringify(validatedData.technologies)
    if (validatedData.clientName !== undefined) updateData.clientName = validatedData.clientName
    if (validatedData.completionDate !== undefined) updateData.completionDate = validatedData.completionDate ? new Date(validatedData.completionDate) : null
    if (validatedData.featured !== undefined) updateData.featured = validatedData.featured
    if (validatedData.images !== undefined) updateData.images = JSON.stringify(validatedData.images)
    if (validatedData.caseStudyUrl !== undefined) updateData.caseStudyUrl = validatedData.caseStudyUrl || null
    if (validatedData.liveUrl !== undefined) updateData.liveUrl = validatedData.liveUrl || null
    if (validatedData.githubUrl !== undefined) updateData.githubUrl = validatedData.githubUrl || null
    if (validatedData.displayOrder !== undefined) updateData.displayOrder = validatedData.displayOrder
    if (validatedData.status !== undefined) updateData.status = validatedData.status

    const project = await prisma.project.update({
      where: { slug },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      message: 'تم تحديث المشروع بنجاح',
      data: project
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث المشروع' },
      { status: 500 }
    )
  }
}

// DELETE - Delete project
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params

    await prisma.project.delete({
      where: { slug }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف المشروع بنجاح'
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في حذف المشروع' },
      { status: 500 }
    )
  }
}
