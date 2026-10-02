'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getClientDashboardData } from '@/actions/clientDashboard';

interface IClientOrderRow {
  _id: string;
  orderNumber: string;
  freelancerName: string;
  freelancerAvatar: string;
  gigTitle: string;
  dueDate: string;
  amount: number;
  status: 'In Progress' | 'Under Review' | 'Completed' | 'Cancelled';
}

export default function ClientDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    activeOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
  });
  const [recentOrders, setRecentOrders] = useState<IClientOrderRow[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await getClientDashboardData();
      if (res.success) {
        setMetrics(res.metrics);
        setRecentOrders(res.recentOrders);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const getStatusBadge = (status: IClientOrderRow['status']) => {
    switch (status) {
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
            In Progress
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
            Under Review
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black antialiased">
      {/* Top VisionLK Navbar */}
      {/* <Navbar /> */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                Client Dashboard
              </h1>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Manage your hired services, project milestones, and talent collaborations.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-gray-800"
              >
                Explore Services ↗
              </Link>
            </div>
          </header>

          {/* Dynamic Metric Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Active Orders
                </span>
                <span className="text-2xl">⚡</span>
              </div>
              <p className="mt-4 text-3xl font-extrabold text-blue-600">
                {loading ? '-' : metrics.activeOrders}
              </p>
              <p className="mt-1 text-xs text-gray-400">In production & review</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Completed Contracts
                </span>
                <span className="text-2xl">✅</span>
              </div>
              <p className="mt-4 text-3xl font-extrabold text-emerald-600">
                {loading ? '-' : metrics.completedOrders}
              </p>
              <p className="mt-1 text-xs text-gray-400">Delivered successfully</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Total Spent
                </span>
                <span className="text-2xl">💳</span>
              </div>
              <p className="mt-4 text-3xl font-extrabold text-gray-900">
                ${loading ? '0.00' : metrics.totalSpent.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-gray-400">Total payments cleared</p>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Recent Hired Services</h2>
              {recentOrders.length > 0 && (
                <span className="text-xs text-gray-400">Showing last 5 orders</span>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 p-12 text-xs font-semibold text-gray-500">
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  <p>Loading your hired services...</p>
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <span className="text-4xl">🛒</span>
                  <h3 className="mt-3 text-sm font-bold text-gray-900">No active purchases</h3>
                  <p className="mt-1 max-w-sm text-xs text-gray-500">
                    You haven&apos;t placed any orders yet. Browse professional freelance services and hire experts today!
                  </p>
                  <Link
                    href="/"
                    className="mt-4 rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-gray-800"
                  >
                    Browse Marketplace Gigs
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-gray-100 bg-gray-50/75 font-semibold uppercase tracking-wider text-gray-400">
                      <tr>
                        <th className="py-3.5 pl-6 pr-3">Order ID</th>
                        <th className="px-3 py-3.5">Freelancer</th>
                        <th className="px-3 py-3.5">Gig Service</th>
                        <th className="px-3 py-3.5">Due Date</th>
                        <th className="px-3 py-3.5">Price</th>
                        <th className="px-3 py-3.5">Status</th>
                        <th className="py-3.5 pl-3 pr-6 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                      {recentOrders.map((ord) => (
                        <tr key={ord._id} className="transition hover:bg-gray-50/60">
                          <td className="py-4 pl-6 pr-3 font-bold text-black">
                            {ord.orderNumber}
                          </td>
                          <td className="px-3 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-xs font-bold text-gray-700">
                                {ord.freelancerName.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-black">{ord.freelancerName}</span>
                            </div>
                          </td>
                          <td className="max-w-xs truncate px-3 py-4 font-medium text-black">
                            {ord.gigTitle}
                          </td>
                          <td className="px-3 py-4 font-medium text-gray-500">
                            {ord.dueDate}
                          </td>
                          <td className="px-3 py-4 font-bold text-black">
                            ${ord.amount}
                          </td>
                          <td className="px-3 py-4">
                            {getStatusBadge(ord.status)}
                          </td>
                          <td className="py-4 pl-3 pr-6 text-right">
                            <Link
                              href={`/dashboard/client/orders/${ord._id}`}
                              className="rounded-lg border border-gray-200 px-3 py-1.5 text-[11px] font-semibold text-gray-700 transition hover:border-black hover:text-black"
                            >
                              View Deliverables
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}