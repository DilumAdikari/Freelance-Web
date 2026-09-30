'use server';

import mongoose from 'mongoose';
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

// 1. Freelancer ට ලැබී ඇති Orders ලබා ගැනීම
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

// 2. Client කෙනෙකු Gig එකක් මිලදී ගෙන Order එකක් Create කිරීම
export async function createOrderAction(gigId: string): Promise<{
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  error?: string;
}> {
  try {
    const userId = await getUserIdFromToken();
    if (!userId) {
      return { success: false, error: 'Please log in to place an order' };
    }

    await connectDB();

    const GigModel = mongoose.models.Gig || mongoose.model('Gig');
    const gig = await GigModel.findById(gigId).lean<{
      _id: unknown;
      freelancerId: unknown;
      price?: number;
      deliveryDays?: number;
    }>();

    if (!gig) {
      return { success: false, error: 'Gig not found' };
    }

    if (String(gig.freelancerId) === String(userId)) {
      return { success: false, error: 'You cannot order your own gig' };
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `VLK-${randomNum}`;

    const daysToAdd = Number(gig.deliveryDays) || 3;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysToAdd);

    const newOrder = await Order.create({
      orderNumber,
      clientId: new mongoose.Types.ObjectId(userId),
      freelancerId: new mongoose.Types.ObjectId(String(gig.freelancerId)),
      gigId: new mongoose.Types.ObjectId(String(gig._id)),
      amount: Number(gig.price) || 20,
      dueDate,
      status: 'In Progress',
    });

    return {
      success: true,
      orderId: String(newOrder._id),
      orderNumber: String(newOrder.get('orderNumber') || orderNumber),
    };
  } catch (error) {
    console.error('Error placing order:', error);
    return { success: false, error: 'Failed to place order' };
  }
}