'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createGigAction } from '@/actions/gig';

const STEPS = [
  { id: 1, name: 'Overview' },
  { id: 2, name: 'Pricing' },
  { id: 3, name: 'Description' },
  { id: 4, name: 'Media' },
  { id: 5, name: 'Publish' },
];

const CATEGORIES = [
  'Web Development',
  'Graphic Design',
  'Digital Marketing',
  'Writing & Translation',
  'Video & Animation',
  'AI Services',
];

export default function CreateNewGigPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: 20,
    deliveryTimeDays: 3,
    description: '',
    coverImage: '',
  });

  // Step Validation logic
  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.title.trim().length >= 10 && formData.category !== '';
    }
    if (currentStep === 2) {
      return Number(formData.price) >= 5 && Number(formData.deliveryTimeDays) >= 1;
    }
    if (currentStep === 3) {
      return formData.description.trim().length >= 30;
    }
    return true;
  };

  const handleNext = () => {
    if (isStepValid()) {
      setError(null);
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    } else {
      if (currentStep === 1) {
        setError('Please provide a descriptive title (min 10 characters) and select a category.');
      } else if (currentStep === 2) {
        setError('Minimum price is $5 and delivery time must be at least 1 day.');
      } else if (currentStep === 3) {
        setError('Description should be at least 30 characters long.');
      }
    }
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handlePublish = async () => {
    setError(null);
    setLoading(true);

    const payload = {
      title: formData.title,
      category: formData.category,
      description: formData.description,
      price: formData.price,
      deliveryTimeDays: formData.deliveryTimeDays,
      coverImage: formData.coverImage,
    };

    const res = await createGigAction(payload);

    if (!res.success) {
      setError(res.error || 'Failed to create gig');
      setLoading(false);
      return;
    }

    router.push('/dashboard/freelancer');
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-black antialiased pb-20">
      {/* Top Header / Breadcrumbs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/freelancer"
              className="text-xs font-semibold text-gray-500 hover:text-black transition"
            >
              &larr; Dashboard
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-xs font-bold text-black">Create a New Gig</span>
          </div>

          <Link
            href="/dashboard/freelancer"
            className="text-xs font-semibold text-gray-500 hover:text-red-600 transition"
          >
            Cancel
          </Link>
        </div>
      </div>

      {/* Stepper Task Bar */}
      <div className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-2xs">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div key={step.id} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center sm:flex-row sm:gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-[#178f23] text-white'
                          : isCurrent
                          ? 'bg-black text-white ring-4 ring-gray-100'
                          : 'border border-gray-300 bg-white text-gray-400'
                      }`}
                    >
                      {isCompleted ? '✓' : step.id}
                    </div>
                    <span
                      className={`mt-1 text-[11px] font-bold uppercase tracking-wider sm:mt-0 ${
                        isCurrent
                          ? 'text-black'
                          : isCompleted
                          ? 'text-emerald-700'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>

                  {index < STEPS.length - 1 && (
                    <div
                      className={`mx-2 hidden h-0.5 flex-1 sm:block ${
                        currentStep > step.id ? 'bg-[#178f23]' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="mx-auto mt-8 max-w-4xl px-4 sm:px-6">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
            {error}
          </div>
        )}

        <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-xs">
          
          {/* STEP 1: OVERVIEW */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-black">Gig Overview</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Give your service a descriptive title and choose the matching marketplace category.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Gig Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. I will build a full-stack web application in Next.js"
                  className="mt-2 block w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-black focus:border-black focus:outline-none"
                />
                <span className="mt-1.5 block text-[11px] text-gray-400">
                  Minimum 10 characters. Explain precisely what service you provide.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-2 block w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-black focus:border-black focus:outline-none"
                >
                  <option value="" disabled className="text-gray-400">
                    Select marketplace category
                  </option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="text-black">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: PRICING */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-black">Scope & Pricing</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Set your base price and realistic turnaround time for delivery.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6 space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Starting Price ($ USD)
                  </label>
                  <div className="relative mt-2">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 font-bold text-gray-400">
                      $
                    </span>
                    <input
                      type="number"
                      min="5"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-8 pr-4 text-sm font-bold text-black focus:border-black focus:outline-none"
                    />
                  </div>
                  <span className="text-[11px] text-gray-400">Minimum allowed price is $5.</span>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6 space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Delivery Time (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.deliveryTimeDays}
                    onChange={(e) =>
                      setFormData({ ...formData, deliveryTimeDays: Number(e.target.value) })
                    }
                    className="mt-2 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-black focus:border-black focus:outline-none"
                  />
                  <span className="text-[11px] text-gray-400">Expected duration to deliver project.</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DESCRIPTION */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-black">Service Description</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Briefly explain what clients will receive, tools and technologies you implement.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Detailed Description
                </label>
                <textarea
                  rows={8}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what services you offer, technologies used, workflow, and what clients will get..."
                  className="mt-2 block w-full rounded-2xl border border-gray-300 bg-white p-4 text-sm leading-relaxed text-black focus:border-black focus:outline-none"
                />
                <span className="mt-1.5 block text-[11px] text-gray-400">
                  Minimum 30 characters recommended.
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: MEDIA */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-black">Showcase Media</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Add an attractive cover image URL for buyers to preview your service.
                </p>
              </div>

              <div className="rounded-3xl border-2 border-dashed border-gray-300 p-8 text-center hover:border-black transition">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                  🖼️
                </div>
                <h4 className="mt-3 text-sm font-bold text-black">Gig Cover Image URL</h4>
                <p className="mt-1 text-xs text-gray-400">Paste direct image link (Unsplash, Cloudinary, etc.)</p>

                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="mt-5 block w-full max-w-md mx-auto rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs text-black focus:border-black focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & PUBLISH */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-black">Review & Publish</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Confirm all details before publishing this service live to the marketplace.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6 space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-xs">Title:</span>
                  <span className="font-bold text-black text-right max-w-md">{formData.title}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-xs">Category:</span>
                  <span className="font-semibold text-black">{formData.category}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-xs">Price:</span>
                  <span className="font-bold text-[#178f23]">${formData.price} USD</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-xs">Delivery Time:</span>
                  <span className="font-semibold text-black">{formData.deliveryTimeDays} Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-xs">Cover Image:</span>
                  <span className="font-medium text-gray-700 truncate max-w-xs">
                    {formData.coverImage || 'None (Default cover will be used)'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Actions Bar */}
          <div className="mt-10 flex items-center justify-between border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-bold text-gray-700 hover:border-black disabled:opacity-30 disabled:pointer-events-none transition"
            >
              &larr; Back
            </button>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid()}
                className="rounded-xl bg-black px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-gray-800 disabled:opacity-40 disabled:pointer-events-none transition"
              >
                Save & Continue &rarr;
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                disabled={loading}
                className="rounded-xl bg-[#178f23] px-8 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 transition"
              >
                {loading ? 'Publishing Gig...' : 'Publish Gig Now'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}