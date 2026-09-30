'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getFreelancerOrders, IOrderTableItem } from '@/actions/orders';

type OrderStatus = 'ALL' | 'ACTIVE' | 'UNDER_REVIEW' | 'COMPLETED' | 'CANCELLED';

export default function FreelancerOrdersPage() {
  const [orders, setOrders] = useState<IOrderTableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderStatus>('ALL');

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      const res = await getFreelancerOrders();
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
      setLoading(false);
    }
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'ACTIVE') return order.status === 'In Progress';
    if (activeTab === 'UNDER_REVIEW') return order.status === 'Under Review';
    if (activeTab === 'COMPLETED') return order.status === 'Completed';
    if (activeTab === 'CANCELLED') return order.status === 'Cancelled';
    return true;
  });

  const getStatusBadge = (status: IOrderTableItem['status']) => {
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
    <div className="space-y-6 antialiased text-black">
      {/* Page Title */}
      <div className="flex flex-col gap-2 pb-5 border-b border-gray-200 sm:flex-row sm:items-center sm:justify-between">
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
      <div className="flex flex-wrap gap-2 pb-3 border-b border-gray-200">
        {(['ALL', 'ACTIVE', 'UNDER_REVIEW', 'COMPLETED', 'CANCELLED'] as OrderStatus[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === tab
                ? 'bg-black text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-black hover:text-black'
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

      {/* Loading, Empty State, or Orders Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 p-12 bg-white border border-gray-200 shadow-xs rounded-3xl">
          <span className="w-6 h-6 border-2 border-black rounded-full animate-spin border-t-transparent" />
          <p className="text-xs font-semibold text-gray-500">Loading orders from database...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-white border border-gray-300 border-dashed shadow-sm rounded-3xl">
          <div className="flex items-center justify-center w-12 h-12 mx-auto text-2xl bg-gray-100 rounded-2xl">
            📦
          </div>
          <h3 className="mt-4 text-base font-bold text-black">No orders found</h3>
          <p className="max-w-sm mx-auto mt-1 text-xs text-gray-500">
            There are currently no orders in this category. New client orders will be listed here automatically.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="border-b border-gray-100 bg-gray-50/75 font-semibold uppercase tracking-wider text-gray-400">
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
              <tbody className="font-medium text-gray-700 divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="transition hover:bg-gray-50/60">
                    <td className="py-4 pl-6 pr-3 font-bold text-black">
                      {order.orderNumber}
                    </td>

                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center text-xs font-bold text-gray-700 bg-gray-100 border border-gray-200 rounded-full h-7 w-7">
                          {order.clientName ? order.clientName.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <p className="font-semibold text-black">{order.clientName}</p>
                          <p className="text-[10px] text-gray-400">{order.clientEmail}</p>
                        </div>
                      </div>
                    </td>

                    <td className="max-w-xs px-3 py-4 font-medium text-black truncate">
                      {order.gigTitle}
                    </td>

                    <td className="px-3 py-4 font-medium text-gray-500">
                      {order.dueDate}
                    </td>

                    <td className="px-3 py-4 font-bold text-black">
                      ${order.amount}
                    </td>

                    <td className="px-3 py-4">
                      {getStatusBadge(order.status)}
                    </td>

                    <td className="py-4 pl-3 pr-6 text-right">
                      <Link
                        href={`/dashboard/freelancer/orders/${order._id}`}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-[11px] font-semibold text-gray-700 transition hover:border-black hover:text-black"
                      >
                        {order.status === 'In Progress' ? 'Deliver Work' : 'View Order'}
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