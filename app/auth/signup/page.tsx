'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerClient } from '@/lib/api';
import { App } from 'antd';

export default function SignupPage() {
  const router = useRouter();
  const { message } = App.useApp();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    clientType: 'private' as 'private' | 'corporate' | 'public',
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await registerClient(form);
      message.success('Account created. Please log in.');
      router.push('/auth/login');
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || 'Sign up failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6"
      >
        <h1 className="text-2xl font-semibold text-center">
          Create Your Account
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              className="w-full border border-borderSoft rounded p-3 text-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accentGold focus:border-accentGold"
              placeholder="Your name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-borderSoft rounded p-3 text-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accentGold focus:border-accentGold"
              placeholder="you@email.com"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-borderSoft rounded p-3 text-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accentGold focus:border-accentGold"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </div>

          {/* Client type from proposal: Private / Corporate / Public Entity */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              I am a...
            </label>
            <select
              className="w-full border border-borderSoft rounded p-3 text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-accentGold focus:border-accentGold"
              value={form.clientType}
              onChange={(e) =>
                setForm({
                  ...form,
                  clientType: e.target.value as
                    | 'private'
                    | 'corporate'
                    | 'public',
                })
              }
            >
              <option value="private">Private Client (Homeowner / Buyer)</option>
              <option value="corporate">
                Corporate Client (Business / Developer)
              </option>
              <option value="public">
                Public Entity (Government / Municipality)
              </option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded text-sm font-semibold hover:bg-gray-900 transition"
        >
          {loading ? 'Creating Account…' : 'Sign Up'}
        </button>

        <p className="text-sm text-center">
          Already registered?{' '}
          <a
            href="/auth/login"
            className="text-blue-600 hover:underline"
          >
            Log in
          </a>
        </p>
      </form>
    </main>
  );
}
