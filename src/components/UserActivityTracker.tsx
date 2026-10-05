'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { updateUserActiveStatus } from '@/actions/userStatus';

export default function UserActivityTracker() {
  const pathname = usePathname();

  
  useEffect(() => {
    updateUserActiveStatus();
  }, [pathname]);

  
  useEffect(() => {
    const interval = setInterval(() => {
      updateUserActiveStatus();
    }, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}