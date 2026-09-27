'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export const CATEGORIES = [
  'All Services',
  'Web Development',
  'Graphic Design',
  'Digital Marketing',
  'Writing & Translation',
  'Video & Animation',
  'AI Services',
];

export default function CategoryNavbar() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All Services';

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-[65px] z-20 shadow-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center gap-2 sm:gap-6 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
          {CATEGORIES.map((category) => {
            const isAll = category === 'All Services';
            const isActive = isAll
              ? currentCategory === 'All Services'
              : currentCategory.toLowerCase() === category.toLowerCase();

            // Link query parameters සැකසීම
            const href = isAll ? '/' : `/?category=${encodeURIComponent(category)}`;

            return (
              <li key={category} className="shrink-0">
                <Link
                  href={href}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-150 inline-block ${
                    isActive
                      ? 'bg-black text-white shadow-sm'
                      : 'text-gray-600 hover:text-black hover:bg-gray-100'
                  }`}
                >
                  {category}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}