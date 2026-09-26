'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerAction } from '@/actions/auth';

type UserRole = 'CLIENT' | 'FREELANCER';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<'ROLE_SELECT' | 'FORM'>('ROLE_SELECT');
  const [selectedRole, setSelectedRole] = useState<UserRole>('FREELANCER');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: selectedRole,
    };

    const res = await registerAction(data);

    if (!res.success) {
      setError(res.error || 'Registration failed');
      setLoading(false);
      return;
    }

    if (res.role === 'CLIENT') {
      router.push('/dashboard/client');
    } else {
      router.push('/dashboard/freelancer');
    }
  }

  const handleSocialAuth = (provider: 'google' | 'apple' | 'linkedin') => {
    console.log(`Continue with ${provider} as ${selectedRole}`);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#f9fafb] px-4 py-12 sm:px-6 lg:px-8 text-black antialiased">
      {/* Branding Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block text-3xl font-black tracking-tight text-black">
          Vision<span style={{ color: '#178f23' }}>LK</span>
        </Link>
        <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
          {step === 'ROLE_SELECT' ? 'Join as a client or freelancer' : 'Create an account'}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold transition hover:underline"
            style={{ color: '#178f23' }}
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* STEP 1: ROLE SELECTION CARDS */}
      {step === 'ROLE_SELECT' && (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Client Option */}
            <div
              onClick={() => setSelectedRole('CLIENT')}
              className={`cursor-pointer rounded-2xl border p-6 transition flex flex-col justify-between bg-white shadow-sm hover:shadow-md ${
                selectedRole === 'CLIENT'
                  ? 'border-black ring-2 ring-black'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">💼</span>
                <span
                  className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                    selectedRole === 'CLIENT'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedRole === 'CLIENT' && <span className="text-xs">✓</span>}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-base font-bold text-black">I’m a client, hiring for a project</h3>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                  Find talent, manage orders, and grow your business.
                </p>
              </div>
            </div>

            {/* Freelancer / Seller Option */}
            <div
              onClick={() => setSelectedRole('FREELANCER')}
              className={`cursor-pointer rounded-2xl border p-6 transition flex flex-col justify-between bg-white shadow-sm hover:shadow-md ${
                selectedRole === 'FREELANCER'
                  ? 'border-black ring-2 ring-black'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">💻</span>
                <span
                  className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                    selectedRole === 'FREELANCER'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedRole === 'FREELANCER' && <span className="text-xs">✓</span>}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-base font-bold text-black">I’m a freelancer, looking for work</h3>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                  Offer your skills and services to verified buyers worldwide.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setStep('FORM')}
              className="w-full sm:w-64 rounded-xl bg-black py-3.5 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
            >
              Join as {selectedRole === 'CLIENT' ? 'a Client' : 'a Freelancer'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: REGISTRATION FORM */}
      {step === 'FORM' && (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
            {/* Selected Role Indicator & Edit */}
            <div className="mb-6 flex items-center justify-between rounded-xl bg-gray-50 p-3 border border-gray-100">
              <span className="text-xs text-gray-600">
                Applying as:{' '}
                <strong className="text-black font-semibold">
                  {selectedRole === 'CLIENT' ? 'Client' : 'Freelancer (Seller)'}
                </strong>
              </span>
              <button
                type="button"
                onClick={() => setStep('ROLE_SELECT')}
                className="text-xs font-semibold hover:underline"
                style={{ color: '#178f23' }}
              >
                Change
              </button>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-600">
                {error}
              </div>
            )}

            {/* Email / Password Form (FIRST) */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-600"
                >
                  Full Name
                </label>
                <div className="mt-1.5">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Full Name"
                    className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-600"
                >
                  Email address
                </label>
                <div className="mt-1.5">
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

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-600"
                >
                  Password
                </label>
                <div className="mt-1.5">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
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
                  className="flex w-full items-center justify-center rounded-xl bg-black py-3.5 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creating account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>

            {/* DIVIDER */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-400 font-medium">Or continue with</span>
              </div>
            </div>

            {/* SOCIAL AUTH BUTTONS (NOW BELOW THE FORM) */}
            <div className="space-y-2.5">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleSocialAuth('google')}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white py-2.5 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:border-gray-400"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.93 6.72-4.93z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Apple */}
              <button
                type="button"
                onClick={() => handleSocialAuth('apple')}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white py-2.5 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:border-gray-400"
              >
                <svg className="h-4 w-4 fill-current text-black" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.6-7.79-11.74-14.24-6.2-9.58-11.1-20.81-14.7-33.68-3.6-12.87-5.4-24.64-5.4-35.31 0-14.77 3.52-27.06 10.56-36.87 7.04-9.81 16.03-14.82 26.97-15.02 5.09 0 10.63 1.34 16.63 4.02 6 2.68 9.94 4.08 11.82 4.2 1.57-.12 5.66-1.57 12.28-4.36 6.62-2.79 12.33-4.05 17.13-3.79 13.04.67 23.47 5.74 31.29 15.22-11.24 6.8-16.74 16.32-16.5 28.56.25 9.7 3.99 17.76 11.22 24.18 7.23 6.42 15.82 10.02 25.77 10.8-2.35 7.15-5.13 14.12-8.34 20.91zm-32.99-106.84c.12-3.23.85-6.68 2.19-10.35 1.34-3.67 3.17-6.84 5.49-9.51 2.32-2.67 5.12-4.85 8.4-6.55 3.28-1.7 6.47-2.78 9.57-3.25-.13 3.35-.91 6.89-2.34 10.62-1.43 3.73-3.32 6.94-5.67 9.63-2.35 2.69-5.13 4.88-8.34 6.57-3.21 1.69-6.31 2.69-9.3 3.01z" />
                </svg>
                Continue with Apple
              </button>

              {/* LinkedIn */}
              <button
                type="button"
                onClick={() => handleSocialAuth('linkedin')}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white py-2.5 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:border-gray-400"
              >
                <svg className="h-4 w-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                Continue with LinkedIn
              </button>
            </div>

            {/* Terms Footer */}
            <div className="mt-6 border-t border-gray-100 pt-5 text-center">
              <p className="text-xs text-gray-400">
                By registering, you agree to VisionLK Terms of Service & Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}