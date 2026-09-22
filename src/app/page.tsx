import Link from 'next/link';
import Image from 'next/image';
import { connectDB } from '@/lib/mongodb';
import { Gig } from '@/models/Gig';
import '@/models/User';

interface IGigItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  deliveryTimeDays: number;
  coverImage?: string;
  freelancerId: {
    _id: string;
    name: string;
    email: string;
  };
}

interface HomePageProps {
  searchParams: Promise<{ query?: string; category?: string }>;
}

async function getFeaturedGigs(query?: string, category?: string): Promise<IGigItem[]> {
  try {
    await connectDB();

    const filter: Record<string, unknown> = {};

    if (query) {
      filter.$or = [
        { title: { $regex: query,$options: 'i' } },
        { description: { $regex: query,$options: 'i' } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    const gigs = await Gig.find(filter)
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();

    return JSON.parse(JSON.stringify(gigs));
  } catch (error) {
    console.error('Failed to fetch gigs:', error);
    return [];
  }
}

const POPULAR_TAGS = [
  'Web Development',
  'Graphic Design',
  'Digital Marketing',
  'AI Services',
];

export default async function HomePage({ searchParams }: HomePageProps) {
  const { query, category } = await searchParams;
  const gigs = await getFeaturedGigs(query, category);

  return (
    <div className="min-h-screen bg-[#f9fafb] text-black antialiased">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-black tracking-tight text-black">
            Vision<span style={{ color: '#178f23' }}>LK</span>
          </Link>

          <div className="flex items-center gap-4">
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
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-gray-100 bg-white px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-black sm:text-5xl lg:text-6xl">
            Find the right freelance services for your business
          </h1>
          <p className="mt-4 text-base text-gray-600 sm:text-lg">
            Browse top-quality services offered by verified talent worldwide.
          </p>

          {/* Search Form */}
          <form action="/" method="GET" className="mx-auto mt-8 flex max-w-xl items-center shadow-sm">
            <div className="relative w-full">
              <input
                type="text"
                name="query"
                defaultValue={query || ''}
                placeholder="What service are you looking for today?"
                className="w-full rounded-l-xl border border-gray-300 bg-white py-3.5 pl-4 pr-10 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <button
              type="submit"
              className="rounded-r-xl bg-black px-7 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Search
            </button>
          </form>

          {/* Tag Filters */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-600">
            <span className="font-medium text-gray-400">Popular:</span>
            {POPULAR_TAGS.map((tag) => {
              const isActive = category === tag;
              return (
                <Link
                  key={tag}
                  href={`/?category=${encodeURIComponent(tag)}`}
                  className={`rounded-full border px-3.5 py-1 transition ${
                    isActive
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-black hover:text-black'
                  }`}
                >
                  {tag}
                </Link>
              );
            })}
            {(query || category) && (
              <Link
                href="/"
                className="rounded-full border border-gray-300 bg-gray-100 px-3.5 py-1 text-xs font-medium text-black transition hover:bg-gray-200"
              >
                Clear Filter ✕
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Gigs List Section */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-black">
              {query
                ? `Search results for "${query}"`
                : category
                ? `${category} Services`
                : 'Popular Services'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {gigs.length} {gigs.length === 1 ? 'service' : 'services'} available
            </p>
          </div>
        </div>

        {gigs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-base text-gray-600">No matching services were found.</p>
            <p className="mt-1 text-sm text-gray-400">Try adjusting your search terms or category filter.</p>
            <Link
              href="/"
              className="mt-5 inline-block text-sm font-semibold hover:underline"
              style={{ color: '#178f23' }}
            >
              Review all services &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {gigs.map((gig) => (
              <div
                key={gig._id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Cover Image */}
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  {gig.coverImage ? (
                    <Image
                      src={gig.coverImage}
                      alt={gig.title}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
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
                    <span className="text-gray-400">
                      {gig.deliveryTimeDays}d delivery
                    </span>
                  </div>

                  <h3 className="line-clamp-2 text-sm font-semibold text-black transition group-hover:text-[#178f23]">
                    {gig.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 flex-1 text-xs text-gray-500 leading-relaxed">
                    {gig.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-xs text-gray-500 truncate max-w-[120px]">
                      By {gig.freelancerId?.name || 'Freelancer'}
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-gray-400 block leading-none">Starting at</span>
                      <span className="text-base font-bold text-black leading-tight">
                        ${gig.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}