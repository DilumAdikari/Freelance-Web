import Link from 'next/link';

export default function FreelancerDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Freelancer Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back! Browse jobs and manage your proposals.</p>
          </div>
          <Link
            href="/login"
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Log Out
          </Link>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Active Proposals</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">0</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Completed Projects</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">$0.00</p>
          </div>
        </div>
      </div>
    </div>
  );
}