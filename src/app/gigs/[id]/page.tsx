import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { connectDB } from '@/lib/mongodb';
import { Gig } from '@/models/Gig';
import { User } from '@/models/User';
import { createOrderAction } from '@/actions/orders';

interface GigPageProps {
  params: Promise<{ id: string }> | { id: string };
}

interface IGigDetails {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTimeDays?: number;
  deliveryDays?: number;
  coverImage?: string;
  userId?: string;
  freelancerId?: string;
}

interface ISellerDetails {
  _id: string;
  name?: string;
  email?: string;
}

export default async function GigDetailsPage({ params }: GigPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  await connectDB();

  let gig: IGigDetails | null = null;
  let seller: ISellerDetails | null = null;

  try {
    gig = await Gig.findById(id).lean<IGigDetails>();

    if (gig) {
      const sellerId = gig.freelancerId || gig.userId;
      if (sellerId) {
        seller = await User.findById(sellerId).select('name email').lean<ISellerDetails>();
      }
    }
  } catch (err) {
    console.error('Error fetching gig details:', err);
    return notFound();
  }

  if (!gig) {
    return notFound();
  }

  const sellerName = seller?.name || 'Professional Seller';
  const sellerInitial = sellerName.charAt(0).toUpperCase();
  const deliveryDays = gig.deliveryTimeDays || gig.deliveryDays || 3;

  // Direct Server Action Handler for Instant Order Placement
  async function handleOrderSubmit() {
    'use server';
    const res = await createOrderAction(id);
    if (res.success) {
      redirect('/dashboard/client');
    }
  }

  return (
    <div className="min-h-screen bg-white text-black antialiased">
      {/* Breadcrumb Navigation Bar */}
      <div className="border-b border-gray-100 bg-[#fafafa]">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-xs text-gray-500 sm:px-6">
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
          <span>/</span>
          <span className="font-medium text-black">{gig.category || 'Service'}</span>
          <span>/</span>
          <span className="truncate max-w-[200px] text-gray-400">{gig.title}</span>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* ================= LEFT SECTION: GIG DETAILS ================= */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 mb-3">
                {gig.category}
              </span>
              <h1 className="text-2xl font-black tracking-tight text-black sm:text-3xl leading-snug">
                {gig.title}
              </h1>

              {/* Seller Top Bar */}
              <div className="mt-4 flex items-center gap-3 border-y border-gray-100 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-bold text-white shadow-xs">
                  {sellerInitial}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black">{sellerName}</h4>
                  <p className="text-[11px] text-gray-500">Professional Seller • ⭐ 5.0</p>
                </div>
              </div>
            </div>

            {/* Gig Image Display */}
            <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 h-[360px] sm:h-[420px]">
              {gig.coverImage ? (
                <Image
                  src={gig.coverImage}
                  alt={gig.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 text-center p-6">
                  <span className="text-5xl mb-2">💻</span>
                  <h3 className="text-lg font-bold text-gray-800">{gig.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">High quality digital service delivered on VisionLK</p>
                </div>
              )}
            </div>

            {/* About Gig Description */}
            <div className="space-y-4">
              <h2 className="text-lg font-black tracking-tight text-black border-b border-gray-100 pb-3">
                About This Gig
              </h2>
              <div className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                {gig.description}
              </div>
            </div>

            {/* About Seller Profile Card */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-black">About The Seller</h3>

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-xl font-bold text-white shadow-md">
                  {sellerInitial}
                </div>
                <div>
                  <h4 className="text-base font-bold text-black">{sellerName}</h4>
                  <p className="text-xs text-gray-500">Verified Seller on VisionLK</p>
                  <span className="mt-1 inline-block text-[11px] font-semibold text-emerald-600">
                    ● Active
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 text-xs">
                <div>
                  <span className="text-gray-400">From</span>
                  <p className="font-semibold text-gray-800">Sri Lanka 🇱🇰</p>
                </div>
                <div>
                  <span className="text-gray-400">Member Since</span>
                  <p className="font-semibold text-gray-800">2026</p>
                </div>
                <div>
                  <span className="text-gray-400">Avg. Response Time</span>
                  <p className="font-semibold text-gray-800">1 Hour</p>
                </div>
                <div>
                  <span className="text-gray-400">Languages</span>
                  <p className="font-semibold text-gray-800">English, Sinhala</p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SECTION: ORDER SIDEBAR ================= */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Standard Package
                </span>
                <span className="text-2xl font-black text-black">
                  ${gig.price} <span className="text-xs font-normal text-gray-400">USD</span>
                </span>
              </div>

              <div className="space-y-3 text-xs text-gray-600">
                <div className="flex items-center gap-2 font-semibold text-black">
                  <span>⏱️</span>
                  <span>{deliveryDays} Days Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🔄</span>
                  <span>Unlimited Revisions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⚡</span>
                  <span>Full Commercial Rights</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <form action={handleOrderSubmit}>
                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-black py-3.5 text-xs font-bold text-white shadow-sm hover:bg-gray-800 transition cursor-pointer"
                  >
                    Continue (${gig.price}) &rarr;
                  </button>
                </form>

                <button
                  type="button"
                  className="w-full rounded-2xl border border-gray-300 bg-white py-3 text-xs font-bold text-gray-700 hover:border-black transition"
                >
                  Contact Seller
                </button>
              </div>

              <div className="border-t border-gray-100 pt-4 text-center">
                <p className="text-[11px] text-gray-400">
                  🔒 Secure checkout powered by VisionLK Escrow
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}