'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createGigAction } from '@/actions/gig';

const CATEGORIES = [
  'Web Development',
  'Graphic Design',
  'Digital Marketing',
  'Content Writing',
  'Video & Animation',
  'AI Services',
];

export default function NewGigPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      category: formData.get('category'),
      description: formData.get('description'),
      price: formData.get('price'),
      deliveryTimeDays: formData.get('deliveryTimeDays'),
      coverImage: formData.get('coverImage'),
    };

    const res = await createGigAction(data);

    if (!res.success) {
      setError(res.error || 'Failed to create gig');
      setLoading(false);
      return;
    }

    router.push('/dashboard/freelancer');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create a New Gig</h1>
            <p className="text-sm text-gray-500">List your professional service for clients</p>
          </div>
          <Link
            href="/dashboard/freelancer"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Cancel
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Gig Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will build a full-stack web application in Next.js"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              required
              defaultValue=""
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
            >
              <option value="" disabled>Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              rows={5}
              placeholder="Describe what services you offer, technologies used, and what clients will get..."
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Starting Price ($ USD)</label>
              <input
                type="number"
                name="price"
                min="5"
                defaultValue="20"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Delivery Time (Days)</label>
              <input
                type="number"
                name="deliveryTimeDays"
                min="1"
                defaultValue="3"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cover Image URL (Optional)</label>
            <input
              type="url"
              name="coverImage"
              placeholder="https://images.unsplash.com/..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Publishing Gig...' : 'Publish Gig'}
          </button>
        </form>
      </div>
    </div>
  );
}