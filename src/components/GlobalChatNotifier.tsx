'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { pusherClient } from '@/lib/pusher-client';

interface INotificationData {
  senderId: string;
  senderName: string;
  text: string;
}

export default function GlobalChatNotifier({ currentUserId }: { currentUserId?: string }) {
  const [toast, setToast] = useState<INotificationData | null>(null);

  useEffect(() => {
    if (!currentUserId) return;

    const channel = pusherClient.subscribe(`user-${currentUserId}`);

    channel.bind('notification', (data: INotificationData) => {
      setToast(data);

      
      const timer = setTimeout(() => {
        setToast(null);
      }, 6000);

      return () => clearTimeout(timer);
    });

    return () => {
      channel.unbind('notification');
      pusherClient.unsubscribe(`user-${currentUserId}`);
    };
  }, [currentUserId]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex max-w-sm animate-bounce-in items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl transition">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
        {toast.senderName.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-gray-900">{toast.senderName}</h4>
          <button
            onClick={() => setToast(null)}
            className="text-gray-400 hover:text-black text-sm leading-none"
          >
            ✕
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-600 line-clamp-2 leading-relaxed">
          {toast.text}
        </p>
        <Link
          href={`/inbox/${toast.senderId}`}
          onClick={() => setToast(null)}
          className="mt-2 inline-block text-[11px] font-bold text-[#178f23] hover:underline"
        >
          Reply Now &rarr;
        </Link>
      </div>
    </div>
  );
}