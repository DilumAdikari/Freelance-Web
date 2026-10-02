'use server';

import mongoose from 'mongoose';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import { Message } from '@/models/Message';
import { User } from '@/models/User';
import { pusherServer } from '@/lib/pusher-server';

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

export async function getConversation(receiverId: string) {
  try {
    const currentUserId = await getUserIdFromToken();
    if (!currentUserId) return { success: false, error: 'Unauthorized', messages: [] };

    await connectDB();

    const otherUser = await User.findById(receiverId).select('name email role avatar').lean();

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: receiverId },
        { senderId: receiverId, receiverId: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    return {
      success: true,
      currentUserId,
      otherUser: JSON.parse(JSON.stringify(otherUser)),
      messages: JSON.parse(JSON.stringify(messages)),
    };
  } catch (error) {
    console.error('Error fetching messages:', error);
    return { success: false, error: 'Failed to fetch messages', messages: [] };
  }
}

// Message යැවීම සහ Pusher එකෙන් Real-time Broadcast කිරීම
export async function sendMessageAction(receiverId: string, text: string, gigId?: string) {
  try {
    const senderId = await getUserIdFromToken();
    if (!senderId) return { success: false, error: 'Please log in to chat' };

    if (!text.trim()) return { success: false, error: 'Message cannot be empty' };

    await connectDB();

    const newMessage = await Message.create({
      senderId: new mongoose.Types.ObjectId(senderId),
      receiverId: new mongoose.Types.ObjectId(receiverId),
      gigId: gigId ? new mongoose.Types.ObjectId(gigId) : undefined,
      text: text.trim(),
    });

    const serializedMsg = JSON.parse(JSON.stringify(newMessage));

    const chatRoomId = [senderId, receiverId].sort().join('-');
    await pusherServer.trigger(`chat-${chatRoomId}`, 'new-message', serializedMsg);

    return {
      success: true,
      message: serializedMsg,
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: 'Failed to send message' };
  }
}