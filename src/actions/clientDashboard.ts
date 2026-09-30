'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import '@/models/User';
import '@/models/Gig';

async function getUserIdFromToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

interface IClientPopulatedOrder {
  _id: unknown;
  orderNumber?: string;
  freelancerId?: { name?: string; email?: string; avatar?: string };
  gigId?: { title?: string; coverImage?: string };
  amount?: number;
  dueDate?: string | number | Date;
  status?: 'In Progress' | 'Under Review' | 'Completed' | 'Cancelled';
}

export async function getClientDashboardData() {
  try {
    const userId = await getUserIdFromToken();
    if (!userId) {
      return {
        success: false,
        metrics: { activeOrders: 0, completedOrders: 0, totalSpent: 0 },
        recentOrders: [],
        error: 'Unauthorized',
      };
    }

    await connectDB();

    // 1. Client මිලදී ගත් සියලු Orders ලබා ගැනීම
    const rawOrders = await Order.find({ clientId: userId })
      .populate('freelancerId', 'name email avatar')
      .populate('gigId', 'title coverImage')
      .sort({ createdAt: -1 })
      .lean<IClientPopulatedOrder[]>();

    // 2. Metrics ගණනය කිරීම
    let activeOrders = 0;
    let completedOrders = 0;
    let totalSpent = 0;

    const formattedOrders = rawOrders.map((ord) => {
      const amount = Number(ord.amount || 0);
      const status = ord.status || 'In Progress';

      if (status === 'In Progress' || status === 'Under Review') {
        activeOrders++;
      } else if (status === 'Completed') {
        completedOrders++;
      }

      if (status !== 'Cancelled') {
        totalSpent += amount;
      }

      const dueDateVal = ord.dueDate ? new Date(ord.dueDate) : new Date();

      return {
        _id: String(ord._id),
        orderNumber: ord.orderNumber || 'VLK-ORD',
        freelancerName: ord.freelancerId?.name || 'Freelancer',
        freelancerAvatar: ord.freelancerId?.avatar || '',
        gigTitle: ord.gigId?.title || 'Custom Service Package',
        dueDate: dueDateVal.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        amount,
        status,
      };
    });

    return {
      success: true,
      metrics: {
        activeOrders,
        completedOrders,
        totalSpent,
      },
      recentOrders: formattedOrders.slice(0, 5), // අවසන් Orders 5
    };
  } catch (error) {
    console.error('Error fetching client dashboard:', error);
    return {
      success: false,
      metrics: { activeOrders: 0, completedOrders: 0, totalSpent: 0 },
      recentOrders: [],
      error: 'Failed to load dashboard',
    };
  }
}