'use server';

import {
  FreelancerProfile,
  IEducation,
  ICertificate,
} from '@/models/FreelancerProfile';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { revalidatePath } from 'next/cache';

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

export async function getFreelancerProfile() {
  try {
    const userId = await getUserIdFromToken();
    if (!userId) return { success: false, error: 'Unauthorized' };

    await connectDB();

    const user = await User.findById(userId).select('name email role').lean();
    if (!user) return { success: false, error: 'User not found' };

    let profile = await FreelancerProfile.findOne({ userId }).lean();

    if (!profile) {
      const newProfile = await FreelancerProfile.create({
        userId,
        headline: '',
        hourlyRate: 20,
        description: '',
        skills: [],
        education: [],
        certificates: [],
      });
      profile = newProfile.toObject();
    }

    return {
      success: true,
      user: JSON.parse(JSON.stringify(user)),
      profile: JSON.parse(JSON.stringify(profile)),
    };
  } catch (error) {
    console.error('Error fetching freelancer profile:', error);
    return { success: false, error: 'Failed to fetch profile' };
  }
}

export async function updateFreelancerProfile(data: {
  name?: string;
  headline?: string;
  hourlyRate?: number;
  description?: string;
  skills?: string[];
  education?: IEducation[];
  certificates?: ICertificate[];
  github?: string;
  linkedin?: string;
}) {
  try {
    const userId = await getUserIdFromToken();
    if (!userId) return { success: false, error: 'Unauthorized' };

    await connectDB();

    if (data.name) {
      await User.findByIdAndUpdate(userId, { name: data.name });
    }

    const updatedProfile = await FreelancerProfile.findOneAndUpdate(
      { userId },
      {
        $set: {
          headline: data.headline,
          hourlyRate: data.hourlyRate,
          description: data.description,
          skills: data.skills,
          education: data.education,
          certificates: data.certificates,
          github: data.github,
          linkedin: data.linkedin,
        },
      },
      { new: true, upsert: true }
    ).lean();

    revalidatePath('/dashboard/freelancer/profile');
    return {
      success: true,
      profile: JSON.parse(JSON.stringify(updatedProfile)),
    };
  } catch (error) {
    console.error('Error updating freelancer profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}