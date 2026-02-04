// Categories API
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET all categories
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const activeOnly = searchParams.get('active') !== 'false';
    const withChildren = searchParams.get('children') === 'true';

    const where: any = {};
    
    if (activeOnly) {
      where.isActive = true;
    }
    
    if (type) {
      where.type = type;
    }

    const include: any = {};
    
    if (withChildren) {
      where.parentId = null; // Only get root categories
      include.children = {
        where: activeOnly ? { isActive: true } : {},
        orderBy: { displayOrder: 'asc' },
      };
    }

    const categories = await prisma.category.findMany({
      where,
      include: Object.keys(include).length > 0 ? include : undefined,
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Check if slug exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        nameAr: data.nameAr,
        slug: data.slug,
        description: data.description,
        descriptionAr: data.descriptionAr,
        type: data.type,
        parentId: data.parentId,
        icon: data.icon,
        color: data.color,
        displayOrder: data.displayOrder || 0,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
