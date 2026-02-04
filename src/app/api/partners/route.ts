// Partners API
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET all partners
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const featured = searchParams.get('featured') === 'true';
    const activeOnly = searchParams.get('active') !== 'false';

    const where: any = {};
    
    if (activeOnly) {
      where.isActive = true;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (featured) {
      where.featured = true;
    }

    const partners = await prisma.partner.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partners' },
      { status: 500 }
    );
  }
}

// POST - Create new partner
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const partner = await prisma.partner.create({
      data: {
        name: data.name,
        nameAr: data.nameAr,
        logo: data.logo,
        website: data.website,
        description: data.description,
        descriptionAr: data.descriptionAr,
        type: data.type || 'client',
        featured: data.featured ?? false,
        displayOrder: data.displayOrder || 0,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    console.error('Error creating partner:', error);
    return NextResponse.json(
      { error: 'Failed to create partner' },
      { status: 500 }
    );
  }
}
