'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function updateUserActiveStatus() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return { success: false };

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    if (!decoded?.userId) return { success: false };

    await connectDB();

    await User.findByIdAndUpdate(decoded.userId, {
      $set: { lastActiveAt: new Date() },
    });

    return { success: true };
  } catch {
    return { success: false };
  }
}