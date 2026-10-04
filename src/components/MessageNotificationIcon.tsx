'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUnreadMessagesCount } from '@/actions/chat';
import { pusherClient } from '@/lib/pusher-client';

interface MessageNotificationIconProps {
  currentUserId?: string;
}

export default function MessageNotificationIcon({ currentUserId }: MessageNotificationIconProps) {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await getUnreadMessagesCount();
        if (res.success) {
          setUnreadCount(res.count);
        }
      } catch (err) {
        console.error('Failed to fetch unread count:', err);
      }
    }

    fetchCount();
    const interval = setInterval(fetchCount, 15000);

    if (currentUserId) {
      const channelName = `user-${currentUserId}`;
      const channel = pusherClient.subscribe(channelName);

      
      channel.bind('notification', () => {
        setUnreadCount((prev) => prev + 1);
      });

      
      channel.bind('read-notifications', () => {
        setUnreadCount(0);
      });

      return () => {
        clearInterval(interval);
        channel.unbind('notification');
        channel.unbind('read-notifications');
        pusherClient.unsubscribe(channelName);
      };
    }

    return () => clearInterval(interval);
  }, [currentUserId]);

  return (
    <Link
      href="/inbox"
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 hover:text-black"
      title="Messages"
    >
      {/* Mail Icon SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
        />
      </svg>

      {/* Fiverr Style Little Red Dot */}
      {unreadCount > 0 && (
        <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600 border border-white"></span>
        </span>
      )}
    </Link>
  );
}