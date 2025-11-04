'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCurrentUser } from '../lib/api';

// ==============================
// 🧠 Interfaces
// ==============================
interface UserInfo {
  _id?: string;
  role?: 'Client' | 'Architect' | 'Admin';
  fullName?: string;
  email?: string;
}

interface AuthGuardReturn {
  user: UserInfo | null;
  token: string | null;
  loading: boolean;
}

// ==============================
// 🔐 Auth Guard Hook
// ==============================
export function useAuthGuard(expectedRole?: 'client' | 'architect' | 'admin'): AuthGuardReturn {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyUser() {
      try {
        // ✅ 1️⃣ Get token safely
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
          router.replace('/auth/login');
          return;
        }

        // ✅ 2️⃣ Fetch current user from backend
        const res = await fetchCurrentUser(storedToken);
        if (!res || !res.data) throw new Error('Invalid token or user not found');

        const currentUser = res.data;
        setUser(currentUser);
        setToken(storedToken);

        // ✅ 3️⃣ Role check
        const role = currentUser.role?.toLowerCase();
        if (expectedRole && role !== expectedRole.toLowerCase()) {
          router.replace(`/dashboard/${role}`);
        }
      } catch (err) {
        console.error('❌ AuthGuard error:', err);
        localStorage.removeItem('token');
        router.replace('/auth/login');
      } finally {
        setLoading(false);
      }
    }

    verifyUser();
  }, [expectedRole, router]);

  // 🕒 Loading state
  if (loading) return { user: null, token: null, loading: true };

  return { user, token, loading };
}

// ==============================
// 🚪 Logout Helper
// ==============================
export function logout() {
  [
    'token',
    'refreshToken',
    'role',
    'name',
    'fullName',
    'email',
    'user',
    'userId',
  ].forEach((key) => localStorage.removeItem(key));

  window.location.href = '/auth/login';
}
