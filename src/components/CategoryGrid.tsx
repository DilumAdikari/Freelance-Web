import Link from 'next/link';

const MAIN_CATEGORIES = [
  { name: 'Web Development', icon: '💻', count: '100+ services' },
  { name: 'Graphic Design', icon: '🎨', count: '80+ services' },
  { name: 'Digital Marketing', icon: '📈', count: '60+ services' },
  { name: 'Writing & Translation', icon: '✍️', count: '45+ services' },
  { name: 'Video & Animation', icon: '🎬', count: '30+ services' },
  { name: 'AI Services', icon: '🤖', count: '25+ services' },
];

export default function CategoryGrid() {
  return (
    <section className="border-b border-gray-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-bold tracking-tight text-black">
          Explore Marketplace Categories
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {MAIN_CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/?category=${encodeURIComponent(cat.name)}`}
              className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-5 text-center transition hover:-translate-y-1 hover:border-black hover:shadow-md"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="mt-3 text-xs font-bold text-black">{cat.name}</span>
              <span className="mt-1 text-[11px] text-gray-400">{cat.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}