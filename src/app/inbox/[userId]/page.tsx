'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getConversation, sendMessageAction, markMessagesAsRead } from '@/actions/chat';
import { pusherClient } from '@/lib/pusher-client';

interface IMessageItem {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
}

interface IOtherUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function ChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const receiverId = (params?.userId as string) || '';
  const gigId = searchParams.get('gigId') || undefined;

  const [messages, setMessages] = useState<IMessageItem[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [otherUser, setOtherUser] = useState<IOtherUser | null>(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    async function loadChat() {
      if (!receiverId) return;
      try {
        const res = await getConversation(receiverId);
        if (res.success) {
          setMessages(res.messages);
          setCurrentUserId(res.currentUserId || '');
          setOtherUser(res.otherUser);

          
          await markMessagesAsRead(receiverId);

          
          window.dispatchEvent(new Event('messages-read-locally'));
        }
      } catch (err) {
        console.error('Failed to load conversation:', err);
      } finally {
        setLoading(false);
        setTimeout(scrollToBottom, 100);
      }
    }

    loadChat();
  }, [receiverId]);

  // Real-time Pusher Event Listener
  useEffect(() => {
    if (!currentUserId || !receiverId) return;

    const chatRoomId = [currentUserId, receiverId].sort().join('-');
    const channelName = `chat-${chatRoomId}`;
    const channel = pusherClient.subscribe(channelName);

    channel.bind('new-message', (data: IMessageItem) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === data._id)) return prev;
        return [...prev, data];
      });

      if (data.senderId === receiverId) {
        markMessagesAsRead(receiverId);
        window.dispatchEvent(new Event('messages-read-locally'));
      }

      setTimeout(scrollToBottom, 50);
    });

    return () => {
      channel.unbind('new-message');
      pusherClient.unsubscribe(channelName);
    };
  }, [currentUserId, receiverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    const messageText = inputText;
    setInputText('');
    setSending(true);

    const res = await sendMessageAction(receiverId, messageText, gigId);
    setSending(false);

    if (res.success && res.message) {
      setMessages((prev) => {
        if (prev.some((m) => m._id === res.message._id)) return prev;
        return [...prev, res.message];
      });
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50 text-black">
      <Navbar />

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col overflow-hidden px-4 py-6 sm:px-6">
        <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xs">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                {otherUser?.name ? otherUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{otherUser?.name || 'User'}</h3>
                <span className="text-[11px] font-medium text-emerald-600">● Live Chat</span>
              </div>
            </div>

            {gigId && (
              <Link
                href={`/gigs/${gigId}`}
                className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-black transition"
              >
                View Gig &nearr;
              </Link>
            )}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {loading ? (
              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                Connecting to live chat...
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <span className="text-3xl">💬</span>
                <p className="mt-2 text-xs font-semibold text-gray-500">Start the conversation</p>
                <p className="text-[11px] text-gray-400">
                  Ask about requirements, custom offers, or timelines.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.senderId === currentUserId;
                return (
                  <div
                    key={msg._id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed ${
                        isMine
                          ? 'bg-[#178f23] text-white rounded-br-xs'
                          : 'bg-gray-100 text-gray-900 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="mt-1 text-[10px] text-gray-400">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Send Input */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-100 p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Write a message..."
                className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-black focus:border-black focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={sending || !inputText.trim()}
                className="rounded-2xl bg-black px-6 py-3 text-xs font-bold text-white transition hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}