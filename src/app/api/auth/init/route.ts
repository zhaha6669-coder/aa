import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import prisma from '@/lib/prisma'

// POST - Initialize admin user (run once)
export async function POST() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@lumina.agency'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456'

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        message: 'المستخدم الإداري موجود مسبقاً'
      }, { status: 400 })
    }

    // Create admin user
    const hashedPassword = await hash(adminPassword, 12)
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin',
        role: 'admin',
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء المستخدم الإداري بنجاح',
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating admin:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء المستخدم الإداري' },
      { status: 500 }
    )
  }
}
