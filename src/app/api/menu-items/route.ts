// Menu Items API
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// POST - Create new menu item
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const menuItem = await prisma.menuItem.create({
      data: {
        menuId: data.menuId,
        parentId: data.parentId,
        label: data.label,
        labelAr: data.labelAr,
        url: data.url,
        pageId: data.pageId,
        target: data.target || '_self',
        icon: data.icon,
        displayOrder: data.displayOrder || 0,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}

// PUT - Bulk update menu items (for drag & drop reordering)
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items } = await request.json();

    const promises = items.map((item: any) =>
      prisma.menuItem.update({
        where: { id: item.id },
        data: {
          displayOrder: item.displayOrder,
          parentId: item.parentId,
        },
      })
    );

    await Promise.all(promises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating menu items:', error);
    return NextResponse.json(
      { error: 'Failed to update menu items' },
      { status: 500 }
    );
  }
}
