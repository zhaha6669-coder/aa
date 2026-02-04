// Pages API - Dynamic Pages Management
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET all pages
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const withAuth = searchParams.get('auth') === 'true';

    const where: any = {};
    
    // If not admin, only show published pages
    if (!withAuth) {
      where.status = 'published';
    } else if (status) {
      where.status = status;
    }

    const pages = await prisma.page.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

// POST - Create new page
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Check if slug already exists
    const existingPage = await prisma.page.findUnique({
      where: { slug: data.slug },
    });

    if (existingPage) {
      return NextResponse.json(
        { error: 'A page with this slug already exists' },
        { status: 400 }
      );
    }

    const page = await prisma.page.create({
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
        template: data.template || 'default',
        status: data.status || 'draft',
        displayOrder: data.displayOrder || 0,
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}
