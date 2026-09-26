import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import { Gig } from '@/models/Gig';
import '@/models/User';


async function getFreelancerStats(userId?: string) {
  try {
    await connectDB();

    const gigFilter = userId ? { freelancerId: userId } : {};
    const totalGigs = await Gig.countDocuments(gigFilter);

   
    const activeOrders = 0;
    const completedOrders = 0;
    const totalEarnings = 0;

    return {
      totalGigs,
      activeOrders,
      completedOrders,
      totalEarnings,
    };
  } catch (error) {
    console.error('Failed to load freelancer stats:', error);
    return {
      totalGigs: 0,
      activeOrders: 0,
      completedOrders: 0,
      totalEarnings: 0,
    };
  }
}

export default async function FreelancerDashboardPage() {
  const stats = await getFreelancerStats();

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-black sm:text-3xl tracking-tight">
            Freelancer Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Monitor your active gigs, orders, and overall performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/freelancer/gigs"
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-black transition hover:border-black"
          >
            Manage Gigs
          </Link>
          <Link
            href="/dashboard/freelancer/gigs/new"
            className="rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-gray-800"
          >
            + Create Gig
          </Link>
        </div>
      </div>

      {/* Dynamic Metrics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Gigs (Dynamic from MongoDB) */}
        <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Active Gigs
            </span>
            <span className="text-2xl">⚡</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-black">{stats.totalGigs}</span>
            <p className="mt-1 text-xs font-medium" style={{ color: '#178f23' }}>
              Published services
            </p>
          </div>
        </div>

        {/* Active Orders */}
        <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Active Orders
            </span>
            <span className="text-2xl">📦</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-black">{stats.activeOrders}</span>
            <p className="mt-1 text-xs text-gray-400 font-medium">In progress</p>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Completed Orders
            </span>
            <span className="text-2xl">✅</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-black">{stats.completedOrders}</span>
            <p className="mt-1 text-xs text-gray-400 font-medium">Delivered & approved</p>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Earnings
            </span>
            <span className="text-2xl">💰</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-black">
              ${stats.totalEarnings.toFixed(2)}
            </span>
            <p className="mt-1 text-xs font-medium" style={{ color: '#178f23' }}>
              Available balance
            </p>
          </div>
        </div>
      </div>

      {/* Quick Status Box */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-black">Orders Overview</h2>
        <p className="mt-1 text-xs text-gray-500">
          When clients purchase your gigs, active orders and delivery countdowns will appear here.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-10 text-center">
          <span className="text-3xl">📥</span>
          <p className="mt-2 text-xs font-medium text-gray-600">No active orders right now.</p>
          <Link
            href="/dashboard/freelancer/gigs/new"
            className="mt-3 text-xs font-semibold hover:underline"
            style={{ color: '#178f23' }}
          >
            Create more gigs to increase your visibility &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}