import Link from 'next/link';
import Image from 'next/image';
import { connectDB } from '@/lib/mongodb';
import { Gig } from '@/models/Gig';
import '@/models/User';

interface IGigItem {
  _id: string;
  title: string;
  category: string;
  price: number;
  deliveryTimeDays: number;
  coverImage?: string;
  createdAt: string;
}

async function getFreelancerGigs(userId?: string): Promise<IGigItem[]> {
  try {
    await connectDB();

    const filter = userId ? { freelancerId: userId } : {};
    const gigs = await Gig.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(gigs));
  } catch (error) {
    console.error('Failed to fetch freelancer gigs:', error);
    return [];
  }
}

export default async function FreelancerGigsPage() {
  const gigs = await getFreelancerGigs();

  return (
    <div className="space-y-6">
      {/* Header & Create Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
            My Gigs
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your published services, track pricing, and create new offerings.
          </p>
        </div>

        <Link
          href="/dashboard/freelancer/gigs/new"
          className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-gray-800"
        >
          + Create New Gig
        </Link>
      </div>

      {/* Gigs Content */}
      {gigs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
            ⚡
          </div>
          <h3 className="mt-4 text-base font-bold text-black">No gigs published yet</h3>
          <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
            You have not created any service listings. Start offering your freelance services to buyers today.
          </p>
          <Link
            href="/dashboard/freelancer/gigs/new"
            className="mt-5 inline-block rounded-xl bg-black px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-gray-800"
          >
            Create Your First Gig
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 bg-gray-50/75 text-gray-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 pl-6 pr-3">Service</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Price</th>
                  <th className="py-3.5 px-3">Delivery</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {gigs.map((gig) => (
                  <tr key={gig._id} className="hover:bg-gray-50/60 transition">
                    <td className="py-4 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                          {gig.coverImage ? (
                            <Image
                              src={gig.coverImage}
                              alt={gig.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                              No Img
                            </div>
                          )}
                        </div>
                        <div className="max-w-xs">
                          <Link
                            href={`/gigs/${gig._id}`}
                            className="font-semibold text-black hover:underline line-clamp-1"
                          >
                            {gig.title}
                          </Link>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-3">
                      <span
                        className="inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold"
                        style={{ color: '#178f23', backgroundColor: '#eaf6ec' }}
                      >
                        {gig.category}
                      </span>
                    </td>

                    <td className="py-4 px-3 font-bold text-black">
                      ${gig.price}
                    </td>

                    <td className="py-4 px-3 text-gray-500">
                      {gig.deliveryTimeDays} {gig.deliveryTimeDays === 1 ? 'day' : 'days'}
                    </td>

                    <td className="py-4 px-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </td>

                    <td className="py-4 pl-3 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/gigs/${gig._id}`}
                          className="rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-600 hover:border-black hover:text-black transition"
                        >
                          View
                        </Link>
                        <Link
                          href={`/dashboard/freelancer/gigs/${gig._id}/edit`}
                          className="rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-600 hover:border-black hover:text-black transition"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}