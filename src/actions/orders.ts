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

export interface IOrderTableItem {
  _id: string;
  orderNumber: string;
  clientName: string;
  clientEmail: string;
  gigTitle: string;
  dueDate: string;
  amount: number;
  status: 'In Progress' | 'Under Review' | 'Completed' | 'Cancelled';
}

interface IPopulatedOrder {
  _id: unknown;
  orderNumber?: string;
  clientId?: { name?: string; email?: string };
  gigId?: { title?: string };
  amount?: number;
  dueDate?: string | number | Date;
  status?: 'In Progress' | 'Under Review' | 'Completed' | 'Cancelled';
}

export async function getFreelancerOrders(): Promise<{
  success: boolean;
  orders: IOrderTableItem[];
  error?: string;
}> {
  try {
    const userId = await getUserIdFromToken();
    if (!userId) return { success: false, orders: [], error: 'Unauthorized' };

    await connectDB();

    const orders = await Order.find({ freelancerId: userId })
      .populate('clientId', 'name email')
      .populate('gigId', 'title')
      .sort({ createdAt: -1 })
      .lean<IPopulatedOrder[]>();

    const formattedOrders: IOrderTableItem[] = orders.map((ord) => {
      const dueDateVal = ord.dueDate ? new Date(ord.dueDate) : new Date();

      return {
        _id: String(ord._id),
        orderNumber: ord.orderNumber || 'VLK-ORD',
        clientName: ord.clientId?.name || 'Anonymous Client',
        clientEmail: ord.clientId?.email || '',
        gigTitle: ord.gigId?.title || 'Custom Service Order',
        dueDate: dueDateVal.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        amount: Number(ord.amount || 0),
        status: ord.status || 'In Progress',
      };
    });

    return {
      success: true,
      orders: formattedOrders,
    };
  } catch (error) {
    console.error('Error fetching freelancer orders:', error);
    return { success: false, orders: [], error: 'Failed to fetch orders' };
  }
}