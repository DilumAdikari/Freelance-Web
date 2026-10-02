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

// 1. තනි පුද්ගලයෙකු සමඟ ඇති messages ලබා ගැනීම
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

// 2. අලුත් message එකක් යැවීම සහ Pusher මඟින් trigger කිරීම
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

// 3. User ගේ සියලුම active conversations list එක ලබා ගැනීම (Missing export)
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

    const messages = await Message.find({
      $or: [{ senderId: currentUserObjId }, { receiverId: currentUserObjId }],
    })
      .sort({ createdAt: -1 })
      .populate('senderId', 'name email role')
      .populate('receiverId', 'name email role')
      .lean();

    const conversationsMap = new Map<string, IConversationSummary>();

    for (const msg of messages) {
      const sender = msg.senderId as any;
      const receiver = msg.receiverId as any;

      const isSender = String(sender?._id || sender) === currentUserId;
      const otherUser = isSender ? receiver : sender;

      if (!otherUser || !otherUser._id) continue;

      const otherUserId = String(otherUser._id);

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          userName: otherUser.name || 'User',
          userEmail: otherUser.email || '',
          userRole: otherUser.role || 'client',
          lastMessage: (msg as any).text,
          lastMessageTime: new Date((msg as any).createdAt).toLocaleDateString('en-US', {
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
    return { success: false, conversations: [], error: 'Failed to load conversations' };
  }
}

// 4. කියවා නැති messages ගණන ලබා ගැනීම
export async function getUnreadMessagesCount(): Promise<{ success: boolean; count: number }> {
  try {
    const currentUserId = await getUserIdFromToken();
    if (!currentUserId) return { success: false, count: 0 };

    await connectDB();

    const count = await Message.countDocuments({
      receiverId: new mongoose.Types.ObjectId(currentUserId),
      isRead: false,
    });

    return { success: true, count };
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return { success: false, count: 0 };
  }
}