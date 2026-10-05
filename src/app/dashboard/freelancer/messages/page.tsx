'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUserConversations, IConversationSummary } from '@/actions/chat';

export default function FreelancerDashboardMessagesPage() {
  const [conversations, setConversations] = useState<IConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getUserConversations();
        if (res.success) {
          setConversations(res.conversations);
        }
      } catch (err) {
        console.error('Failed to load conversations:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Messages & Inquiries
          </h1>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Communicate with your clients, answer gig questions, and manage work orders in real-time.
          </p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          ● {conversations.length} Active {conversations.length === 1 ? 'Chat' : 'Chats'}
        </span>
      </div>

      {/* Conversations List */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 p-12 text-xs font-semibold text-gray-400">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent" />
            <p>Loading messages...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <span className="text-4xl">💬</span>
            <h3 className="mt-3 text-sm font-bold text-gray-900">No conversations yet</h3>
            <p className="mt-1 text-xs text-gray-500">
              When clients contact you about your services, their messages will show up here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {conversations.map((conv) => (
              <div
                key={conv.userId}
                className="flex items-center justify-between p-5 transition hover:bg-gray-50/70"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-sm font-bold text-white shadow-xs">
                    {conv.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-gray-900">{conv.userName}</h4>
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase text-gray-600">
                        {conv.userRole}
                      </span>
                    </div>
                    <p className="mt-0.5 max-w-md truncate text-xs text-gray-500">
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-[11px] font-medium text-gray-400">
                    {conv.lastMessageTime}
                  </span>
                  <Link
                    href={`/inbox/${conv.userId}`}
                    className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    Open Chat &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}