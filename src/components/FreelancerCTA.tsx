import Link from 'next/link';

export default function FreelancerCTA() {
  return (
    <section className="border-t border-gray-200 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="flex flex-col items-center justify-between gap-6 rounded-3xl p-10 text-white sm:flex-row md:p-14"
          style={{ backgroundColor: '#178f23' }}
        >
          <div>
            <h2 className="text-3xl font-extrabold">Become a Freelancer on VisionLK</h2>
            <p className="mt-2 text-sm text-green-100">
              Share your skills, reach verified clients worldwide, and earn on your schedule.
            </p>
          </div>
          <Link
            href="/register"
            className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-gray-800"
          >
            Get Started &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}