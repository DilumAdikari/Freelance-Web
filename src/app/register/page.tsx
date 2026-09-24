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

      {/* STEP 1: POPUP STYLE ROLE SELECTION CARDS */}
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
                <p className="mt-1 text-xs text-gray-500">
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
                <p className="mt-1 text-xs text-gray-500">
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

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-600"
                >
                  Full Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Dilum Adikari"
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

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-600"
                >
                  Password
                </label>
                <div className="mt-2">
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