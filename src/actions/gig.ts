'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/mongodb';
import { Gig } from '@/models/Gig';
import { CreateGigSchema } from '@/lib/validations/gig';
import { verifyToken } from '@/lib/auth';

export async function createGigAction(formData: unknown) {
  // 1. Authenticate user from cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return { success: false, error: 'You must be logged in to create a gig.' };
  }

  const payload = verifyToken(token);
  if (!payload || payload.role !== 'FREELANCER') {
    return { success: false, error: 'Only freelancers can create gigs.' };
  }

  // 2. Validate form input
  const result = CreateGigSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const { title, description, category, price, deliveryTimeDays, coverImage } =
    result.data;

  try {
    await connectDB();

    const newGig = await Gig.create({
      title,
      description,
      category,
      price,
      deliveryTimeDays,
      coverImage: coverImage || '',
      freelancerId: payload.userId,
    });

    
    revalidatePath('/');
    revalidatePath('/dashboard/freelancer');

    return { success: true, gigId: newGig._id.toString() };
  } catch (error: unknown) {
    console.error('Create gig error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to create gig.';
    return { success: false, error: message };
  }
}