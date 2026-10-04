'use server';

import mongoose from 'mongoose';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import { Message } from '@/models/Message';
import { User } from '@/models/User';
import { pusherServer } from '@/lib/pusher-server';

export interface IConversationSummary {
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  lastMessage: string;
  lastMessageTime: string;
}

interface IPopulatedUser {
  _id: mongoose.Types.ObjectId | string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
}

interface IPopulatedMessage {
  _id: mongoose.Types.ObjectId | string;
  senderId: IPopulatedUser | mongoose.Types.ObjectId | string;
  receiverId: IPopulatedUser | mongoose.Types.ObjectId | string;
  text: string;
  createdAt: string | Date;
}

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
    if (!currentUserId || !receiverId) return { success: false, error: 'Unauthorized', messages: [] };

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

export async function sendMessageAction(receiverId: string, text: string, gigId?: string) {
  try {
    const senderId = await getUserIdFromToken();
    if (!senderId) return { success: false, error: 'Please log in to chat' };

    if (!text.trim()) return { success: false, error: 'Message cannot be empty' };

    await connectDB();

    const senderUser = await User.findById(senderId).select('name avatar').lean();

    const newMessage = await Message.create({
      senderId: new mongoose.Types.ObjectId(senderId),
      receiverId: new mongoose.Types.ObjectId(receiverId),
      gigId: gigId ? new mongoose.Types.ObjectId(gigId) : undefined,
      text: text.trim(),
      isRead: false,
    });

    const serializedMsg = JSON.parse(JSON.stringify(newMessage));

    // 1. Chat Room Event Trigger
    const chatRoomId = [senderId, receiverId].sort().join('-');
    await pusherServer.trigger(`chat-${chatRoomId}`, 'new-message', serializedMsg);

    // 2. Receiver Personal Notification Event Trigger
    await pusherServer.trigger(`user-${receiverId}`, 'notification', {
      senderId,
      senderName: senderUser?.name || 'User',
      text: text.trim(),
      createdAt: serializedMsg.createdAt,
    });

    return {
      success: true,
      message: serializedMsg,
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: 'Failed to send message' };
  }
}

export async function getUserConversations(): Promise<{
  success: boolean;
  conversations: IConversationSummary[];
  error?: string;
}> {
  try {
    const currentUserId = await getUserIdFromToken();
    if (!currentUserId) {
      return { success: false, conversations: [], error: 'Unauthorized' };
    }

    await connectDB();

    const currentUserObjId = new mongoose.Types.ObjectId(currentUserId);

    const rawMessages = await Message.find({
      $or: [{ senderId: currentUserObjId }, { receiverId: currentUserObjId }],
    })
      .sort({ createdAt: -1 })
      .populate('senderId', 'name email role')
      .populate('receiverId', 'name email role')
      .lean();

    const messages = rawMessages as unknown as IPopulatedMessage[];
    const conversationsMap = new Map<string, IConversationSummary>();

    for (const msg of messages) {
      const sender = typeof msg.senderId === 'object' && msg.senderId !== null ? (msg.senderId as IPopulatedUser) : null;
      const receiver = typeof msg.receiverId === 'object' && msg.receiverId !== null ? (msg.receiverId as IPopulatedUser) : null;

      const senderIdStr = sender?._id ? String(sender._id) : String(msg.senderId);
      const isSender = senderIdStr === currentUserId;
      const otherUser = isSender ? receiver : sender;

      if (!otherUser || !otherUser._id) continue;

      const otherUserId = String(otherUser._id);

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          userName: otherUser.name || 'User',
          userEmail: otherUser.email || '',
          userRole: otherUser.role || 'client',
          lastMessage: msg.text,
          lastMessageTime: new Date(msg.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        });
      }
    }

    return {
      success: true,
      conversations: Array.from(conversationsMap.values()),
    };
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return { success: false,conversations: [], error: 'Failed to fetch conversations' };
  }
}


export async function getUnreadMessagesCount(): Promise<{ success: boolean; count: number }> {
  try {
    const currentUserId = await getUserIdFromToken();
    if (!currentUserId) return { success: false, count: 0 };

    await connectDB();

    const count = await Message.countDocuments({
      receiverId: new mongoose.Types.ObjectId(currentUserId),
      isRead: { $ne: true },
    });

    return { success: true, count };
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return { success: false, count: 0 };
  }
}


export async function markMessagesAsRead(senderId: string) {
  try {
    const currentUserId = await getUserIdFromToken();
    if (!currentUserId || !senderId || !mongoose.Types.ObjectId.isValid(senderId)) {
      return { success: false };
    }

    await connectDB();

    await Message.updateMany(
      {
        senderId: new mongoose.Types.ObjectId(senderId),
        receiverId: new mongoose.Types.ObjectId(currentUserId),
        isRead: { $ne: true },
      },
      { $set: { isRead: true } }
    );

    
    await pusherServer.trigger(`user-${currentUserId}`, 'read-notifications', {
      readBy: currentUserId,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to mark read:', error);
    return { success: false };
  }
}