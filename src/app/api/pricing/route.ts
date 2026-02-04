// Pricing Plans API
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET all pricing plans
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') !== 'false';

    const where: any = {};
    
    if (activeOnly) {
      where.isActive = true;
    }

    const plans = await prisma.pricingPlan.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    // Parse features JSON
    const parsedPlans = plans.map(plan => ({
      ...plan,
      features: JSON.parse(plan.features || '[]'),
      featuresAr: plan.featuresAr ? JSON.parse(plan.featuresAr) : null,
    }));

    return NextResponse.json(parsedPlans);
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing plans' },
      { status: 500 }
    );
  }
}

// POST - Create new pricing plan
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const plan = await prisma.pricingPlan.create({
      data: {
        name: data.name,
        nameAr: data.nameAr,
        description: data.description,
        descriptionAr: data.descriptionAr,
        price: data.price,
        currency: data.currency || 'USD',
        period: data.period || 'monthly',
        features: JSON.stringify(data.features || []),
        featuresAr: data.featuresAr ? JSON.stringify(data.featuresAr) : null,
        highlighted: data.highlighted ?? false,
        displayOrder: data.displayOrder || 0,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error('Error creating pricing plan:', error);
    return NextResponse.json(
      { error: 'Failed to create pricing plan' },
      { status: 500 }
    );
  }
}
