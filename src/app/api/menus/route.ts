// Menus API - Navigation Management
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET all menus with items
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');

    const where: any = { isActive: true };
    
    if (location) {
      where.location = location;
    }

    const menus = await prisma.menu.findMany({
      where,
      include: {
        items: {
          where: { isActive: true, parentId: null },
          orderBy: { displayOrder: 'asc' },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
      },
    });

    // If location specified, return single menu
    if (location && menus.length > 0) {
      return NextResponse.json(menus[0]);
    }

    return NextResponse.json(menus);
  } catch (error) {
    console.error('Error fetching menus:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menus' },
      { status: 500 }
    );
  }
}

// POST - Create new menu
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Check if location already exists
    const existingMenu = await prisma.menu.findUnique({
      where: { location: data.location },
    });

    if (existingMenu) {
      return NextResponse.json(
        { error: 'A menu with this location already exists' },
        { status: 400 }
      );
    }

    const menu = await prisma.menu.create({
      data: {
        name: data.name,
        nameAr: data.nameAr,
        location: data.location,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json(menu, { status: 201 });
  } catch (error) {
    console.error('Error creating menu:', error);
    return NextResponse.json(
      { error: 'Failed to create menu' },
      { status: 500 }
    );
  }
}
