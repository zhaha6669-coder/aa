// FAQ API
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET all FAQs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const activeOnly = searchParams.get('active') !== 'false';

    const where: any = {};
    
    if (activeOnly) {
      where.isActive = true;
    }
    
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const faqs = await prisma.fAQ.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

// POST - Create new FAQ
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const faq = await prisma.fAQ.create({
      data: {
        question: data.question,
        questionAr: data.questionAr,
        answer: data.answer,
        answerAr: data.answerAr,
        categoryId: data.categoryId,
        displayOrder: data.displayOrder || 0,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json(faq, { status: 201 });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}
