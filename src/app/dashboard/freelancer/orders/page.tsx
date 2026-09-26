'use client';

import { useState } from 'react';
import Link from 'next/link';

type OrderStatus = 'ALL' | 'ACTIVE' | 'UNDER_REVIEW' | 'COMPLETED' | 'CANCELLED';

interface IOrder {
  id: string;
  orderNumber: string;
  clientName: string;
  clientAvatar?: string;
  gigTitle: string;
  amount: number;
  deliveryDueDate: string;
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export default function FreelancerOrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('ALL');

  // සටහන: Backend Order collection එක හැදූ පසු මේවා dynamic කරනු ලැබේ
  const orders: IOrder[] = [
    {
      id: '1',
      orderNumber: 'VLK-10928',
      clientName: 'Alex Morgan',
      gigTitle: 'Modern Full-Stack Next.js 16 Web Application',
      amount: 350,
      deliveryDueDate: 'Oct 2, 2026',
      status: 'ACTIVE',
      createdAt: 'Sep 24, 2026',
    },
    {
      id: '2',
      orderNumber: 'VLK-10842',
      clientName: 'Sarah Jenkins',
      gigTitle: 'Responsive Tailwind CSS Landing Page',
      amount: 150,
      deliveryDueDate: 'Sep 28, 2026',
      status: 'UNDER_REVIEW',
      createdAt: 'Sep 21, 2026',
    },
    {
      id: '3',
      orderNumber: 'VLK-10512',
      clientName: 'David Miller',
      gigTitle: 'Fiverr Clone UI & MERN Architecture',
      amount: 500,
      deliveryDueDate: 'Sep 15, 2026',
      status: 'COMPLETED',
      createdAt: 'Sep 10, 2026',
    },
  ];

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'ALL') return true;
    return order.status === activeTab;
  });

  const getStatusBadge = (status: IOrder['status']) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
            In Progress
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
            Under Review
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-black sm:text-3xl">
            Manage Orders
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Keep track of incoming requests, delivery deadlines, and completed client deliverables.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {(['ALL', 'ACTIVE', 'UNDER_REVIEW', 'COMPLETED', 'CANCELLED'] as OrderStatus[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === tab
                ? 'bg-black text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-black hover:text-black'
            }`}
          >
            {tab === 'ALL'
              ? 'All Orders'
              : tab === 'UNDER_REVIEW'
              ? 'Under Review'
              : tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Orders Table or Empty State */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
            📦
          </div>
          <h3 className="mt-4 text-base font-bold text-black">No orders found</h3>
          <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
            There are currently no orders in this category. New client orders will be listed here automatically.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 bg-gray-50/75 text-gray-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 pl-6 pr-3">Order</th>
                  <th className="py-3.5 px-3">Client</th>
                  <th className="py-3.5 px-3">Gig Service</th>
                  <th className="py-3.5 px-3">Due Date</th>
                  <th className="py-3.5 px-3">Amount</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 pl-3 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-4 pl-6 pr-3 font-bold text-black">
                      {order.orderNumber}
                    </td>

                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-700 border border-gray-200">
                          {order.clientName.charAt(0)}
                        </div>
                        <span className="font-semibold text-black">{order.clientName}</span>
                      </div>
                    </td>

                    <td className="py-4 px-3 max-w-xs truncate text-black font-medium">
                      {order.gigTitle}
                    </td>

                    <td className="py-4 px-3 text-gray-500 font-medium">
                      {order.deliveryDueDate}
                    </td>

                    <td className="py-4 px-3 font-bold text-black">
                      ${order.amount}
                    </td>

                    <td className="py-4 px-3">
                      {getStatusBadge(order.status)}
                    </td>

                    <td className="py-4 pl-3 pr-6 text-right">
                      <Link
                        href={`/dashboard/freelancer/orders/${order.id}`}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-[11px] font-semibold text-gray-700 hover:border-black hover:text-black transition"
                      >
                        {order.status === 'ACTIVE' ? 'Deliver Work' : 'View Order'}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}