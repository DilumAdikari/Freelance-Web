'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getUserConversations, IConversationSummary } from '@/actions/chat';

export default function InboxPage() {
  const [conversations, setConversations] = useState<IConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getUserConversations();
        if (res.success && res.conversations) {
          setConversations(res.conversations);
        }
      } catch (err) {
        console.error('Failed to load chats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-black antialiased">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Messages & Inquiries</h1>
            <p className="mt-1 text-xs text-gray-500">
              Communicate with clients and sellers in real-time
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            {conversations.length} Active {conversations.length === 1 ? 'Chat' : 'Chats'}
          </span>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <span className="text-4xl">📬</span>
            <h3 className="mt-3 text-sm font-bold text-gray-800">No Messages Yet</h3>
            <p className="mt-1 text-xs text-gray-400">
              When a client contacts you or sends an inquiry, it will appear here.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-xs font-semibold text-[#178f23] hover:underline"
            >
              Browse Marketplace &rarr;
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xs divide-y divide-gray-100">
            {conversations.map((chat) => (
              <Link
                key={chat.userId}
                href={`/inbox/${chat.userId}`}
                className="flex items-center justify-between p-5 transition hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-base font-bold text-white shadow-xs">
                    {chat.userName ? chat.userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-gray-900">{chat.userName}</h4>
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 uppercase">
                        {chat.userRole}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-1 max-w-md">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-medium text-gray-400">
                    {chat.lastMessageTime}
                  </span>
                  <div className="mt-1">
                    <span className="text-xs font-bold text-[#178f23] hover:underline">
                      Open Chat &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}