import Link from 'next/link';

const POPULAR_TAGS = [
  'Web Development',
  'Graphic Design',
  'Digital Marketing',
  'AI Services',
];

interface HeroSectionProps {
  query?: string;
  category?: string;
}

export default function HeroSection({ query, category }: HeroSectionProps) {
  return (
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
  );
}