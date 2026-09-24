import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import { Gig } from '@/models/Gig';
import '@/models/User';

import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import ValueProposition from '@/components/ValueProposition';
import GigCard, { IGigItem } from '@/components/GigCard';
import FreelancerCTA from '@/components/FreelancerCTA';
import Footer from '@/components/Footer';

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

export default async function HomePage({ searchParams }: HomePageProps) {
  const { query, category } = await searchParams;
  const gigs = await getFeaturedGigs(query, category);

  return (
    <div className="min-h-screen bg-[#f9fafb] text-black antialiased">
      <Navbar />
      <HeroSection query={query} category={category} />
      <CategoryGrid />
      <ValueProposition />

      {/* Main Gigs Listing */}
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
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
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>
        )}
      </main>

      <FreelancerCTA />
      <Footer />
    </div>
  );
}