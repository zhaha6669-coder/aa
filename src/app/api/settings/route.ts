// Settings API - Full CMS Control
// GET, PUT endpoints for site settings

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET all settings or by group
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const group = searchParams.get('group');
    const publicOnly = searchParams.get('public') === 'true';

    const where: any = {};
    
    if (group) {
      where.group = group;
    }
    
    if (publicOnly) {
      where.isPublic = true;
    }

    const settings = await prisma.setting.findMany({
      where,
      orderBy: { key: 'asc' },
    });

    // Convert to key-value object for easier frontend use
    const settingsObject = settings.reduce((acc: any, setting) => {
      acc[setting.key] = {
        value: setting.value,
        valueAr: setting.valueAr,
        type: setting.type,
        group: setting.group,
        label: setting.label,
        labelAr: setting.labelAr,
        isPublic: setting.isPublic,
      };
      return acc;
    }, {});

    return NextResponse.json(settingsObject);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT - Update multiple settings at once
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();

    // Update each setting
    const promises = Object.entries(updates).map(async ([key, data]: [string, any]) => {
      return prisma.setting.upsert({
        where: { key },
        update: {
          value: data.value,
          valueAr: data.valueAr,
          type: data.type || 'string',
          group: data.group || 'general',
          label: data.label,
          labelAr: data.labelAr,
          description: data.description,
          isPublic: data.isPublic ?? false,
        },
        create: {
          key,
          value: data.value,
          valueAr: data.valueAr,
          type: data.type || 'string',
          group: data.group || 'general',
          label: data.label,
          labelAr: data.labelAr,
          description: data.description,
          isPublic: data.isPublic ?? false,
        },
      });
    });

    await Promise.all(promises);

    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
