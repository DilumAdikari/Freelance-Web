import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} VisionLK Marketplace. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-black">Privacy Policy</Link>
            <Link href="/" className="hover:text-black">Terms of Service</Link>
            <Link href="/" className="hover:text-black">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}