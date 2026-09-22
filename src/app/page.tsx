import Link from 'next/link';
import Image from 'next/image';
import { connectDB } from '@/lib/mongodb';
import { Gig } from '@/models/Gig';
// User model එක register වීම සඳහා මෙහි import කරන්න
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

async function getFeaturedGigs(): Promise<IGigItem[]> {
  try {
    await connectDB();
    const gigs = await Gig.find({})
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    return JSON.parse(JSON.stringify(gigs));
  } catch (error) {
    console.error('Failed to fetch gigs:', error);
    return [];
  }
}

export default async function HomePage() {
  const gigs = await getFeaturedGigs();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navigation Bar */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-black tracking-tight text-black">
            Freelance<span className="text-blue-600">Hub</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Join
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-gray-100 bg-white px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Find the right freelance services for your business
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Browse top-quality services offered by verified talent worldwide.
          </p>
        </div>
      </section>

      {/* Gigs List Section */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Popular Services</h2>
            <p className="text-sm text-gray-500">Most recently published gigs</p>
          </div>
        </div>

        {gigs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-gray-500">තවමත් කිසිදු Gig එකක් පළ කර නොමැත.</p>
            <Link
              href="/dashboard/freelancer/gigs/new"
              className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              අලුත් Gig එකක් පළ කරන්න &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {gigs.map((gig) => (
              <div
                key={gig._id}
                className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Gig Cover Image */}
                <div className="relative h-44 w-full bg-gray-100">
                  {gig.coverImage ? (
                    <Image
                      src={gig.coverImage}
                      alt={gig.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                      No Image Provided
                    </div>
                  )}
                </div>

                {/* Gig Details */}
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                    <span className="font-semibold text-blue-600">{gig.category}</span>
                    <span>{gig.deliveryTimeDays} days delivery</span>
                  </div>

                  <h3 className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-blue-600">
                    {gig.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 flex-1 text-xs text-gray-500">
                    {gig.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-xs text-gray-500">
                      By {gig.freelancerId?.name || 'Freelancer'}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      ${gig.price}
                    </span>
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