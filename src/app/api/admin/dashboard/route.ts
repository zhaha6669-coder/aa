// Dashboard Stats API - Get overview statistics
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get counts in parallel
    const [
      totalContacts,
      newContacts,
      totalProjects,
      publishedProjects,
      totalServices,
      totalBlogPosts,
      publishedBlogPosts,
      totalTestimonials,
      totalSubscribers,
      activeSubscribers,
      totalOrders,
      pendingOrders,
      recentContacts,
      recentOrders,
      siteStats,
    ] = await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({ where: { status: 'new' } }),
      prisma.project.count(),
      prisma.project.count({ where: { status: 'published' } }),
      prisma.service.count({ where: { isActive: true } }),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { status: 'published' } }),
      prisma.testimonial.count({ where: { approved: true } }),
      prisma.newsletterSubscriber.count(),
      prisma.newsletterSubscriber.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.contact.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          projectType: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          amount: true,
          currency: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
        },
      }),
      prisma.siteStat.findMany(),
    ]);

    // Convert site stats to object
    const stats = siteStats.reduce((acc: any, stat) => {
      acc[stat.key] = stat.value;
      return acc;
    }, {});

    return NextResponse.json({
      contacts: {
        total: totalContacts,
        new: newContacts,
      },
      projects: {
        total: totalProjects,
        published: publishedProjects,
      },
      services: totalServices,
      blog: {
        total: totalBlogPosts,
        published: publishedBlogPosts,
      },
      testimonials: totalTestimonials,
      subscribers: {
        total: totalSubscribers,
        active: activeSubscribers,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
      },
      siteStats: stats,
      recentContacts,
      recentOrders,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
