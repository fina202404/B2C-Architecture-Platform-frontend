'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

type User = {
  fullName: string;
  email: string;
  role: string;
} | null;

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  refreshUser: async () => {},
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  // ✅ define refreshUser before using it in useEffect
  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const res = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.data) {
        setUser(res.data.data);
        localStorage.setItem('name', res.data.data.fullName || '');
      }
    } catch (err) {
      console.error('❌ Failed to load user:', err);
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  // ✅ Load user when app starts
  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}
