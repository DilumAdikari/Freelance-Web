'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginAction } from '@/actions/auth';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    const res = await loginAction(data);

    if (!res.success) {
      setError(res.error || 'Login failed');
      setLoading(false);
      return;
    }

    if (res.role === 'CLIENT') {
      router.push('/dashboard/client');
    } else {
      router.push('/dashboard/freelancer');
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#f9fafb] px-4 py-12 sm:px-6 lg:px-8 text-black antialiased">
      {/* Branding Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block text-3xl font-black tracking-tight text-black">
          Vision<span style={{ color: '#178f23' }}>LK</span>
        </Link>
        <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-semibold transition hover:underline"
            style={{ color: '#178f23' }}
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* Login Card Form */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-600">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-600"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-600"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-gray-400 hover:text-black transition"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-black py-3 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Bottom Security Note */}
          <div className="mt-6 border-t border-gray-100 pt-5 text-center">
            <p className="text-xs text-gray-400">
              Secured with VisionLK encrypted authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}