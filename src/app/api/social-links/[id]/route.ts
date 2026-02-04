// Social Link by ID API
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET single social link
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const socialLink = await prisma.socialLink.findUnique({
      where: { id: params.id },
    });

    if (!socialLink) {
      return NextResponse.json(
        { error: 'Social link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(socialLink);
  } catch (error) {
    console.error('Error fetching social link:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social link' },
      { status: 500 }
    );
  }
}

// PUT - Update social link
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const socialLink = await prisma.socialLink.update({
      where: { id: params.id },
      data: {
        platform: data.platform,
        url: data.url,
        icon: data.icon,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(socialLink);
  } catch (error) {
    console.error('Error updating social link:', error);
    return NextResponse.json(
      { error: 'Failed to update social link' },
      { status: 500 }
    );
  }
}

// DELETE social link
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.socialLink.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting social link:', error);
    return NextResponse.json(
      { error: 'Failed to delete social link' },
      { status: 500 }
    );
  }
}
