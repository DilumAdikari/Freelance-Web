'use server';

import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { RegisterSchema, LoginSchema } from '@/lib/validations/auth';
import { signToken, setAuthCookie, removeAuthCookie } from '@/lib/auth';

export async function registerAction(formData: unknown) {
  const result = RegisterSchema.safeParse(formData);

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const { name, email, password, role } = result.data;

  try {
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, error: 'Email is already registered' };
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      passwordHash,
      role,
    });

    const token = signToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    });

    await setAuthCookie(token);

    return { success: true, role: newUser.role };
  } catch (error: unknown) {
    console.error('Registration error:', error);
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to create account. Please try again.';
    return {
      success: false,
      error: message,
    };
  }
}

export async function loginAction(formData: unknown) {
  const result = LoginSchema.safeParse(formData);

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const { email, password } = result.data;

  try {
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return { success: false, error: 'Invalid email or password' };
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    await setAuthCookie(token);

    return { success: true, role: user.role };
  } catch (error: unknown) {
    console.error('Login error:', error);
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to login. Please try again.';
    return {
      success: false,
      error: message,
    };
  }
}

export async function logoutAction() {
  await removeAuthCookie();
  return { success: true };
}