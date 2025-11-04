'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api';
import { App } from 'antd';

export default function LoginPage() {
  const { message } = App.useApp();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser(email, password);

      // ✅ Support both API response formats
      const token =
        res.data?.accessToken || res.token || res.accessToken || null;
      const refreshToken =
        res.data?.refreshToken || res.refreshToken || '';
      const user =
        res.data?.user || res.user || null;

      if (!res.success || !user || !token) {
        throw new Error('Invalid login response');
      }

      // ✅ Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role || '');
      localStorage.setItem('email', user.email || '');
      localStorage.setItem('fullName', user.fullName || '');

      message.success(`Welcome back, ${user.fullName}!`);

      // ✅ Role-based redirect
      const role = (user.role || '').toLowerCase();
      if (role === 'architect') {
        router.push('/dashboard/architect/overview');
      } else if (role === 'client') {
        router.push('/dashboard/client');
      } else if (role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error('LOGIN ERROR:', err);
      message.error(
        err?.response?.data?.error?.message ||
          err?.message ||
          'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6"
      >
        <h1 className="text-2xl font-semibold text-center">Sign In</h1>

        <input
          type="email"
          className="w-full border border-borderSoft rounded p-3 text-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accentGold focus:border-accentGold"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full border border-borderSoft rounded p-3 text-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accentGold focus:border-accentGold"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded text-sm font-semibold hover:bg-gray-900 transition"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        <p className="text-sm text-center">
          New here?{' '}
          <a className="text-blue-600 hover:underline" href="/auth/signup">
            Create an account
          </a>
        </p>

        <p className="text-xs text-center text-gray-500">
          Forgot password? (feature coming soon)
        </p>
      </form>
    </main>
  );
}
