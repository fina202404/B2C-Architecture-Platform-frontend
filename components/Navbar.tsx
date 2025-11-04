'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Select, Dropdown, MenuProps, App } from 'antd';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { message } = App.useApp();
  const { i18n } = useTranslation();
  const router = useRouter();
  const { user, setUser, refreshUser } = useUser();

  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [localUser, setLocalUser] = useState<string | null>(null);

  // Detect scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mount + local name
  useEffect(() => {
    setMounted(true);
    const storedName = localStorage.getItem('name');
    if (storedName) setLocalUser(storedName);
  }, []);

  // Sync backend user
  useEffect(() => {
    if (mounted) refreshUser();
  }, [mounted, refreshUser]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    setUser(null);
    setLocalUser(null);
    message.success('Logged out successfully');
    router.push('/auth/login');
  };

  // Dropdown menu
  const menuItems: MenuProps['items'] = [
    { key: 'profile', label: <Link href="/dashboard/profile">Profile Settings</Link> },
    { key: 'logout', label: <span onClick={handleLogout}>Logout</span> },
  ];

  // Dashboard link by role
  const getDashboardHref = () => {
    const role = user?.role?.toLowerCase();
    if (role === 'client') return '/dashboard/client';
    if (role === 'admin') return '/dashboard/admin';
    if (role === 'architect') return '/dashboard/architect';
    return '/dashboard/client';
  };

  // Prevent SSR mismatch
  if (!mounted) return null;

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md border-b',
        'border-[#2F2F2F]'
      )}
      style={{
        // 👇 Always a dark translucent background so it never disappears on white sections
        background: scrolled ? 'rgba(20,20,20,0.92)' : 'rgba(20,20,20,0.85)',
      }}
    >
      <div className="mx-auto max-w-[1400px] flex items-center justify-between px-6"
           style={{ height: 72 }}>
        {/* Brand */}
        <Link href="/" className="font-bold text-sm md:text-base tracking-widest uppercase whitespace-nowrap text-white">
          WAIS ARCHITECTURE PLATFORM
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link className="text-white/90 hover:text-white" href="/">Home</Link>
          <Link className="text-white/90 hover:text-white" href="/about">About Us</Link>
          <Link className="text-white/90 hover:text-white" href="/services">Services</Link>
          <Link className="text-white/90 hover:text-white" href="/projects">Projects</Link>
          <Link className="text-white/90 hover:text-white" href="/contact">Contact</Link>
        </nav>

        {/* Right: Language + Auth */}
        <div className="flex items-center gap-3">
          <Select
            value={i18n.language}
            onChange={(lng) => i18n.changeLanguage(lng)}
            options={[
              { value: 'en', label: 'EN' },
              { value: 'fr', label: 'FR' },
              { value: 'ar', label: 'AR' },
            ]}
            size="small"
            style={{ minWidth: 72 }}
            // dark select popup
            styles={{ popup: { root: { background: '#1F1F1F' } } } as any}
          />

          {!user && !localUser ? (
            <Link
              href="/auth/login"
              className="hidden md:inline-block px-3 py-1 rounded border transition text-white border-white hover:bg-white hover:text-black"
            >
              Login
            </Link>
          ) : (
            <Dropdown menu={{ items: menuItems }} placement="bottomRight">
              <button
                className="px-3 py-1 rounded border text-sm font-medium transition text-white border-white hover:bg-white hover:text-black"
                onClick={() => router.push(getDashboardHref())}
              >
                Hi, {user?.fullName?.split(' ')[0] || localUser || 'User'}
              </button>
            </Dropdown>
          )}
        </div>
      </div>
    </header>
  );
}
