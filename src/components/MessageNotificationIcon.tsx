'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUnreadMessagesCount } from '@/actions/chat';

export default function MessageNotificationIcon() {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    async function fetchCount() {
      const res = await getUnreadMessagesCount();
      if (res.success) {
        setUnreadCount(res.count);
      }
    }

    fetchCount();
    const interval = setInterval(fetchCount, 5000); // තත්පර 5කට වරක් අලුත් මැසේජ් පරීක්ෂා කරයි
    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      href="/inbox"
      className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-700 hover:text-black"
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

      {/* Unread Notification Badge */}
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white shadow-xs">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
}