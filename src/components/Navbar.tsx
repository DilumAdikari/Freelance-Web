'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/actions/auth';

interface IUserState {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export default function Navbar() {
  const [user, setUser] = useState<IUserState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await getCurrentUser();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to fetch user in navbar:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const isFreelancer = user?.role?.toLowerCase() === 'freelancer';
  const isClient = user?.role?.toLowerCase() === 'client';

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="text-2xl font-black tracking-tight text-black">
          Vision<span style={{ color: '#178f23' }}>LK</span>
        </Link>

        {/* Right Side Navigation */}
        <div className="flex items-center gap-4 sm:gap-6">
          {loading ? (
            // Auth check වෙනකම් පොඩි placeholder එකක්
            <div className="h-8 w-20 animate-pulse rounded-lg bg-gray-100" />
          ) : user ? (
            // ================= LOGGED-IN VIEW =================
            <>
              {/* Role-based Dashboard Link */}
              <Link
                href={isClient ? '/dashboard/client' : '/dashboard/freelancer'}
                className="text-xs font-bold text-gray-700 hover:text-black transition"
              >
                Dashboard
              </Link>

              {/* Role-based Orders Link */}
              <Link
                href={isClient ? '/dashboard/client/orders' : '/dashboard/freelancer/orders'}
                className="text-xs font-semibold text-gray-600 hover:text-black transition"
              >
                Orders
              </Link>

              {/* Freelancer ට පමණක් + Post a Gig පෙන්වයි (Client ට සම්පූර්ණයෙන්ම සඟවයි) */}
              {isFreelancer && (
                <Link
                  href="/dashboard/freelancer/gigs/new"
                  className="hidden sm:inline-block rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-black hover:text-black transition"
                >
                  + Post a Gig
                </Link>
              )}

              {/* User Avatar */}
              <Link
                href={isClient ? '/dashboard/client' : '/dashboard/freelancer/profile'}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-bold text-white shadow-sm ring-2 ring-transparent transition hover:ring-[#178f23] overflow-hidden"
                title="Profile & Settings"
              >
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  user.name ? user.name.charAt(0).toUpperCase() : 'U'
                )}
              </Link>
            </>
          ) : (
            // ================= GUEST / LOGGED-OUT VIEW =================
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 transition hover:text-black"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Join
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}