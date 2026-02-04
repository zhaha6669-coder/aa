// Page by Slug API
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET page by slug or id
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const page = await prisma.page.findFirst({
      where: {
        OR: [
          { slug: params.slug },
          { id: params.slug },
        ],
      },
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

// PUT - Update page
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Find page by slug or id
    const existingPage = await prisma.page.findFirst({
      where: {
        OR: [
          { slug: params.slug },
          { id: params.slug },
        ],
      },
    });

    if (!existingPage) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    // Check if new slug conflicts with another page
    if (data.slug && data.slug !== existingPage.slug) {
      const slugConflict = await prisma.page.findUnique({
        where: { slug: data.slug },
      });
      if (slugConflict) {
        return NextResponse.json(
          { error: 'A page with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const page = await prisma.page.update({
      where: { id: existingPage.id },
      data: {
        title: data.title,
        titleAr: data.titleAr,
        slug: data.slug,
        content: data.content,
        contentAr: data.contentAr,
        metaTitle: data.metaTitle,
        metaTitleAr: data.metaTitleAr,
        metaDesc: data.metaDesc,
        metaDescAr: data.metaDescAr,
        template: data.template,
        status: data.status,
        displayOrder: data.displayOrder,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    );
  }
}

// DELETE page
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find page by slug or id
    const existingPage = await prisma.page.findFirst({
      where: {
        OR: [
          { slug: params.slug },
          { id: params.slug },
        ],
      },
    });

    if (!existingPage) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    await prisma.page.delete({
      where: { id: existingPage.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}
