'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FreelancerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navTabs = [
    { name: 'Overview', href: '/dashboard/freelancer' },
    { name: 'My Gigs', href: '/dashboard/freelancer/gigs' },
    { name: 'Orders', href: '/dashboard/freelancer/orders' },
    { name: 'Profile Settings', href: '/dashboard/freelancer/profile' },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] text-black antialiased">
      {/* 1. Dashboard Top Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-black tracking-tight text-black">
              Vision<span style={{ color: '#178f23' }}>LK</span>
            </Link>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              Seller Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Public Profile View Shortcut Button */}
            <Link
              href="/freelancers/me"
              target="_blank"
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:border-black hover:text-black"
            >
              <span>View Public Profile</span>
              <span className="text-gray-400">↗</span>
            </Link>

            <Link
              href="/api/auth/signout"
              className="text-xs font-medium text-gray-500 hover:text-red-600 transition"
            >
              Sign Out
            </Link>
          </div>
        </div>

        {/* 2. Sub-Navigation Tabs */}
        <div className="border-t border-gray-100 bg-white">
          <div className="mx-auto flex max-w-7xl gap-8 px-4 sm:px-6 lg:px-8">
            {navTabs.map((tab) => {
              const isActive =
                tab.href === '/dashboard/freelancer'
                  ? pathname === '/dashboard/freelancer'
                  : pathname.startsWith(tab.href);

              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`py-3 text-sm font-semibold border-b-2 transition ${
                    isActive
                      ? 'border-[#178f23] text-[#178f23]'
                      : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* 3. Dynamic Page Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}