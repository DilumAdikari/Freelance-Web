'use client';

import Link from 'next/link';

export interface IGigItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  deliveryTimeDays?: number;
  deliveryDays?: number;
  coverImage?: string;
  freelancerId?: {
    _id?: string;
    name?: string;
    email?: string;
  };
}

export default function GigCard({ gig }: { gig: IGigItem }) {
  const deliveryDays = gig.deliveryTimeDays || gig.deliveryDays || 3;
  const sellerName = gig.freelancerId?.name || 'Freelancer';

  return (
    <Link
      href={`/gigs/${gig._id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs transition hover:-translate-y-1 hover:shadow-md cursor-pointer"
    >
      {/* Cover Image */}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden flex items-center justify-center">
        {gig.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={gig.coverImage}
            alt={gig.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs font-medium text-gray-400">
            No Image Provided
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2.5 flex items-center justify-between text-xs">
          <span className="font-semibold" style={{ color: '#178f23' }}>
            {gig.category}
          </span>
          <span className="text-gray-400">{deliveryDays}d delivery</span>
        </div>

        <h3 className="line-clamp-2 text-sm font-semibold text-black transition group-hover:text-[#178f23]">
          {gig.title}
        </h3>

        <p className="mt-2 line-clamp-2 flex-1 text-xs text-gray-500 leading-relaxed">
          {gig.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-xs text-gray-500 truncate max-w-[120px]">
            By {sellerName}
          </span>
          <div className="text-right">
            <span className="text-[10px] uppercase text-gray-400 block leading-none">Starting at</span>
            <span className="text-base font-bold text-black leading-tight">
              ${gig.price}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}