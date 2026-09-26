import Link from 'next/link';

interface NavbarProps {
  isLoggedIn?: boolean;
  userRole?: 'FREELANCER' | 'CLIENT';
}

export default function Navbar({
  isLoggedIn = false,
  userRole = 'FREELANCER',
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="text-2xl font-black tracking-tight text-black">
          Vision<span style={{ color: '#178f23' }}>LK</span>
        </Link>

        {/* Right Side Navigation Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          {isLoggedIn ? (
            // 1. LOGGED-IN USERS (Marketplace View)
            <>
              <Link
                href={userRole === 'CLIENT' ? '/dashboard/client' : '/dashboard/freelancer'}
                className="text-xs font-bold text-gray-700 hover:text-black transition"
              >
                Dashboard
              </Link>

              <Link
                href="/dashboard/freelancer/orders"
                className="text-xs font-semibold text-gray-600 hover:text-black transition"
              >
                Orders
              </Link>

              <Link
                href="/dashboard/freelancer/gigs/new"
                className="hidden sm:inline-block rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-black hover:text-black transition"
              >
                + Post a Gig
              </Link>

              {/* User Avatar & Profile Link */}
              <Link
                href="/dashboard/freelancer/profile"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-bold text-white shadow-sm ring-2 ring-transparent transition hover:ring-[#178f23]"
                title="Profile & Settings"
              >
                D
              </Link>
            </>
          ) : (
            // 2. GUEST / LOGGED-OUT USERS (Landing Page View)
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